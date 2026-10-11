import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { runCase, cli, sdkFactories } from './run.mjs';
import { MODELS } from '../../lib/models.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const scenario = () => ({ id: 'driver', tracker: 'github', prompt: 'amber export', tickets: [{ id: '1', url: 'https://tracker.example.invalid/1', title: 'Download', body: 'amber export', comments: [], metadata: {}, workflow: { meaning: 'unstarted' }, revision: 1 }], dialogue: [], expected: { settled: true, candidate: '1', outcomes: ['enrich'], invariants: ['caps', 'search-before-read', 'no-live-writers', 'approved-payload'], facts: [{ id: 'evidence', text: 'Evidence holds.' }] } });
const execute = (o, name, args) => o.customTools.find(t => t.name === name).execute('call', args);
const factory = (script, inspect = () => {}) => async o => { inspect(o); return { getActiveToolNames: () => o.tools, prompt: input => script(o, input), dispose() {}, abort: async () => {} }; };
const judgeFactory = async () => ({ recommendation: async () => 'enrich', facts: async () => ({ evidence: 'holds' }) });
const gather = async o => { await execute(o, 'tracker', { operation: 'search', query: 'amber' }); await execute(o, 'tracker', { operation: 'read', id: '1' }); };

test('one prompt uses isolated tools, an unavailable reviewer, and all frozen facts', async () => {
  let prompts = 0;
  const s = scenario(); s.reviewReplies = ['Clean.'];
  const r = await runCase(s, { judgeFactory, sessionFactory: factory(async (o, input) => {
    prompts++; assert.equal(input, s.prompt); await gather(o);
    assert.equal((await execute(o, 'subagent', {})).isError, true);
    assert.match((await execute(o, 'instruction_read', { path: '/etc/passwd' })).content[0].text, /denied/);
    return 'Recommend enrich';
  }, o => {
    assert.deepEqual(o.tools, ['instruction_read', 'tracker', 'clock', 'subagent']);
    assert.equal(o.noTools, 'builtin'); assert.deepEqual(o.excludeTools, ['mcp__*']);
    assert.deepEqual(o.resources, { extensions: [], mcp: [], discovery: false });
    const trackerTool = o.customTools.find(t => t.name === 'tracker');
    assert.deepEqual(trackerTool.parameters, {
      type: 'object', additionalProperties: true,
      properties: { operation: { type: 'string', description: 'Read-only operation: search, read, or read-document.' } },
      required: ['operation'],
    });
    for (const other of o.customTools.filter(t => t.name !== 'tracker')) {
      assert.deepEqual(other.parameters, { type: 'object', additionalProperties: true, properties: {} });
    }
    const description = trackerTool.description;
    assert.ok(description.includes('Supply required operation: search, read, or read-document.'));
    assert.doesNotMatch(description, /create\/update|Create takes|comment takes|relation takes/);
    assert.ok(description.includes("Omitted workflow or 'all' searches every workflow; any other value matches an exact fixture workflow meaning."));
  }) });
  assert.equal(prompts, 1); assert.equal(r.status, 'ok', r.failures.join(','));
  assert.deepEqual(r.factJudgments, { evidence: 'holds' });
  assert.equal(r.mutations, undefined);
  assert.equal(r.invariants['approved-payload'], 'not-evaluated');
});

for (const [name, change, error] of [
  ['dialogue', s => { s.dialogue = [{ action: 'no-write' }]; }, 'nonempty-dialogue'],
  ['unknown invariant', s => { s.expected.invariants = ['once']; }, 'unknown-invariant'],
]) test(`reject ${name} before any factory`, async () => {
  const s = scenario(); change(s);
  await assert.rejects(runCase(s, { sessionFactory: () => assert.fail('session constructed'), judgeFactory: () => assert.fail('judge constructed') }), new RegExp(error));
});

for (const recommendation of ['unknown', undefined, { outcome: 'enrich' }, 'create']) test(`unidentifiable or unexpected recommendation fails: ${JSON.stringify(recommendation)}`, async () => {
  const s = scenario(); s.expected.candidate = null;
  const r = await runCase(s, { sessionFactory: factory(async () => 'Which export?'), judgeFactory: async () => ({ recommendation: async () => recommendation, facts: async () => ({ evidence: 'holds' }) }) });
  assert.ok(r.failures.includes('recommendation-outcome'));
});

for (const value of ['fails', 'unknown', undefined]) test(`all frozen facts required: ${value}`, async () => {
  const r = await runCase(scenario(), { sessionFactory: factory(async o => { await gather(o); return 'Recommend enrich'; }), judgeFactory: async () => ({ recommendation: async () => 'enrich', facts: async () => ({ evidence: value }) }) });
  assert.ok(r.failures.includes('fact:evidence'));
});

for (const [name, faults, operation, expected] of [
  ['no search', {}, null, 'failed'],
  ['unsupported only', {}, 'unsupported', 'failed'],
  ['failed search', { searchFailure: true }, 'search', 'failed'],
  ['valid empty search', {}, 'search', 'ok'],
]) test(`candidate-null search invariant: ${name}`, async () => {
  const s = scenario(); s.expected.candidate = null; s.tickets = []; s.faults = faults;
  const r = await runCase(s, { judgeFactory, sessionFactory: factory(async o => {
    if (operation) await execute(o, 'tracker', { operation, query: 'amber' });
    return 'Recommend enrich';
  }) });
  assert.equal(r.status, expected);
  assert.deepEqual(r.failures, expected === 'ok' ? [] : ['search-read-recommendation-order']);
});

for (const violation of ['write', 'order', 'empty', 'unsafe']) test(`runner rejects ${violation}`, async () => {
  const r = await runCase(scenario(), { judgeFactory, sessionFactory: async o => ({
    getActiveToolNames: () => violation === 'unsafe' ? [...o.tools, 'bash'] : o.tools,
    prompt: async () => {
      if (violation === 'order') await execute(o, 'tracker', { operation: 'read', id: '1' });
      await gather(o);
      if (violation === 'write') await execute(o, 'tracker', { operation: 'comment', id: '1', body: 'unsafe' });
      return violation === 'empty' ? '' : 'Recommend enrich';
    }, abort: async () => {}, dispose() {},
  }) });
  assert.ok(r.failures.includes({ write: 'no-live-writers', order: 'search-read-recommendation-order', empty: 'missing-output', unsafe: 'unsafe-active-tools' }[violation]), r.failures.join(','));
});

for (const stage of ['prompt', 'recommendation', 'facts']) test(`shared deadline aborts and disposes at ${stage}`, async () => {
  let time = 0, aborted = 0, disposed = 0;
  const s = scenario(); s.expected.candidate = null;
  const r = await runCase(s, { clockFactory: () => () => time, sessionFactory: async o => ({ getActiveToolNames: () => o.tools,
    prompt: async () => { await gather(o); if (stage === 'prompt') time = 600001; return 'Recommend enrich'; }, abort: async () => { aborted++; }, dispose: () => { disposed++; } }),
    judgeFactory: async () => ({ recommendation: async () => { if (stage === 'recommendation') time = 600001; return 'enrich'; }, facts: async () => { time = 600001; return { evidence: 'holds' }; } }),
  });
  assert.deepEqual(r.failures, ['cell-timeout']); assert.equal(aborted, 1); assert.equal(disposed, 1);
});

test('pending judge is canceled at the remaining deadline', async () => {
  let time = 0, aborted = 0, disposed = 0, settled = false;
  const s = scenario(); s.expected.candidate = null;
  const r = await runCase(s, {
    clockFactory: () => () => time,
    sessionFactory: factory(async o => { await gather(o); time = 599990; return 'Recommend enrich'; }),
    judgeFactory: async ({ signal }) => ({
      recommendation: () => new Promise(resolve => signal.addEventListener('abort', () => { settled = true; resolve('enrich'); }, { once: true })),
      abort: async () => { aborted++; }, dispose: () => { disposed++; },
    }),
  });
  assert.deepEqual(r.failures, ['cell-timeout']);
  assert.equal(settled, true); assert.equal(aborted, 1); assert.equal(disposed, 1);
});

function manifest() {
  const dir = mkdtempSync(join(tmpdir(), 'history-test-'));
  const corpus = Array.from({ length: 4 }, (_, i) => ({ ...scenario(), id: `case-${i}` }));
  const bytes = JSON.stringify(corpus), path = join(dir, 'cases.json'); writeFileSync(path, bytes);
  return { dir, path, corpus, bytes, expectedDigest: digest(bytes) };
}
const cell = () => ({ status: 'ok', failures: [], factJudgments: { evidence: 'holds' }, recommendation: 'enrich', elapsedMs: 1, usage: null });

for (const variant of ['missing', 'hash', 'invalid', 'missing facts', 'unknown outcome', 'unsettled', 'production digest']) test(`CLI refuses ${variant} before factories`, async () => {
  const m = manifest(); let called = false;
  if (variant === 'production digest') {
    const source = readFileSync(new URL('./run.mjs', import.meta.url), 'utf8');
    assert.equal(source.match(/const frozenDigest = '([^']+)';/)?.[1], 'e788684e4755609836de92d24e67ccb7b76172f5ffd357c965fcb3e44b54a85d');
    assert.match(source, /export async function cli\(argv, \{ factories = sdkFactories, run = runCase, expectedDigest = frozenDigest \} = \{\}\)/);
  }
  if (variant === 'hash') writeFileSync(m.path, m.bytes + '\n');
  if (['invalid', 'missing facts', 'unknown outcome', 'unsettled'].includes(variant)) {
    if (variant === 'invalid') m.corpus[0].dialogue = [{ action: 'create' }];
    if (variant === 'missing facts') m.corpus[0].expected.facts = [];
    if (variant === 'unknown outcome') m.corpus[0].expected.outcomes = ['unknown'];
    if (variant === 'unsettled') m.corpus[0].expected.settled = false;
    m.bytes = JSON.stringify(m.corpus); writeFileSync(m.path, m.bytes); m.expectedDigest = digest(m.bytes);
  }
  const code = await cli(['--suite', 'history', '--out', m.dir, ...(variant === 'missing' ? [] : ['--cases', m.path])], { ...(variant === 'production digest' ? {} : { expectedDigest: m.expectedDigest }), factories: async () => { called = true; return {}; } });
  assert.equal(code, 2); assert.equal(called, false);
  const report = JSON.parse(readFileSync(join(m.dir, 'report.json'), 'utf8'));
  assert.equal(report.complete, false); assert.equal(report.accepted, false);
});

for (const variant of ['complete', 'baseline recommendation fails', 'only', 'baseline', 'incomplete', 'invalid judgments', 'regression']) test(`CLI acceptance boundary: ${variant}`, async () => {
  const m = manifest(); let calls = 0, checkpointChecked = false;
  const code = await cli(['--suite', 'history', '--cases', m.path, '--out', m.dir, ...(variant === 'only' ? ['--only', 'case-0'] : []), ...(variant === 'baseline' ? ['--baseline-only'] : [])], {
    expectedDigest: m.expectedDigest, factories: async () => ({}), run: async () => {
      calls++;
      if (variant === 'incomplete' && calls === 2) {
        const checkpoint = JSON.parse(readFileSync(join(m.dir, 'report.json'), 'utf8'));
        const raw = JSON.parse(readFileSync(join(m.dir, 'raw-traces.json'), 'utf8'));
        assert.equal(checkpoint.complete, false);
        assert.equal(checkpoint.accepted, false);
        assert.equal(checkpoint.completedCells, 1);
        assert.equal(checkpoint.rows.length, 1);
        assert.equal(raw.length, 1);
        assert.deepEqual(raw[0].outputs, ['private-output-sentinel']);
        assert.ok(!JSON.stringify(checkpoint).includes('private-output-sentinel'));
        checkpointChecked = true;
        throw Error('private source string');
      }
      const r = cell();
      if (variant === 'incomplete') r.outputs = ['private-output-sentinel'];
      if (variant === 'baseline recommendation fails' && calls % 2 === 1) { r.recommendation = 'create'; r.status = 'failed'; r.failures = ['recommendation-outcome']; }
      if (variant === 'invalid judgments') r.factJudgments.evidence = 'unknown';
      if (variant === 'regression' && calls % 2 === 0) { r.factJudgments.evidence = 'fails'; r.failures = ['fact:evidence']; r.status = 'failed'; }
      return r;
    },
  });
  const report = JSON.parse(readFileSync(join(m.dir, 'report.json'), 'utf8'));
  const accepted = ['complete', 'baseline recommendation fails'].includes(variant);
  assert.equal(code, accepted ? 0 : variant === 'incomplete' ? 2 : 1);
  assert.equal(report.accepted, accepted);
  if (variant === 'incomplete') assert.equal(checkpointChecked, true, 'second cell inspected the persisted checkpoint');
  assert.equal(report.complete, variant !== 'incomplete');
  assert.equal(report.manifestSha, m.expectedDigest); assert.deepEqual(report.models, MODELS); assert.equal(report.repetitions, 1);
  assert.equal(report.invariants['approved-payload'], 'not-evaluated');
  assert.ok(!JSON.stringify(report).includes('private source string'));
  assert.ok(!JSON.stringify(report).includes('private-output-sentinel'));
  if (variant === 'complete') { assert.equal(report.completedCells, 16); assert.equal(report.passingCandidateCells, 8); assert.equal(report.rows[0].usage, null); assert.equal(report.rows[0].instructionsSha.length, 64); }
  if (variant === 'regression') assert.ok(report.rows.some(r => r.failures.includes('regression')));
});

test('SDK recommendation decoding preserves raw evidence and routes invalid replies offline', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'recommendation-sdk-')); mkdirSync(join(dir, 'dist'));
  const capture = join(dir, 'prompt.txt'), reply = join(dir, 'reply.txt');
  writeFileSync(join(dir, 'dist/index.js'), `
    import { writeFileSync, readFileSync } from 'node:fs';
    export const ModelRuntime = { create: async () => ({ getModel: () => ({}) }) };
    export const SettingsManager = { inMemory: () => ({}) };
    export const SessionManager = { inMemory: () => ({}) };
    export const createExtensionRuntime = () => ({});
    export const createAgentSession = async () => ({ session: {
      prompt: async text => writeFileSync(${JSON.stringify(capture)}, text),
      getLastAssistantText: () => readFileSync(${JSON.stringify(reply)}, 'utf8'), dispose() {}, abort: async () => {},
    } });
  `);
  const sdk = await sdkFactories(dir);
  for (const [name, text, expected] of [
    ['explanation', 'Existing evidence.\n```json\n{"outcome":"enrich"}\n```', 'enrich'],
    ['clean', '```json\n{"outcome":"create"}\n```', 'create'],
    ['missing', 'Explanation followed by enrich', null],
    ['malformed', '```json\n{"outcome":\n```', null],
    ['invalid enum', '```json\n{"outcome":"invented"}\n```', null],
    ['conflicting', '```json\n{"outcome":"enrich"}\n```\n```json\n{"outcome":"create"}\n```', null],
  ]) {
    writeFileSync(reply, text);
    const s = scenario(); s.expected.outcomes = [expected ?? 'enrich'];
    const out = join(dir, 'trace.json');
    const r = await runCase(s, { out, sessionFactory: factory(async o => { await gather(o); return 'Add evidence to the existing ticket'; }),
      judgeFactory: async context => ({ ...await sdk.judgeFactory(context), facts: async () => ({ evidence: 'holds' }) }),
    });
    const raw = JSON.parse(readFileSync(out, 'utf8'));
    const entry = raw.chronology.find(e => e.kind === 'recommendation');
    assert.equal(entry.value, expected, name);
    assert.equal(entry.raw, text, name);
    assert.equal(entry.text, r.outputs[0], name);
    assert.equal(typeof entry.at, 'number', name);
    assert.ok(raw.chronology.indexOf(entry) > raw.chronology.findIndex(e => e.kind === 'assistant'), name);
    assert.deepEqual(r.failures, expected ? [] : ['recommendation-error'], name);
    assert.equal(r.status, expected ? 'ok' : 'failed', name);
  }
  const prompt = readFileSync(capture, 'utf8');
  for (const definition of [
    'enrich: a compatible existing-body update or new evidence comment on an existing ticket',
    'no-write: intentionally leave already-covered work unchanged',
    'create: a clearly recommended new-ticket proposal, including one marked not-ready or blocked on evidence',
    'park: defer the ticket-action decision itself without recommending a new-ticket or enrichment proposal',
    'supersede: replace conflicting or reversed prior scope',
    'proceed: continue with the proposed scope despite the explained conflict',
    'unknown: no identifiable recommendation',
  ]) assert.ok(prompt.includes(definition), definition);
  assert.ok(prompt.includes('Classify meaning, not whether the literal word "enrich" appears.'));
  assert.ok(prompt.includes('Classify the recommended ticket action, not filing readiness.'));
  assert.ok(prompt.includes('including one blocked on evidence'));
  assert.ok(prompt.includes('clarification alone or an ambiguous menu without an identifiable recommendation'));
  assert.ok(prompt.includes('Never infer a recommendation from the first option.'));
  assert.doesNotMatch(prompt, /Recording an explicitly UNRESOLVED/);
  assert.ok(prompt.includes('Return one fenced JSON object'));
  assert.ok(prompt.includes('Observed tools:'));
  writeFileSync(reply, '```json\n{"facts":{"evidence":{"before":"holds","after":"holds"}},"feedback":"Observed evidence."}\n```');
  const s = scenario(); s.expected.outcomes = ['supersede'];
  const r = await runCase(s, { sessionFactory: factory(async o => { await gather(o); return 'Observed output sentinel'; }),
    judgeFactory: async context => ({ ...await sdk.judgeFactory(context), recommendation: async () => 'supersede' }),
  });
  assert.equal(r.status, 'ok', r.failures.join(','));
  const factPrompt = readFileSync(capture, 'utf8');
  assert.doesNotMatch(factPrompt, /Allowed recommendation outcomes:|supersede/);
  assert.ok(factPrompt.includes('Judge each frozen fact solely from its own statement, supplied input, and observed output/tool evidence.'));
  assert.ok(factPrompt.includes('Do not treat a readiness blocker alone as a failed concern-identity fact.'));
  assert.ok(factPrompt.includes('Apply facts explicitly about evidence or contradictions as written.'));
  for (const evidence of [s.prompt, s.expected.facts[0].text, 'Observed output sentinel', 'Observed tools:']) assert.ok(factPrompt.includes(evidence), evidence);
});

test('installed SDK constructs isolated tools offline without prompting', async () => {
  const { sessionFactory } = await sdkFactories(process.env.PI_PACKAGE);
  let constructed = false, time = 0;
  const s = scenario(); s.expected.candidate = null;
  const r = await runCase(s, { model: MODELS.replay[0], instructions: { 'skills/shape-ticket/SKILL.md': 'Replay only.' }, clockFactory: () => () => time,
    sessionFactory: async options => {
      await gather(options);
      const session = await sessionFactory(options);
      try {
        assert.deepEqual(session.getActiveToolNames().sort(), options.tools.toSorted());
        assert.equal(session.getAllTools().some(t => t.name.startsWith('mcp__')), false);
        for (const [method, key] of [['getExtensions', 'extensions'], ['getSkills', 'skills'], ['getPrompts', 'prompts'], ['getThemes', 'themes'], ['getAgentsFiles', 'agentsFiles']]) assert.deepEqual(session.resourceLoader[method]()[key], []);
        assert.deepEqual(session.messages, []); constructed = true; time = 600001;
      } finally { session.dispose(); }
      return { getActiveToolNames: () => options.tools, abort: async () => {}, dispose() {}, prompt() { assert.fail('no model calls'); } };
    },
  });
  assert.equal(constructed, true, r.scratch); assert.deepEqual(r.failures, ['cell-timeout']);
});
