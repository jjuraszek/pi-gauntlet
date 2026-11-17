import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createJiti } from 'jiti';
import { sha256 } from '../eval/lib/checks.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dir = join(root, 'eval/gauntlet-resume/tool-traces');
const read = path => readFileSync(path, 'utf8');
const { checkPlan } = await createJiti(import.meta.url).import('../extensions/lib/plan-check.ts');

// This file is a local acceptance check, not a CI test or a model launcher.
test('C1 scratch inputs admit both engines without repair or pending recovery', async () => {
  const { prepare } = await import('../eval/gauntlet-resume/tool-traces/prepare.mjs');
  const fixture = prepare();
  for (const kind of ['ledger', 'plan']) {
    const run = fixture[kind];
    const brief = read(run.brief);
    assert.match(brief, /^# Handoff: /);
    assert.doesNotMatch(brief, /^legs:|^PR:/m);
    assert.match(brief, /^  → implement\(fixture\)$/m);
    assert.match(brief, /Gate history not restored - re-validate before advancing\.\n$/);
    const plan = read(join(run.worktree, run.artifact));
    const spec = read(join(run.worktree, 'doc/specs/widget.md'));
    assert.deepEqual(checkPlan(plan, spec, {
      exists: path => existsSync(join(run.worktree, path)), glob: () => [],
    }).findings, [], kind);
    if (kind === 'ledger') {
      assert.match(plan, /^allowance: 4\nreturned: none$/m);
      assert.doesNotMatch(plan, /^cap:|^pending:/m);
      assert.match(brief, /^Ledger: doc\/plans\/widget-ledger.md\nLast decision: none$/m);
    } else {
      assert.match(brief, /^Active task: W1: widget$/m);
    }
  }
});

for (const [kind, ceiling] of [['ledger', 42000], ['plan', 37000]]) {
  test(`C1 ${kind}: observed single-repo reads stay on the current engine route`, () => {
    const recordPath = join(dir, 'results', `${kind}.json`);
    assert.ok(existsSync(recordPath), `unreachable: C1 ${kind} tool-enabled trace missing - primary session using tool-traces/README.md`);
    const record = JSON.parse(read(recordPath));
    const stream = read(join(dir, 'results', `${kind}.jsonl`));
    const brief = read(join(dir, 'results', `${kind}-brief.md`));
    assert.equal(record.traceSha, sha256(stream), 'captured stream hash');
    assert.equal(record.briefSha, sha256(brief), 'recorded input hash');
    assert.doesNotMatch(brief, /^legs:/m);
    const events = stream.trimEnd().split('\n').map(line => JSON.parse(line));
    assert.equal(events[0].type, 'session', 'raw JSON-mode stream, not a narrated replay');
    assert.equal(events.at(-1).type, 'agent_settled', 'affirmative settled evidence');
    assert.equal(events.at(-1).aborted, false);
    const starts = events.filter(event => event.type === 'tool_execution_start');
    const ends = events.filter(event => event.type === 'tool_execution_end');
    const completed = start => {
      const end = ends.find(event => event.toolCallId === start.toolCallId);
      assert.ok(end, `${start.toolName}: completed tool execution`);
      assert.equal(end.isError, false, `${start.toolName}: successful tool execution`);
      return end;
    };
    const reads = starts.filter(event => event.toolName === 'read');
    const briefRead = reads.find(event => event.args.path === record.briefPath);
    assert.ok(briefRead, 'the recorded brief was read by the resume session');
    assert.equal(completed(briefRead).result.content.filter(item => item.type === 'text').map(item => item.text).join('\n').trimEnd(), brief.trimEnd());
    const owned = reads.map(event => event.args.path.match(/(?:^|\/)(skills\/(?:gauntlet-resume|gauntlet-handoff)\/.+\.md)$/)?.[1]).filter(Boolean);
    const expected = ['SKILL.md', 'reference/brief-contract.md', 'reference/reconstruction.md', `reference/restore-${kind === 'ledger' ? 'loop' : 'plan'}.md`]
      .map(path => `skills/gauntlet-resume/${path}`);
    assert.ok(!owned.some(path => path.endsWith('/coordinated.md')), 'no coordinated rule read on a single-repo route');
    assert.deepEqual([...new Set(owned)].sort(), expected.toSorted(), 'exact route, including the entry skill read');
    assert.deepEqual(Object.keys(record.instructions).sort(), expected.toSorted(), 'all measured instructions are bound to this run');
    let bytes = 0;
    for (const path of expected) {
      const source = read(join(root, path));
      assert.equal(record.instructions[path], sha256(source), `${path}: recapture after an instruction edit`);
      bytes += Buffer.byteLength(source);
      const wholeRead = reads.filter(event => event.args.path.endsWith(path)).some(event => {
        const result = completed(event).result;
        return result.content.filter(item => item.type === 'text').map(item => item.text).join('\n').trimEnd() === source.trimEnd();
      });
      assert.ok(wholeRead, `${path}: one successful whole-file read matches the current source`);
    }
    assert.ok(bytes <= ceiling, `${bytes} bytes exceeds ${ceiling}`);
    const mutations = starts.filter(event => ['phase_tracker', 'plan_tracker'].includes(event.toolName) && event.args.action !== 'status');
    assert.ok(mutations.length > 0, 'a refusal before restore is not route evidence');
    assert.equal(mutations[0].toolName, 'phase_tracker');
    assert.equal(mutations[0].args.action, 'start');
    assert.equal(mutations[0].args.phase, 'brainstorm');
    const restored = mutations.find(event => event.toolName === 'plan_tracker' && event.args.action === (kind === 'ledger' ? 'refresh' : 'init'));
    assert.ok(restored, 'restore reached its engine-specific task projection');
    completed(restored);
  });
}
