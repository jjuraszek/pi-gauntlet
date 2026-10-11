const mappings = {
  github: { body: 'body', workflow: 'workflow', reference: 'url' },
  linear: { body: 'description', workflow: 'state', reference: 'url' },
  custom: { body: 'content', workflow: 'phase', reference: 'reference' },
};
const tokens = text => String(text).toLowerCase().match(/[a-z0-9]+/g) ?? [];
const copy = value => structuredClone(value);
export function createTracker(scenario, { now = Date.now } = {}) {
  const mapping = mappings[scenario.tracker] ?? mappings.custom;
  const mapFields = (value, native) => {
    const result = copy(value);
    for (const [canonical, mapped] of Object.entries({ body: mapping.body, workflow: mapping.workflow, url: mapping.reference })) {
      const from = native ? canonical : mapped, to = native ? mapped : canonical;
      if (Object.hasOwn(result, from) && from !== to) { result[to] = result[from]; delete result[from]; }
    }
    return result;
  };
  const tickets = copy(scenario.tickets);
  const trace = [], violations = [];
  const visible = new Set();
  const namedSources = new Set(tickets.filter(t => scenario.prompt.includes(t.url) || new RegExp(`(^|[^A-Za-z0-9])${t.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z0-9]|$)`).test(scenario.prompt)).map(t => t.id));
  const detailed = new Set(), exposedLinks = new Set(), fetchedLinks = new Set();
  const documents = copy(scenario.documents ?? []);
  const faults = scenario.faults ?? {};
  let start, searches = 0, bytes = 0;
  const violation = rule => violations.push({ rule, at: now() });
  const execute = async (operation, args = {}, authority = { discovery: true }) => {
    const entry = { operation, args: copy(args), at: now() };
    trace.push(entry);
    const discoveryRead = authority.discovery && ['search', 'read', 'read-document'].includes(operation);
    const finish = result => {
      entry.result = copy(result); entry.elapsedMs = now() - entry.at;
      if (discoveryRead && start !== undefined && entry.at - start <= 120000 && entry.at + entry.elapsedMs - start > 120000) violation('elapsed-overrun');
      return result;
    };
    if (['create', 'update', 'comment', 'relation'].includes(operation)) {
      violation('no-live-writers');
      return finish({ error: 'read-only' });
    }
    if (faults.unsupported?.includes(operation)) return finish({ error: 'unsupported' });
    if (discoveryRead) {
      start ??= entry.at;
      if (entry.at - start > 120000) violation('elapsed-cap');
    }
    if (operation === 'search') {
      if (++searches > 6) violation('search-cap');
      if ((args.limit ?? 20) > 20) violation('page-cap');
      if (!tokens(args.query).length) violation('empty-query');
      if (faults.searchFailure) return finish({ error: 'search-unavailable' });
      if ([mapping.body, 'body'].includes(args.field) && faults.bodySearchUnavailable) return finish({ error: 'body-search-unavailable' });
      const terms = tokens(args.query);
      const matches = tickets.filter(t => (!args.workflow || args.workflow === 'all' || t.workflow.meaning === args.workflow) && terms.every(term => tokens(args.field === 'title' ? t.title : [mapping.body, 'body'].includes(args.field) ? t.body : `${t.title} ${t.body}`).includes(term)));
      const offset = Number(args.cursor ?? 0), limit = args.limit ?? 20;
      const items = matches.slice(offset, offset + limit).map(t => mapFields({ id: t.id, title: t.title, url: t.url }, true));
      items.forEach(t => visible.add(t.id));
      return finish({ items, cursor: offset + limit < matches.length ? String(offset + limit) : null });
    }
    const ticket = tickets.find(t => t.id === args.id);
    if (operation === 'read' || operation === 'read-document') {
      const linked = operation === 'read-document';
      if (linked ? !exposedLinks.has(args.id) : !visible.has(args.id) && !namedSources.has(args.id)) return finish({ error: 'not-discovered' });
      const source = linked ? documents.find(d => d.id === args.id) : ticket;
      if (!source || faults.unreadable?.includes(args.id)) return finish({ error: 'unreadable' });
      const result = copy(source);
      const body = Buffer.from(source.body);
      const limit = args.bodyBytes ?? body.length;
      if (!Number.isFinite(limit) || limit < 0) return finish({ error: 'invalid-body-bytes' });
      result.body = body.subarray(0, Math.max(0, limit)).toString('utf8');
      // Avoid a replacement character expanding a cut UTF-8 sequence beyond the requested bytes.
      while (Buffer.byteLength(result.body) > limit) result.body = result.body.slice(0, -1);
      if (!linked) {
        result.comments = source.comments.slice(0, args.commentLimit ?? source.comments.length);
        result.links = (source.links ?? []).slice(0, args.linkLimit ?? (source.links ?? []).length);
        result.links.forEach(id => exposedLinks.add(id));
      }
      result.truncation = { body: result.body !== source.body, ...(!linked ? { comments: result.comments.length < source.comments.length, links: result.links.length < (source.links ?? []).length } : {}) };
      if (authority.discovery) {
        if (!linked) detailed.add(args.id);
        if (detailed.size > 5) violation('candidate-cap');
        const size = Buffer.byteLength(result.body) + (linked ? 0 : result.comments.reduce((total, comment) => total + Buffer.byteLength(comment.body), 0));
        bytes += size;
        if (size > 50000 || (args.bodyBytes ?? 0) > 50000) violation('document-cap');
        if (bytes > 200000) violation('material-cap');
        if (!linked && (result.comments.length > 50 || (args.commentLimit ?? 0) > 50)) violation('comment-cap');
        if (linked) {
          fetchedLinks.add(args.id);
          if (fetchedLinks.size > 20) violation('link-cap');
        }
      }
      return finish(linked ? result : mapFields(result, true));
    }
    return finish({ error: 'unsupported' });
  };
  return { execute, trace, violations, mapping };
}
