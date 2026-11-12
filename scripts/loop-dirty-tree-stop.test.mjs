import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const driver = read('skills/loop-implementation/SKILL.md');
const entry = driver.split('\n## Entry\n')[1].split('\n## Driver holds\n')[0];
const stop = driver.split('\n## Human stop\n')[1].split('\n## Gate set\n')[0];

test('entry and restore stop for dirt only with no pending dispatch', () => {
  assert.match(entry, /4\. Require a clean named-branch implementation worktree\. With dirty status and no `pending:` tuple, take ## Human stop before writing the ledger/);
  for (const token of [
    'non-empty `status --porcelain` with no `pending:` tuple',
    'entry step 4 or on resume',
    '`Stopped: dirty tree with no dispatch pending`',
    'list the dirty paths',
    'offer `discard` or Stop only, never budget offers',
    'Start the message with `gauntlet: question`',
    "then print `Preserve every row's attempts.`",
    'list every `open` or `failed` row after the header',
  ]) assert.ok(stop.includes(token), token);
  assert.match(entry, /route a recovered pending tuple through reconstruction's pending recovery and ## Interrupted recovery before any unresolved dirty-tree stop/);
});

test('only typed discard resets dirt and resumes the suspended entry or restore sequence', () => {
  for (const token of [
    'On a typed `discard`',
    'git -C "<checkout>" reset --hard HEAD',
    'git -C "<checkout>" clean -fd',
    "at fresh entry continue Entry step 4's ledger write and step 5",
    '`plan_check`, `loop: seed ledger`, implement start, refresh',
    'on a restore finish eligible migration, final allowance validation and the refresh',
    '## Before each dispatch` in implement or `## After the loop` step 1 in verify',
    'Never jump to the ordered table before a ledger is seeded and admitted',
    'Any other reply preserves the tree and keeps the stop open',
    'Before typed discard, make no tree or ledger writes, reset, clean or dispatch',
  ]) assert.ok(stop.includes(token), token);
});

for (const [sample, inputPattern, facts] of [
  ['gate-line-first', /no `pending:` tuple/, ['question-first', 'authorization', 'preserved']],
  ['human-stop-counts', /E\. Interrupted two-commit return/, ['boundary-stops', 'pending-recovery', 'durable-counts']],
  ['row-budget-actions', /Independently type `discard`/, ['boundaries', 'discard-continuation']],
]) {
  test(`${sample} distinguishes unrelated dirt from automatic pending recovery`, () => {
    const input = read(`eval/loop-implementation/samples/${sample}/case.md`);
    const expected = read(`eval/loop-implementation/samples/${sample}/expected.md`);
    assert.match(input, inputPattern);
    assert.match(input, /src\/parser\.ts/);
    assert.match(expected, /Stopped: dirty tree with no dispatch pending/);
    for (const fact of facts) assert.ok(expected.includes(`- ${fact}: `), fact);
    assert.doesNotMatch(input + expected, /recovery.incomplete|awaits discard authorization after a dirty or multiple-commit return|E,? and F each render/);
  });
}
