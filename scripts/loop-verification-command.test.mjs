import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('the loop uses the shared verification command or discovers the project test entrypoint', () => {
  const driver = readFileSync(new URL('../skills/gauntlet/implement/loop/loop.md', import.meta.url), 'utf8');
  const table = driver.split('| Observed configuration | Action |')[1].split('\n\n')[0].trim().split('\n').slice(1);
  assert.equal(table.length, 2, 'only the shared command and discovery supply verification');
  assert.match(table[0], /`# shared`.*`## verification`.*`- verification command:`.*Use that command/);
  assert.match(table[1], /Otherwise.*Discover the project's test entrypoint from its actual manifest\/build instructions/);
});
