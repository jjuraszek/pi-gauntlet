import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('pi file findings dispatch companion loop rows while sync keeps implementer helpers', () => {
  const fixWave = readFileSync(new URL('skills/gatekeep-pr/reference/fix-wave.md', root), 'utf8');
  const sync = fixWave.split('\n## Sync\n')[1].split('\n## Wave\n')[0];
  const wave = fixWave.split('\n## Wave\n')[1].split('\n## Review before push\n')[0];
  for (const token of [
    'agent: "loop-implementer"', 'target: <row>', 'Leg: gatekeep', 'pending:',
    'acceptance:', 'level: "none"', 'context: "fresh"', 'async: false',
    'iteration: <i>', 'spec: <absolute derived spec>', 'ledger: <absolute ledger>',
    'base: <MB>', 'previous decision:', 'mapped original AC:', 'SCOPED_TEST_COMMANDS:',
    'outputMode: "file-only"', 'HEAD_BEFORE', 'iteration: <i + 1>',
    'Companion result commit',
  ]) assert.ok(wave.includes(token), `pi file-finding dispatch requires ${token}`);
  assert.doesNotMatch(wave, /For each file payload[^\n]*dispatch one fresh implementer/);
  assert.match(sync, /fresh conflict-stop implementer/);
  assert.match(sync, /fresh implementer to merge/);
  const review = fixWave.split('\n## Review before push\n')[1].split('\n## Re-review task\n')[0];
  assert.doesNotMatch(review, /fresh implementer/);
  assert.match(review, /Row dispatch/);
  const skill = readFileSync(new URL('skills/gatekeep-pr/SKILL.md', root), 'utf8');
  assert.match(skill, /`loop-implementer` for file findings/);
  assert.ok(readFileSync(new URL('scripts/ci.mjs', root), 'utf8').includes('R("scripts/gatekeep-fix-loop-contract.test.mjs")'));
  for (const path of [
    'skills/gatekeep-pr/reference/batch.md',
    'skills/gatekeep-pr/reference/post-selection-loop.md',
    'skills/gatekeep-pr/reference/findings.md',
    'agents/pr-gatekeeper.md',
  ]) assert.match(readFileSync(new URL(path, root), 'utf8'), /loop-implementer/, `${path} must route file findings to the row worker`);
});
