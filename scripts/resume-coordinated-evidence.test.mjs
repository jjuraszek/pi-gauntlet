import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createJiti } from 'jiti';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { intentBody } from '../eval/lib/intent.mjs';
import { MODELS } from '../eval/lib/models.mjs';
import { judgmentCurrent, readRecord } from '../eval/lib/records.mjs';
import { assemble, baseReader, inputSha, parseCase, treeReader } from '../eval/lib/replay.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(path, 'utf8');
const tree = treeReader(root);
const dir = 'eval/gauntlet-resume';
const { checkPlan } = await createJiti(import.meta.url).import('../extensions/lib/plan-check.ts');
const git = (cwd, ...args) => execFileSync('timeout', ['-k', '30', '10', 'git', '-C', cwd, ...args], {
  encoding: 'utf8', timeout: 45_000,
}).trimEnd();

// Local acceptance only: CI cannot collect primary-session tool traces or paid replays.
test('C2 scratch brief admits a home plan and the declared companion checkout', async () => {
  const { prepareCoordinated } = await import('../eval/gauntlet-resume/tool-traces/prepare-coordinated.mjs');
  const fixture = prepareCoordinated();
  const { home, companion } = fixture;
  const brief = read(fixture.brief);
  const spec = read(join(home.worktree, 'doc/specs/widget.md'));
  const plan = read(join(home.worktree, home.artifact));
  assert.deepEqual([...brief.matchAll(/^  - repo: (.+)$/gm)].map(match => match[1]), [home.repo, companion.repo]);
  assert.match(brief, /^  → implement\(fixture\)$/m);
  assert.match(brief, /^Active task: W1: widget$/m);
  assert.doesNotMatch(brief, /^Ledger:|^PR:|receipt:|worktree: missing/m);
  assert.match(brief, /Gate history not restored - re-validate before advancing\.\n$/);
  assert.equal(read(join(home.primary, '.pi/gauntlet.md')), read(join(home.worktree, '.pi/gauntlet.md')));
  assert.match(read(join(home.primary, '.pi/gauntlet.md')), /## shape-ticket\n- sibling: https:\/\/example\.test\/acme\/repo-b\.git/);
  assert.deepEqual([...spec.matchAll(/^### Leg: (.+)$/gm)].map(match => match[1]), [home.repo, companion.repo]);
  assert.match(read(join(companion.worktree, 'doc/specs/widget.md')), /^\*\*Home:\*\* acme\/repo-a fixture-resume doc\/specs\/widget\.md$/m);
  for (const leg of [home, companion]) {
    assert.equal(git(leg.worktree, 'status', '--porcelain'), '');
    assert.equal(git(leg.primary, 'status', '--porcelain'), '');
    assert.equal(git(leg.worktree, 'branch', '--show-current'), 'fixture-resume');
    assert.equal(git(leg.worktree, 'rev-parse', 'HEAD'), leg.head);
    assert.ok(brief.includes(`    HEAD: ${leg.head}\n    dirty: clean`));
    assert.equal(realpathSync(resolve(leg.worktree, git(leg.worktree, 'rev-parse', '--git-common-dir'))),
      realpathSync(resolve(leg.primary, git(leg.primary, 'rev-parse', '--git-common-dir'))));
    assert.equal(git(leg.primary, 'config', '--get', 'remote.origin.url'), `https://example.test/${leg.repo}.git`);
  }
  assert.deepEqual(checkPlan(plan, spec, {
    exists: (path, leg) => existsSync(join(leg === companion.repo ? companion.worktree : home.worktree, path)),
    glob: () => [],
  }).findings, []);
});

test('C2 coordinated rules finish reading before the first tracker mutation', () => {
  const results = join(root, dir, 'tool-traces/results');
  assert.ok(existsSync(join(results, 'coordinated.json')),
    'unreachable: C2 coordinated tool-enabled trace missing - primary session using tool-traces/coordinated.md');
  const record = JSON.parse(read(join(results, 'coordinated.json')));
  const stream = read(join(results, 'coordinated.jsonl'));
  const brief = read(join(results, 'coordinated-brief.md'));
  assert.equal(record.traceSha, sha256(stream), 'complete captured stream hash');
  assert.equal(record.briefSha, sha256(brief), 'recorded coordinated input hash');
  assert.match(brief, /^legs:$/m);
  assert.equal([...brief.matchAll(/^  - repo: /gm)].length, 2);
  const events = stream.trimEnd().split('\n').map(line => JSON.parse(line));
  assert.equal(events[0].type, 'session');
  assert.equal(events.at(-1).type, 'agent_settled', 'affirmative exit evidence, not a partial trace');
  assert.equal(events.at(-1).aborted, false);
  const starts = events.filter(event => event.type === 'tool_execution_start');
  const completed = start => {
    const end = events.find(event => event.type === 'tool_execution_end' && event.toolCallId === start.toolCallId);
    assert.ok(end, `${start.toolName}: completed tool execution`);
    assert.ok(events.indexOf(end) > events.indexOf(start), 'tool result follows its start');
    assert.equal(end.isError, false, `${start.toolName}: successful tool execution`);
    return end;
  };
  const text = end => end.result.content.filter(item => item.type === 'text').map(item => item.text).join('\n').trimEnd();
  const reads = starts.filter(event => event.toolName === 'read');
  const briefRead = reads.find(event => event.args.path === record.briefPath);
  assert.ok(briefRead, 'recorded brief was read by this session');
  assert.equal(text(completed(briefRead)), brief.trimEnd());
  const required = ['SKILL.md', 'reference/brief-contract.md', 'reference/reconstruction.md', 'reference/restore-plan.md', 'reference/coordinated.md']
    .map(path => `skills/gauntlet-resume/${path}`);
  assert.deepEqual(Object.keys(record.instructions).sort(), required.toSorted(), 'bind every coordinated plan-route instruction');
  const mutations = starts.filter(event => ['phase_tracker', 'plan_tracker'].includes(event.toolName) && event.args.action !== 'status');
  assert.ok(mutations.length > 0, 'pre-restore refusal is not ordering evidence');
  assert.equal(mutations[0].toolName, 'phase_tracker');
  assert.equal(mutations[0].args.action, 'start');
  assert.equal(mutations[0].args.phase, 'brainstorm');
  completed(mutations[0]);
  assert.ok(events.indexOf(completed(briefRead)) < events.indexOf(mutations[0]));
  for (const path of required) {
    const source = tree(path);
    assert.equal(record.instructions[path], sha256(source), `${path}: recapture after instruction edits`);
    const matching = reads.filter(event => event.args.path.endsWith(`/${path}`))
      .map(completed).filter(end => text(end) === source.trimEnd());
    assert.ok(matching.length > 0, `${path}: successful whole-file read matches the source`);
    if (path.endsWith('/coordinated.md')) {
      assert.ok(matching.some(end => events.indexOf(end) < events.indexOf(mutations[0])),
        'coordinated read result precedes the first tracker write, not merely its request');
    }
  }
  const restored = mutations.find(event => event.toolName === 'plan_tracker' && event.args.action === 'init');
  assert.ok(restored, 'admitted coordinated route reaches task restoration');
  completed(restored);
});

const stops = ['legs-membership', 'legs-wrong-primary', 'legs-home-mismatch', 'legs-missing', 'legs-wrong-repo'];
for (const sample of stops) {
  test(`C4 ${sample}: same recorded input preserves every coordinated stop`, () => {
    const target = JSON.parse(tree(`${dir}/target.json`));
    const { bundle, drop, text } = parseCase(tree(`${dir}/samples/${sample}/case.md`));
    const selected = { ...target, skillFiles: target.skillFiles.filter(file => !drop.includes(file.path)) };
    const newPaths = target.skillFiles.filter(file => file.new).map(file => file.path);
    const expected = tree(`${dir}/samples/${sample}/expected.md`);
    const { facts } = parseExpected(expected);
    const input = inputSha(tree(`${dir}/replay.md`), text, bundle);
    const baseline = readRecord(join(root, dir, 'results'), sample, 'baseline');
    const candidate = readRecord(join(root, dir, 'results'), sample, 'candidate');
    assert.ok(baseline && candidate, `${sample}: primary session supplies both replay records`);
    assert.equal(baseline.skillSha, sha256(assemble(selected, baseReader(root, '09c9f4e1'), bundle, { arm: 'baseline', newPaths })),
      `${sample}: rerun baseline against 09c9f4e1`);
    assert.equal(candidate.skillSha, sha256(assemble(selected, tree, bundle)), `${sample}: rerun candidate after the split`);
    for (const record of [baseline, candidate]) {
      assert.equal(record.inputSha, input, `${sample}: same current input`);
      assert.deepEqual(record.models.replay, [...MODELS.replay], 'both frozen replay models');
    }
    for (const model of MODELS.replay) {
      const before = baseline.outputs[model];
      const after = candidate.outputs[model];
      for (const output of [before, after]) {
        assert.equal(output?.status, 'ok', model);
        assert.ok(output.text.trim(), `${model}: nonempty replay`);
      }
      const judgment = candidate.judge?.[model];
      assert.ok(judgmentCurrent(judgment, {
        factsSha: sha256(expected), judgePromptSha: sha256(tree('eval/judge.md')),
        intentSha: sha256(intentBody(tree(`${dir}/intent.md`))),
        baselineOutputSha: sha256(before.text), candidateOutputSha: sha256(after.text),
      }), `${sample}/${model}: current judgment bound to both outputs`);
      for (const fact of facts) {
        assert.equal(judgment.facts[fact.id]?.before, 'holds', `${sample}/${model}/${fact.id}: baseline`);
        assert.equal(judgment.facts[fact.id]?.after, 'holds', `${sample}/${model}/${fact.id}: candidate`);
      }
    }
  });
}
