import test from 'node:test';
import assert from 'node:assert/strict';
import { createTracker } from './tracker.mjs';

const scenario = () => ({ tracker: 'github', prompt: 'amber export', tickets: [{ id: '1', url: 'https://tracker.example.invalid/1', title: 'Download', body: 'amber export', comments: [{ id: 'c', body: 'evidence', revision: 1 }], metadata: { label: 'bug' }, workflow: { meaning: 'unstarted' }, revision: 1 }] });

for (const operation of ['create', 'update', 'comment', 'relation']) test(`raw ${operation} is rejected, traced, and cannot change sources`, async () => {
  const s = scenario(), tracker = createTracker(s);
  await tracker.execute('search', { query: 'amber' });
  const before = await tracker.execute('read', { id: '1' });
  const args = { id: '1', title: 'Changed', body: 'Changed', metadata: { label: 'changed' }, target: '2' };
  assert.deepEqual(await tracker.execute(operation, args, { authorized: true, discovery: true }), { error: 'read-only' });
  assert.deepEqual(await tracker.execute('read', { id: '1' }), before);
  assert.deepEqual(tracker.trace[2].args, args);
  assert.deepEqual(tracker.trace[2].result, { error: 'read-only' });
  assert.deepEqual(tracker.violations.map(v => v.rule), ['no-live-writers']);
  assert.equal(tracker.mutations, undefined);
  assert.equal(tracker.changeSource, undefined);
});

for (const backend of ['github', 'linear', 'custom']) test(`read-only ${backend} mapping and visibility`, async () => {
  const s = scenario(); s.tracker = backend;
  const tracker = createTracker(s);
  assert.equal((await tracker.execute('read', { id: '1' })).error, 'not-discovered');
  assert.deepEqual((await tracker.execute('search', { query: 'amber', field: 'title' })).items, []);
  const found = await tracker.execute('search', { query: 'amber', field: tracker.mapping.body });
  assert.equal(found.items[0][tracker.mapping.reference], s.tickets[0].url);
  assert.equal(found.items[0][tracker.mapping.body], undefined);
  const read = await tracker.execute('read', { id: '1' });
  assert.equal(read[tracker.mapping.body], s.tickets[0].body);
  assert.deepEqual(read[tracker.mapping.workflow], s.tickets[0].workflow);
});

test('bounded reads disclose truncation and expose only returned document links', async () => {
  const s = scenario(); s.prompt = '1'; s.tickets[0].links = ['a', 'b'];
  s.documents = [{ id: 'a', body: 'x'.repeat(50000) }, { id: 'b', body: 'hidden' }];
  const tracker = createTracker(s);
  const bounded = await tracker.execute('read', { id: '1', bodyBytes: 2, commentLimit: 0, linkLimit: 1 });
  assert.deepEqual(bounded.truncation, { body: true, comments: true, links: true });
  assert.equal((await tracker.execute('read-document', { id: 'b' })).error, 'not-discovered');
  const document = await tracker.execute('read-document', { id: 'a', bodyBytes: 7 });
  assert.equal(document.body, 'xxxxxxx');
  assert.equal(document.truncation.body, true);
  assert.equal((await tracker.execute('read', { id: '1' })).body, s.tickets[0].body);
  for (let i = 0; i < 3; i++) await tracker.execute('read-document', { id: 'a' });
  assert.deepEqual(tracker.violations, []);
  await tracker.execute('read-document', { id: 'a' });
  assert.deepEqual(tracker.violations.map(v => v.rule), ['material-cap']);
});

test('pagination and deterministic availability faults retain trace', async () => {
  const s = scenario();
  s.tickets = ['terminal', 'started', 'unstarted'].map((meaning, i) => ({ ...s.tickets[0], id: String(i + 1), workflow: { meaning } }));
  for (const [name, workflow, ids] of [
    ['omitted', undefined, ['1', '2', '3']],
    ['all', 'all', ['1', '2', '3']],
    ['terminal', 'terminal', ['1']],
    ['started', 'started', ['2']],
    ['unstarted', 'unstarted', ['3']],
    ['unknown', 'ALL', []],
  ]) {
    const probe = createTracker(s);
    const args = { query: 'amber', field: 'body', limit: 1, ...(workflow === undefined ? {} : { workflow }) };
    assert.equal((await probe.execute('read', { id: '1' })).error, 'not-discovered', name);
    const hit = await probe.execute('search', args);
    assert.deepEqual(hit, { items: ids.slice(0, 1).map(id => ({ id, title: 'Download', url: s.tickets[Number(id) - 1].url })), cursor: ids.length > 1 ? '1' : null }, name);
    assert.equal(probe.trace.filter(t => t.operation === 'search').length, 1, name);
    for (const ticket of s.tickets) {
      const read = await probe.execute('read', { id: ticket.id });
      assert.equal(read.body ?? read.error, ticket.id === ids[0] ? 'amber export' : 'not-discovered', name);
    }
    const allHits = await probe.execute('search', { ...args, limit: 20 });
    assert.deepEqual(allHits.items.map(t => t.id), ids, name);
    assert.equal(allHits.cursor, null, name);
    for (let i = 0; i < 4; i++) await probe.execute('search', { ...args, cursor: hit.cursor ?? '0' });
    assert.deepEqual(probe.violations, [], name);
    await probe.execute('search', args);
    assert.deepEqual(probe.violations.map(v => v.rule), ['search-cap'], name);
  }
  const tracker = createTracker(s);
  const first = await tracker.execute('search', { query: 'amber', limit: 1 });
  assert.equal(first.cursor, '1');
  assert.equal((await tracker.execute('search', { query: 'amber', limit: 1, cursor: first.cursor })).items[0].id, '2');
  for (const [faults, operation, args, error] of [
    [{ searchFailure: true }, 'search', { query: 'amber' }, 'search-unavailable'],
    [{ bodySearchUnavailable: true }, 'search', { query: 'amber', field: 'body' }, 'body-search-unavailable'],
    [{ unreadable: ['1'] }, 'read', { id: '1' }, 'unreadable'],
    [{ unsupported: ['search'] }, 'search', {}, 'unsupported'],
  ]) {
    const probe = createTracker({ ...s, prompt: '1', faults });
    assert.equal((await probe.execute(operation, args)).error, error);
    assert.equal(probe.trace.length, 1);
  }
});

test('search, page, candidate, document, comment and material budgets remain detectable', async () => {
  const s = scenario();
  s.tickets = Array.from({ length: 6 }, (_, i) => ({ ...s.tickets[0], id: String(i), body: 'amber ' + 'x'.repeat(50000) }));
  s.tickets[0].comments = Array.from({ length: 51 }, () => ({ body: 'note' }));
  const tracker = createTracker(s);
  for (let i = 0; i < 7; i++) await tracker.execute('search', { query: 'amber', limit: 21 });
  for (const t of s.tickets) await tracker.execute('read', { id: t.id });
  for (const rule of ['search-cap', 'page-cap', 'candidate-cap', 'document-cap', 'comment-cap', 'material-cap']) assert.ok(tracker.violations.some(v => v.rule === rule), rule);
});

test('linked-document budget counts distinct fetches, not previews or repeats', async () => {
  const s = scenario(); s.prompt = '1';
  s.documents = Array.from({ length: 21 }, (_, i) => ({ id: `d${i}`, body: 'x' }));
  s.tickets[0].links = s.documents.map(d => d.id);
  const tracker = createTracker(s);
  await tracker.execute('read', { id: '1' });
  for (const d of s.documents.slice(0, 20)) await tracker.execute('read-document', { id: d.id });
  await tracker.execute('read-document', { id: 'd0' });
  assert.deepEqual(tracker.violations, []);
  await tracker.execute('read-document', { id: 'd20' });
  assert.deepEqual(tracker.violations.map(v => v.rule), ['link-cap']);
});

for (const bodyBytes of [-1, NaN, Infinity, 0, 1, 2, 3, 50001]) test(`UTF-8 body boundary: ${bodyBytes}`, async () => {
  const s = scenario(); s.prompt = '1'; s.tickets[0].body = 'éx';
  const tracker = createTracker(s);
  const value = await tracker.execute('read', { id: '1', bodyBytes });
  if (!Number.isFinite(bodyBytes) || bodyBytes < 0) assert.equal(value.error, 'invalid-body-bytes');
  else {
    assert.equal(value.body, bodyBytes < 2 ? '' : bodyBytes === 2 ? 'é' : 'éx');
    assert.ok(Buffer.byteLength(value.body) <= bodyBytes);
  }
  assert.equal(tracker.violations.some(v => v.rule === 'document-cap'), bodyBytes > 50000 && Number.isFinite(bodyBytes));
});

for (const crossing of [false, true]) test(`discovery deadline: crossing=${crossing}`, async () => {
  let time = 0, ticks = 0;
  const tracker = createTracker(scenario(), { now: crossing ? () => ticks++ ? 120001 : 0 : () => time });
  await tracker.execute('search', { query: 'amber' });
  if (!crossing) { time = 120001; await tracker.execute('read', { id: '1' }); }
  assert.ok(tracker.violations.some(v => v.rule === (crossing ? 'elapsed-overrun' : 'elapsed-cap')));
});

for (const comment of ['note', 'é']) test(`content-byte bounds exclude metadata: ${comment}`, async () => {
  const s = scenario(); s.prompt = '1';
  s.tickets[0].body = 'x'.repeat(50000 - Buffer.byteLength(comment));
  s.tickets[0].comments = [{ id: 'metadata', body: comment }];
  const tracker = createTracker(s);
  await tracker.execute('read', { id: '1' });
  assert.deepEqual(tracker.violations, []);
  for (let i = 0; i < 4; i++) await tracker.execute('read', { id: '1' });
  assert.deepEqual(tracker.violations.map(v => v.rule), ['material-cap']);
});
