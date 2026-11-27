import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const driver = read('skills/gauntlet/implement/loop/loop.md');
const entry = driver.split('\n## Entry\n')[1].split('\n## Driver holds\n')[0];
const pointer = driver.split('\n## Human stop\n')[1].split('\n## Gate set\n')[0];
const stop = read('skills/gauntlet/implement/loop/human-stop.md');

test('only stop and amendment triggers load the human stop rules', () => {
  assert.match(pointer, /At .*implement or verify.*discard authorization.*spec amendment.*auto-applied.*reuse the full procedure of `human-stop\.md` only if it is still available in the current context; otherwise read it in full now with `read` at its absolute path before acting\. Stop on an unreadable file naming its path; never reconstruct it\./);
  assert.equal(driver.split('human-stop.md').length, 2);
  assert.doesNotMatch(driver, /\| Human choice \| Durable action \||Start the message with `gauntlet: question`/);
  assert.match(stop, /^# Human stop\n/);
  assert.match(stop, /\| Human choice \| Durable action \|/);
});

test('entry and restore stop for dirt only with no pending dispatch', () => {
  assert.match(entry, /4\. Require a clean named-branch implementation worktree\. With dirty status and no `pending:` tuple, take ## Human stop before writing the ledger/);
  for (const token of [
    'non-empty `status --porcelain` with no `pending:` tuple',
    '[entry step 4](loop.md#entry) or on resume',
    '`Stopped: dirty tree with no dispatch pending`',
    'list the dirty paths',
    'offer `discard` or Stop only, never budget offers',
    'Start the message with `gauntlet: question`',
    "then print `Preserve every row's attempts.`",
    'list every `open` or `failed` row after the header',
  ]) assert.ok(stop.includes(token), token);
  assert.match(entry, /route a recovered pending tuple through resume's pending recovery and ## Interrupted recovery before any unresolved dirty-tree stop/);
});

test('only typed discard resets dirt and resumes the suspended entry or restore sequence', () => {
  for (const token of [
    'On a typed `discard`',
    'git -C "<checkout>" reset --hard HEAD',
    'git -C "<checkout>" clean -fd',
    "at fresh entry continue [Entry](loop.md#entry) step 4's ledger write and step 5",
    '`plan_check`, skeleton commit, implement start, refresh',
    'on a restore finish eligible migration, final allowance validation and the refresh',
    '[Before each dispatch](loop.md#before-each-dispatch) in implement or [After the loop](loop.md#after-the-loop) step 1 in verify',
    'Never jump to the ordered table before a ledger is seeded and admitted',
    'Any other reply preserves the tree and keeps the stop open',
    'Before typed discard, make no tree or ledger writes, reset, clean or dispatch',
  ]) assert.ok(stop.includes(token), token);
});

for (const [sample, inputPattern, facts] of [
  ['gate-line-first', /no `pending:` tuple/, ['question-first', 'authorization', 'preserved', 'fresh-entry', 'discard-continuation']],
  ['human-stop-counts', /E\. Interrupted two-commit return/, ['boundary-stops', 'pending-recovery', 'durable-counts']],
  ['row-budget-actions', /Independently type `discard`/, ['boundaries', 'discard-continuation']],
]) {
  test(`${sample} distinguishes unrelated dirt from automatic pending recovery`, () => {
    const input = read(`eval/loop/samples/${sample}/case.md`);
    const expected = read(`eval/loop/samples/${sample}/expected.md`);
    assert.match(input, inputPattern);
    assert.match(input, /src\/parser\.ts/);
    if (sample === 'gate-line-first') {
      assert.match(input, /Variant A: restored ledger/);
      assert.match(input, /Variant B: independent fresh entry before any ledger exists/);
      assert.match(input, /human then types `discard`/);
      assert.match(expected, /reset --hard HEAD.*clean -fd/);
      assert.match(expected, /Entry step 4's ledger write and step 5/);
      assert.match(expected, /never jumps to the ordered table/);
    }
    assert.match(expected, /Stopped: dirty tree with no dispatch pending/);
    for (const fact of facts) assert.ok(expected.includes(`- ${fact}: `), fact);
    assert.doesNotMatch(input + expected, /recovery.incomplete|awaits discard authorization after a dirty or multiple-commit return|E,? and F each render/);
  });
}
