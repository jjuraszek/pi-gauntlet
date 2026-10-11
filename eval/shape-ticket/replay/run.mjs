import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parseArgs, isDeepStrictEqual } from 'node:util';
import { createHash } from 'node:crypto';
import { createTracker } from './tracker.mjs';
import { MODELS } from '../../lib/models.mjs';
import { buildJudgePrompt, parseJudgeReply } from '../../lib/judge.mjs';
import { sha256 } from '../../lib/checks.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const frozenDigest = 'e788684e4755609836de92d24e67ccb7b76172f5ffd357c965fcb3e44b54a85d';
const invariants = { caps: 'evaluated', 'search-before-read': 'evaluated', 'no-live-writers': 'evaluated', 'approved-payload': 'not-evaluated' };
const outcomes = ['enrich', 'create', 'park', 'supersede', 'proceed', 'no-write'];
const result = value => ({ content: [{ type: 'text', text: JSON.stringify(value) }], details: {} });
const schema = { type: 'object', additionalProperties: true, properties: {} };
const tool = (name, description, execute, parameters = schema) => ({ name, label: name, description, parameters, execute });
const extractJson = text => {
  const blocks = [...text.matchAll(/^```json\s*\n([\s\S]*?)\n```$/gm)];
  return blocks.length === 1 ? JSON.parse(blocks[0][1]) : null;
};

function validateCase(scenario) {
  if (!Array.isArray(scenario.dialogue ?? []) || scenario.dialogue?.length) throw new Error('nonempty-dialogue');
  if (!Array.isArray(scenario.expected?.invariants ?? []) || (scenario.expected?.invariants ?? []).some(i => !Object.hasOwn(invariants, i))) throw new Error('unknown-invariant');
  if (typeof scenario.id !== 'string' || !scenario.id || !['github', 'linear', 'custom'].includes(scenario.tracker) || typeof scenario.prompt !== 'string' || !scenario.prompt.trim() || !Array.isArray(scenario.tickets) || !scenario.expected || !Array.isArray(scenario.expected.outcomes) || !scenario.expected.outcomes.length || scenario.expected.outcomes.some(o => !outcomes.includes(o)) || !Array.isArray(scenario.expected.facts) || !scenario.expected.facts.length) throw new Error('invalid-case');
  if (new Set(scenario.expected.facts.map(f => f.id)).size !== scenario.expected.facts.length || scenario.expected.facts.some(f => typeof f.id !== 'string' || !f.id || typeof f.text !== 'string' || !f.text.trim())) throw new Error('invalid-facts');
  for (const t of scenario.tickets) if (!t.id || !t.url || typeof t.title !== 'string' || typeof t.body !== 'string' || !Array.isArray(t.comments) || t.comments.some(c => typeof c.body !== 'string') || !t.metadata || !t.workflow || !Number.isInteger(t.revision)) throw new Error('invalid-ticket');
}

export async function runCase(scenario, { sessionFactory, judgeFactory, clockFactory = () => Date.now, instructions = {}, model, out } = {}) {
  validateCase(scenario);
  const sourceNow = clockFactory();
  let advance = 0;
  const now = () => sourceNow() + advance;
  const began = now(), tracker = createTracker(scenario, { now });
  const failures = [], events = [], outputs = [], chronology = [], factJudgments = {};
  let session, judge, recommendation, rawRecommendation;
  const customTools = [
    tool('instruction_read', 'Read only listed instruction files. Supply path.', async (_id, { path }) => result(Object.hasOwn(instructions, path) ? instructions[path] : { error: 'denied' })),
    tool('tracker', `Read-only ${scenario.tracker} fixture: search/read/read-document. Supply required operation: search, read, or read-document. Search takes query, field title/${tracker.mapping.body}, workflow meaning, limit <=20, cursor. Omitted workflow or 'all' searches every workflow; any other value matches an exact fixture workflow meaning. Read takes id and optional bodyBytes, commentLimit, linkLimit. Read-document takes exposed document id and optional bodyBytes. Truncation is disclosed; omitted or exceeded limits remain detectable. Ticket fields: ${tracker.mapping.body}/${tracker.mapping.workflow}/${tracker.mapping.reference}. Metadata and workflow meanings are fixture-defined, not native schema inference. Search is lexical matching, not a native search algorithm.`, async (_id, { operation, ...args }) => {
      chronology.push({ kind: 'tool', operation, args: structuredClone(args), at: now() });
      if (['search', 'read', 'read-document'].includes(operation)) advance += scenario.faults?.discoveryStepMs ?? 0;
      return result(await tracker.execute(operation, args));
    }, {
      ...schema,
      properties: { operation: { type: 'string', description: 'Read-only operation: search, read, or read-document.' } },
      required: ['operation'],
    }),
    tool('clock', 'Read controlled elapsed discovery time in milliseconds.', async () => result({ now: now() })),
    tool('subagent', 'Roast dispatch capability unavailable in this fixture.', async () => ({ ...result({ error: 'fixture capability unavailable: roast dispatch' }), isError: true })),
  ];
  const cwd = mkdtempSync(join(tmpdir(), 'shape-ticket-cell-'));
  const agentDir = join(cwd, 'agent'); mkdirSync(agentDir);
  const options = { cwd, agentDir, customTools, tools: customTools.map(t => t.name), noTools: 'builtin', excludeTools: ['mcp__*'], resources: { extensions: [], mcp: [], discovery: false }, instructions, model };
  const controller = new AbortController();
  const remainingMs = () => Math.max(0, 600000 - (now() - began));
  const withinDeadline = async operation => {
    if (!remainingMs()) throw new Error('cell-timeout');
    let timer;
    try {
      const value = await Promise.race([operation(), new Promise((_, reject) => {
        timer = setTimeout(() => { reject(new Error('cell-timeout')); controller.abort(); }, remainingMs());
      })]);
      if (!remainingMs()) throw new Error('cell-timeout');
      return value;
    } finally { clearTimeout(timer); }
  };
  try {
    if (judgeFactory) await withinDeadline(async () => {
      judge = await judgeFactory({ remainingMs, signal: controller.signal, recordRecommendation: text => { rawRecommendation = text; } });
      if (controller.signal.aborted) judge?.dispose?.();
    });
    if (!sessionFactory) throw new Error('session factory required');
    await withinDeadline(async () => {
      session = await sessionFactory(options);
      if (controller.signal.aborted) session.dispose();
    });
    if (!isDeepStrictEqual([...session.getActiveToolNames()].sort(), [...options.tools].sort())) throw new Error('unsafe-active-tools');
    events.push({ kind: 'prompt', text: scenario.prompt, at: now() });
    const returned = await withinDeadline(() => session.prompt(scenario.prompt));
    const text = typeof returned === 'string' ? returned : session.getLastAssistantText?.() ?? '';
    if (!text.trim()) failures.push('missing-output');
    outputs.push(text); chronology.push({ kind: 'assistant', text, at: now() });
    events.push({ kind: 'assistant', text, at: now(), usage: session.messages?.filter(m => m.role === 'assistant').at(-1)?.usage ?? null });
    try {
      recommendation = await withinDeadline(() => judge?.recommendation?.(text, tracker.trace));
      if (!outcomes.includes(recommendation) || !scenario.expected.outcomes.includes(recommendation)) failures.push('recommendation-outcome');
    } catch (error) {
      if (error.message === 'cell-timeout') throw error;
      failures.push('recommendation-error');
      writeFileSync(join(cwd, 'diagnostic.txt'), String(error.stack ?? error));
    }
    chronology.push({ kind: 'recommendation', text, value: recommendation ?? null, ...(rawRecommendation !== undefined ? { raw: rawRecommendation } : {}), at: now() });
    let judged;
    try {
      judged = await withinDeadline(() => judge?.facts?.(`${text}\nObserved tools:\n${JSON.stringify(tracker.trace)}`, scenario.expected.facts, `${scenario.prompt}\n\nIdentity owner:\n${instructions['skills/shape-ticket/reference/split-axes.md'] ?? ''}`));
    } catch (error) {
      if (error.message === 'cell-timeout') throw error;
      writeFileSync(join(cwd, 'diagnostic.txt'), String(error.stack ?? error));
    }
    for (const fact of scenario.expected.facts) {
      factJudgments[fact.id] = ['holds', 'fails'].includes(judged?.[fact.id]) ? judged[fact.id] : 'invalid';
      if (factJudgments[fact.id] !== 'holds') failures.push(`fact:${fact.id}`);
    }
  } catch (error) {
    writeFileSync(join(cwd, 'diagnostic.txt'), String(error.stack ?? error));
    failures.push(['cell-timeout', 'unsafe-active-tools'].includes(error.message) ? error.message : 'session-error');
    controller.abort();
    await judge?.abort?.(); await session?.abort?.();
  } finally { judge?.dispose?.(); session?.dispose(); }
  failures.push(...tracker.violations.map(v => v.rule));
  const candidate = scenario.expected.candidate;
  if (scenario.expected.invariants?.includes('search-before-read') && !tracker.trace.some(t => t.operation === 'search' && !t.result.error && Array.isArray(t.result.items))) failures.push('search-read-recommendation-order');
  if (candidate && scenario.expected.invariants?.includes('search-before-read')) {
    const search = tracker.trace.findIndex(t => t.operation === 'search' && t.result.items?.some(item => item.id === candidate));
    const reads = tracker.trace.map((t, i) => t.operation === 'read' && t.args.id === candidate ? i : -1).filter(i => i >= 0);
    if (search < 0 || !reads.length || reads.some(i => i <= search) || !tracker.trace[reads.at(-1)].result.id) failures.push('search-read-recommendation-order');
  }
  const record = { id: scenario.id, status: failures.length ? 'failed' : 'ok', failures: [...new Set(failures)], factJudgments, recommendation: recommendation ?? null, invariants, trace: tracker.trace, events, chronology, outputs, elapsedMs: now() - began, usage: events.find(e => e.kind === 'assistant')?.usage ?? null, scratch: cwd };
  writeFileSync(join(cwd, 'trace.json'), JSON.stringify(record, null, 2));
  if (out) writeFileSync(out, JSON.stringify(record, null, 2));
  return record;
}

export function loadInstructions(base, baseline = false) {
  const read = path => baseline ? execFileSync('git', ['show', `${base}:${path}`], { cwd: root, encoding: 'utf8' }) : readFileSync(join(root, path), 'utf8');
  const skillPath = 'skills/shape-ticket/SKILL.md';
  const map = { [skillPath]: read(skillPath) };
  for (const match of map[skillPath].matchAll(/reference\/[a-z-]+\.md/g)) {
    const path = `skills/shape-ticket/${match[0]}`;
    map[path] ??= read(path);
  }
  return map;
}

export async function sdkFactories(piPackage) {
  let packagePath = piPackage;
  if (!packagePath) {
    const managed = process.env.PI_MANAGED_INSTALL_ROOT;
    if (!managed) throw new Error('set PI_MANAGED_INSTALL_ROOT or --pi-package');
    packagePath = join(managed, 'releases', readFileSync(join(managed, 'current-version'), 'utf8').trim(), 'node_modules/@earendil-works/pi-coding-agent');
  }
  const pi = await import(pathToFileURL(join(packagePath, 'dist/index.js')).href);
  const runtime = await pi.ModelRuntime.create({ allowModelNetwork: false, refreshOnCreate: false });
  const loader = system => ({
    getExtensions: () => ({ extensions: [], errors: [], runtime: pi.createExtensionRuntime() }),
    getSkills: () => ({ skills: [], diagnostics: [] }), getPrompts: () => ({ prompts: [], diagnostics: [] }),
    getThemes: () => ({ themes: [], diagnostics: [] }), getAgentsFiles: () => ({ agentsFiles: [] }),
    getSystemPrompt: () => system, getSystemPromptSource: () => undefined,
    getAppendSystemPrompt: () => [], getAppendSystemPromptSources: () => [], extendResources() {}, reload: async () => {},
  });
  const sessionFactory = async options => {
    const { instructions, resources, model: modelSpec, ...rest } = options;
    const slash = modelSpec.indexOf('/');
    const model = runtime.getModel(modelSpec.slice(0, slash), modelSpec.slice(slash + 1));
    if (!model) throw new Error('configured replay model missing');
    const { session } = await pi.createAgentSession({ ...rest, model, modelRuntime: runtime, thinkingLevel: MODELS.thinking,
      settingsManager: pi.SettingsManager.inMemory({ compaction: { enabled: false }, retry: { enabled: false } }),
      sessionManager: pi.SessionManager.inMemory(options.cwd),
      resourceLoader: loader(`Follow the complete shape-ticket skill below. Only instruction_read can read files. Tracker reads use the scoped fixture tool, never a shell. Instruction paths: ${Object.keys(instructions).join(', ')}\n\n${instructions['skills/shape-ticket/SKILL.md']}`),
    });
    return session;
  };
  const oneShot = async (prompt, { remainingMs, signal }) => {
    const cwd = mkdtempSync(join(tmpdir(), 'shape-ticket-judge-'));
    const slash = MODELS.judge.indexOf('/');
    const model = runtime.getModel(MODELS.judge.slice(0, slash), MODELS.judge.slice(slash + 1));
    if (!model) throw new Error('configured judge model missing');
    const { session } = await pi.createAgentSession({ cwd, agentDir: cwd, model, modelRuntime: runtime, thinkingLevel: MODELS.thinking,
      noTools: 'all', tools: [], excludeTools: ['mcp__*'], resourceLoader: loader('Judge only the supplied evidence. No tools.'),
      settingsManager: pi.SettingsManager.inMemory({ compaction: { enabled: false }, retry: { enabled: false } }), sessionManager: pi.SessionManager.inMemory(cwd) });
    let disposed = false;
    const dispose = () => { if (!disposed) { disposed = true; session.dispose(); } };
    const abort = () => { void session.abort().finally(dispose); };
    signal.addEventListener('abort', abort, { once: true });
    try {
      if (signal.aborted || !remainingMs()) { await session.abort(); throw new Error('cell-timeout'); }
      await session.prompt(prompt);
      if (signal.aborted || !remainingMs()) throw new Error('cell-timeout');
      return session.getLastAssistantText();
    } finally { signal.removeEventListener('abort', abort); dispose(); }
  };
  return { sessionFactory, judgeFactory: async context => ({
    recommendation: async (displayed, trace) => {
      const text = await oneShot(`Classify the recommended ticket action, not filing readiness. Identify the ACTUAL recommended option. Never infer a recommendation from the first option. Tool trace overrides contradictory prose. Classify meaning, not whether the literal word "enrich" appears. Outcome meanings: enrich: a compatible existing-body update or new evidence comment on an existing ticket, including one blocked on evidence; no-write: intentionally leave already-covered work unchanged; create: a clearly recommended new-ticket proposal, including one marked not-ready or blocked on evidence; park: defer the ticket-action decision itself without recommending a new-ticket or enrichment proposal; supersede: replace conflicting or reversed prior scope; proceed: continue with the proposed scope despite the explained conflict; unknown: no identifiable recommendation, including clarification alone or an ambiguous menu without an identifiable recommendation. Classify compatible additions/evidence as enrich, not settlement of a conflicting requirement. Return one fenced JSON object: {"outcome":"enrich|create|park|supersede|proceed|no-write|unknown"}. Choose exactly one outcome value from that enum.\n${displayed}\nObserved tools: ${JSON.stringify(trace)}`, context);
      context.recordRecommendation?.(text);
      const parsed = extractJson(text);
      if (!parsed || ![...outcomes, 'unknown'].includes(parsed.outcome)) throw new Error('unusable recommendation judgment');
      return parsed.outcome;
    },
    facts: async (output, facts, prompt) => {
      const text = await oneShot(buildJudgePrompt({ judgeText: `${readFileSync(join(root, 'eval/judge.md'), 'utf8')}\nJudge each frozen fact solely from its own statement, supplied input, and observed output/tool evidence. Do not treat a readiness blocker alone as a failed concern-identity fact. Apply facts explicitly about evidence or contradictions as written.`, caseText: prompt, facts: facts.map(f => ({ ...f, kind: 'judged' })), change: 'Read-only skill replay', moves: [], before: output, after: output }), context);
      return Object.fromEntries(Object.entries(parseJudgeReply(text, facts.map(f => f.id)).facts).map(([id, value]) => [id, value.after]));
    },
  }) };
}

export async function cli(argv, { factories = sdkFactories, run = runCase, expectedDigest = frozenDigest } = {}) {
  let persist, report;
  try {
    const { values } = parseArgs({ args: argv, options: Object.fromEntries(['base', 'suite', 'cases', 'only', 'reps', 'out', 'pi-package'].map(k => [k, { type: 'string' }]).concat([['baseline-only', { type: 'boolean' }]])) });
    const out = values.out ?? mkdtempSync(join(tmpdir(), 'shape-ticket-replay-')); mkdirSync(out, { recursive: true });
    const rows = [];
    report = { suite: 'history', partial: !!values.only || !!values['baseline-only'], complete: false, accepted: false, manifestSha: null, models: MODELS, repetitions: null, invariants, expectedCells: 0, completedCells: 0, passingCandidateCells: 0, exit: 2, rows: [] };
    persist = () => {
      writeFileSync(join(out, 'raw-traces.json'), JSON.stringify(rows, null, 2));
      report.completedCells = rows.length;
      report.passingCandidateCells = rows.filter(r => r.arm === 'candidate' && r.status === 'ok' && !r.failures.length).length;
      report.rows = rows.map((r, index) => ({ cell: index + 1, arm: r.arm, model: r.model, rep: r.rep, instructionsSha: r.instructionsSha, status: ['ok', 'failed'].includes(r.status) ? r.status : 'invalid', elapsedMs: Number.isFinite(r.elapsedMs) ? r.elapsedMs : null, usage: r.usage ? Object.fromEntries(['input', 'output', 'cacheRead', 'cacheWrite', 'totalTokens'].filter(k => Number.isFinite(r.usage[k])).map(k => [k, r.usage[k]])) : null, failures: [...new Set(r.failures.map(f => f.startsWith('fact:') ? 'fact' : f.startsWith('regression:') ? 'regression' : ['cell-timeout', 'unsafe-active-tools', 'missing-output', 'recommendation-outcome', 'recommendation-error', 'session-error', 'no-live-writers', 'search-read-recommendation-order', 'invalid-cell'].includes(f) ? f : 'invariant-failure'))] }));
      writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 2));
    };
    persist();
    if ((values.suite ?? 'history') !== 'history' || !values.cases) throw new Error('history requires frozen --cases');
    const bytes = readFileSync(values.cases);
    report.manifestSha = createHash('sha256').update(bytes).digest('hex');
    if (report.manifestSha !== expectedDigest) throw new Error('manifest-hash-mismatch');
    const corpus = JSON.parse(bytes.toString('utf8'));
    if (!Array.isArray(corpus) || corpus.length !== 4 || new Set(corpus.map(c => c.id)).size !== 4) throw new Error('history requires four unique cases');
    for (const scenario of corpus) { validateCase(scenario); if (scenario.expected.settled !== true) throw new Error('unsettled-case'); }
    const selected = corpus.filter(c => !values.only || c.id === values.only);
    if (!selected.length) throw new Error('unknown --only case');
    const reps = Number(values.reps ?? 1);
    if (!Number.isInteger(reps) || reps < 1) throw new Error('invalid repetitions');
    report.repetitions = reps;
    report.partial ||= reps !== 1;
    const base = values.base ?? 'c10ba7c5eaf867280a2b21d70d612c2579ecafcf';
    const arms = { baseline: loadInstructions(base, true), ...(!values['baseline-only'] ? { candidate: loadInstructions(base) } : {}) };
    report.expectedCells = selected.length * MODELS.replay.length * reps * Object.keys(arms).length;
    const sdk = await factories(values['pi-package']);
    console.log(`replay output: ${out}`); persist();
    for (const scenario of selected) for (const model of MODELS.replay) for (let rep = 1; rep <= reps; rep++) {
      const pair = {};
      for (const [arm, instructions] of Object.entries(arms)) {
        console.log(`start cell ${rows.length + 1} ${arm} rep ${rep}`);
        const scoped = { ...instructions, '.pi/gauntlet-overrides.md': `## Issue tracker\n- tracker: ${scenario.tracker}\n- mapped operations: tracker tool search/read/read-document\n- workflow: github workflow, linear state, custom phase; use returned fixture-defined meaning; absence means unknown\n- metadata/current-schema: fixture-defined returned object, not native schema inference\n- body: github body, linear description, custom content\n- reference: github/linear url, custom reference\n` };
        const cell = await run(structuredClone(scenario), { ...sdk, instructions: scoped, model });
        if (!cell || !Array.isArray(cell.failures) || !['ok', 'failed'].includes(cell.status)) throw new Error('invalid-cell');
        if (![...outcomes, 'unknown'].includes(cell.recommendation) || scenario.expected.facts.some(f => !['holds', 'fails'].includes(cell.factJudgments?.[f.id]))) cell.failures.push('invalid-cell');
        if (!scenario.expected.outcomes.includes(cell.recommendation) && !cell.failures.includes('recommendation-outcome')) cell.failures.push('recommendation-outcome');
        for (const fact of scenario.expected.facts) if (cell.factJudgments?.[fact.id] !== 'holds' && !cell.failures.includes(`fact:${fact.id}`)) cell.failures.push(`fact:${fact.id}`);
        const row = { ...cell, arm, model, rep, instructionsSha: sha256(JSON.stringify(scoped)) };
        pair[arm] = row; rows.push(row); persist();
        console.log(`end cell ${rows.length} ${cell.status}`);
      }
      for (const fact of scenario.expected.facts) if (pair.baseline?.factJudgments?.[fact.id] === 'holds' && pair.candidate?.factJudgments?.[fact.id] !== undefined && pair.candidate.factJudgments[fact.id] !== 'holds') pair.candidate.failures.push(`regression:${fact.id}`);
      persist();
    }
    report.complete = rows.length === report.expectedCells;
    report.accepted = report.complete && !report.partial && reps === 1 && rows.length === 16 && report.passingCandidateCells === 8 && !rows.some(r => r.failures.includes('invalid-cell') || r.failures.some(f => f.startsWith('regression:')));
    report.exit = report.accepted ? 0 : 1; persist();
    return report.exit;
  } catch (error) {
    if (report) { report.exit = 2; report.accepted = false; persist(); }
    const scratch = mkdtempSync(join(tmpdir(), 'shape-ticket-error-'));
    writeFileSync(join(scratch, 'diagnostic.txt'), String(error.stack ?? error));
    console.error('replay-input-or-runtime-error'); return 2;
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await cli(process.argv.slice(2));
