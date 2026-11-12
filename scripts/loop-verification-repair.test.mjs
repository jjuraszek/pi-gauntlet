import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
const gate = driver.split('\n## After the loop\n')[1].split('\n2. Dispatch')[0];

test('verification repairs reserve and consume the shared allowance across legs and resume', () => {
  assert.ok(Buffer.byteLength(driver) < 50_000);
  for (const path of [
    'skills/loop-implementation/reference/coordinated-legs.md',
    'skills/gauntlet-resume/reference/reconstruction.md',
  ]) {
    const reference = readFileSync(new URL(path, root), 'utf8');
    assert.match(reference, /Route `pending: verify` through.*After the loop step 1/);
  }
  for (const token of [
    'repairs < allowance', 'loop: repair verification',
    'plus one for a `pending: verify` tuple with no admitted repair commit',
    'pending: verify | <repo> | <HEAD>', 'on disk before dispatch',
    'repairs: <k> of <allowance>', 'no per-row retry increments',
    'Remove `pending:` only in the parent repair marker',
    'exact pending tuple and consumed `iteration:`',
  ]) assert.ok(gate.includes(token), token);
  assert.doesNotMatch(gate, /once per flow|one repair below|Never repair again for another leg|spent identity/);
});

test('interrupted verification repairs clean both boundaries and consume only the reserved repair', () => {
  for (const token of [
    '## Interrupted recovery steps 1-2', 'all ledger rows unchanged',
    'empty `loop: repair verification` marker', 'already-consumed iteration',
    "loop-<failing leg's base SHA>-<pre-bump iteration>.jobs",
    'reset home to the saved home HEAD', 'no second bump',
    'non-empty `status --porcelain` after reset blocks neither the marker nor the rerun',
    "Rerun the failing checkout's gate pairs once",
    'still-unexecuted pairs from other checkouts', 'Never spend verify-phase credits',
    'failure pass with the verification repair count',
  ]) assert.ok(gate.includes(token), token);
  assert.doesNotMatch(gate, /provenance|ownership|no-launch|recovery-incomplete|action-spend|accounting|after owned jobs exit and the boundary is clean/);
});

test('verification reset or marker failure repeats within the same allowance before any dispatch', () => {
  const recovery = readFileSync(new URL('skills/loop-implementation/reference/interrupted-recovery.md', root), 'utf8');
  for (const token of [
    'rev-parse HEAD', 'step 3 commit is not written', 'dispatch nothing',
    'run steps 2-3 again from the saved copy', 'verification repair count',
    'held with the saved copy while no commit can land',
    'ledger-only repair commit lands on `HEAD_BEFORE`',
    'existing row, seed or verification exhaustion stop',
    "never use any other HEAD as the next dispatch's `HEAD_BEFORE`",
  ]) assert.ok(recovery.includes(token), token);
});
