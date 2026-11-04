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
  ]) assert.ok(wave.includes(token), `pi file-finding dispatch requires ${token}`);
  assert.doesNotMatch(wave, /For each file payload[^\n]*dispatch one fresh implementer/);
  assert.match(sync, /fresh conflict-stop implementer/);
  assert.match(sync, /fresh implementer to merge/);
});
