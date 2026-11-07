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

test('interrupted verification repairs reuse ownership-fenced cleanup and preserve row cells', () => {
  for (const token of [
    '## Interrupted recovery steps 1-3', 'all ledger rows unchanged',
    'empty `loop: repair verification` marker', 'already-consumed iteration',
    'recovery-incomplete stop', 'Rerun the failing checkout\'s gate pairs once',
    'still-unexecuted pairs from other checkouts', 'Never spend verify-phase credits',
  ]) assert.ok(gate.includes(token), token);
});
