import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { buildSync } from 'esbuild';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const skill = read('skills/subagent-driven-development/SKILL.md');
const dispatch = read('skills/subagent-driven-development/reference/dispatch-contract.md');
const schema = name => JSON.parse(dispatch.match(new RegExp(`const ${name} = (.*);`))[1]);
const implementerSchema = schema('IMPLEMENTER_STATUS_SCHEMA');
const scratch = mkdtempSync(join(tmpdir(), 'implement-failure-paths-'));
const runtimePath = join(scratch, 'runtime.mjs');
// Node does not strip TypeScript in node_modules; bundle the real peer once for this file.
buildSync({
  stdin: {
    contents: 'export * from "./node_modules/pi-cohort/src/runs/shared/structured-output.ts"; export * from "./node_modules/pi-cohort/src/runs/shared/completion-guard.ts";',
    resolveDir: root,
  },
  outfile: runtimePath, bundle: true, format: 'esm', platform: 'node', logLevel: 'silent',
});
const { createStructuredOutputRuntime, readStructuredOutput, blockedLine, expectsImplementationMutation } = await import(pathToFileURL(runtimePath));

const capture = value => JSON.stringify({ status: 'success', value });
const single = { status: 'NEEDS_CONTEXT', reasoning: 'r', question: 'q', anchor: '### Task 5:' };

test('real capture reader validates statuses, exactly one identity and conditional fields', () => {
  const runtime = createStructuredOutputRuntime(implementerSchema, scratch);
  assert.match(readStructuredOutput(runtime).error, /Missing structured_output call/);
  const cases = [
    ['needs context', single],
    ['blocked', { status: 'BLOCKED', reasoning: 'r', anchor: '### Task 5:' }],
    ['done sibling', { status: 'DONE', reasoning: 'r', anchor: '### Task 4:' }],
    ['batch concerns', { status: 'DONE_WITH_CONCERNS', reasoning: 'r', concerns: ['c'], anchors: ['### Task 4:', '### Task 5:'] }],
    ['neither identity', { status: 'DONE', reasoning: 'r' }, /validation failed/i],
    ['both identities', { ...single, anchors: ['### Task 5:'] }, /validation failed/i],
    ['missing question', { status: 'NEEDS_CONTEXT', reasoning: 'r', anchor: '### Task 5:' }, /validation failed/i],
    ['missing concerns', { status: 'DONE_WITH_CONCERNS', reasoning: 'r', anchor: '### Task 5:' }, /validation failed/i],
    ['invalid status', { ...single, status: 'success' }, /validation failed/i],
    ['extra field', { ...single, extra: true }, /validation failed/i],
  ];
  for (const [name, value, error] of cases) {
    writeFileSync(runtime.outputPath, capture(value));
    const result = readStructuredOutput(runtime);
    if (error) assert.match(result.error, error, name);
    else assert.deepEqual(result, { value }, name);
  }
  for (const [name, raw, error] of [
    ['missing value', '{"status":"success"}', /requires a value/],
    ['truncated JSON', '{"status":"success","value":', /Failed to read/],
    ['error envelope', '{"status":"error","message":"invalid return"}', /validation failed: invalid return/i],
  ]) {
    writeFileSync(runtime.outputPath, raw);
    assert.match(readStructuredOutput(runtime).error, error, name);
  }
});

test('implementer disables only the mutation guard and reports blocked without the text sentinel', () => {
  const persona = read('agents/implementer.md');
  assert.match(persona, /^completionGuard: false$/m);
  assert.match(read('agents/plan-writer.md'), /^completionGuard: true$/m);
  assert.equal(expectsImplementationMutation('implementer', 'Implement only this anchored task.'), true);
  for (const [output, expected] of [
    ['\nBLOCKED: missing input', 'BLOCKED: missing input'],
    ['Status: BLOCKED\nReasoning: BLOCKED: missing input', undefined],
    ['Status: NEEDS_CONTEXT\nReasoning: missing input', undefined],
  ]) assert.equal(blockedLine(output), expected);
  assert.match(persona, /never open[^\n]*`BLOCKED:`/i);
  assert.match(persona, /Copy the dispatched `anchor` or `anchors`[^\n]*every status/);
  assert.match(read('skills/forge-skill/SKILL.md'), /caller owns an equivalent edit-less-completion check/);
});

test('the actual sequential diagnosis carrier names a read-only delegate and returns captured JSON', () => {
  const recovery = skill.split('### Chain stopped or failed')[1].split('### Recovery')[0];
  const code = recovery.match(/```ts\n([\s\S]*?)\n```/)[1];
  const carrier = runInNewContext(code, { subagent: value => value, DIAGNOSIS_SCHEMA: schema('DIAGNOSIS_SCHEMA') });
  const step = carrier.chain[0];
  assert.equal(step.agent, 'delegate');
  assert.equal(step.parallel, undefined);
  assert.equal(carrier.async, false);
  assert.equal(carrier.context, 'fresh');
  assert.ok(step.task.includes('Do not edit any file.'));
  assert.equal(expectsImplementationMutation(step.agent, `${step.task} task-0-implementer.patch`), false);
  const runtime = createStructuredOutputRuntime(step.outputSchema, scratch);
  const value = { tasks: [{ task: 5, status: 'failed', reportPath: '', diagnostic: 'capture absent' }], decision: 'repair', diagnostic: 'retry task 5' };
  writeFileSync(runtime.outputPath, capture(value));
  assert.deepEqual(readStructuredOutput(runtime), { value });
});

test('recovery reconciles missing siblings before diagnosis with bounded identity-matched reads', () => {
  const recovery = skill.split('### Chain stopped or failed')[1].split('### Recovery')[0];
  const holds = skill.split('## Orchestrator holds')[1].split('## Continuous Execution')[0];
  for (const token of ['every dispatched task', '## Outputs', '## Stop', 'ls <Artifacts>/structured-output/*/output.json', 'limit: 300', 'value.anchor', 'value.anchors', 'as a set', 'question', 'concerns', 'closing brace', 'plan index order', 'once for every task', 'both paths']) assert.ok(recovery.includes(token), token);
  assert.ok(recovery.indexOf('ls <Artifacts>') < recovery.indexOf('agent: "delegate"'));
  assert.match(recovery, /Only[^\n]*no accepted capture/);
  assert.match(recovery, /Repair rounds use this same recovery/);
  assert.match(holds, /capture[^\n]*limit: 300[^\n]*no offset/i);
  assert.match(holds, /Never dispatch `scout`, `delegate` or another child to relay reports/);
  assert.match(skill, /capture[^\n]*second source after result text/);
});

test('initial missing and empty patches fail admission while nonempty apply failures still stop', () => {
  const integration = skill.match(/3\. \*\*Read and integrate\.\*\*[^\n]*/)[0];
  assert.match(integration, /`test -s <patch>`/);
  const check = integration.match(/`(test -s <patch>)`/)[1];
  const patch = join(scratch, 'task.patch');
  for (const [name, content, accepted] of [['missing', undefined, false], ['empty', '', false], ['nonempty', 'diff', true]]) {
    if (content !== undefined) writeFileSync(patch, content);
    const result = spawnSync('bash', ['-c', check.replace('<patch>', '"$1"'), 'patch-admission', patch]);
    assert.equal(result.status === 0, accepted, name);
  }
  assert.match(skill, /\| Missing or zero-byte initial patch[^\n]*\| \+1[^\n]*your work produced no patch/);
  assert.match(integration, /nonempty initial patch[^\n]*fails[^\n]*staged[^\n]*stops/);
  assert.match(integration, /In-place waves: nothing to apply/);
});

test('home-relative HEAD reads retain plan and spec originals across dirty retries', () => {
  const repo = join(scratch, "home's checkout");
  mkdirSync(repo);
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim();
  git('init', '-q');
  for (const [key, value] of [['user.name', 'Test'], ['user.email', 'test@example.org'], ['commit.gpgsign', 'false'], ['core.hooksPath', '/dev/null']]) git('config', key, value);
  const plan = 'doc/plans/task.md';
  const spec = 'doc/specs/task.md';
  for (const [path, original] of [[plan, '### Task 1: original'], [spec, '## Original obligation']]) {
    mkdirSync(join(repo, path, '..'), { recursive: true });
    writeFileSync(join(repo, path), original);
  }
  git('add', '.');
  git('commit', '-qm', 'originals');
  for (const [path, original] of [[plan, '### Task 1: original'], [spec, '## Original obligation']]) {
    writeFileSync(join(repo, path), 'partially amended');
    assert.equal(git('show', `HEAD:${path}`), original);
    const invalid = spawnSync('git', ['-C', repo, 'show', `HEAD:${join(repo, path)}`], { encoding: 'utf8' });
    assert.notEqual(invalid.status, 0);
  }
  const untracked = 'doc/plans/untracked.md';
  writeFileSync(join(repo, untracked), 'not committed');
  const missing = spawnSync('git', ['-C', repo, 'show', `HEAD:${untracked}`], { encoding: 'utf8' });
  assert.notEqual(missing.status, 0);
  const runtime = createStructuredOutputRuntime(schema('APPLY_SCHEMA'), scratch);
  const value = { amendedSections: [], tasksAdded: [], tasksAnchorChanged: [], tasksRemoved: [], passed: false, failLines: [`baseline read failed: git -C '${repo}' show HEAD:${untracked}: ${missing.stderr.trim()}`] };
  writeFileSync(runtime.outputPath, capture(value));
  assert.deepEqual(readStructuredOutput(runtime), { value });
});
