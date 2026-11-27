import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const loop = 'skills/gauntlet/implement/loop/';
const driver = loop + 'loop.md';
const allow = new Map([
  [driver, ['refresh the held row dispositions']],
  [loop + 'unreachable-returns.md', ['Refresh held state']],
  ['skills/gauntlet/amendment-surface.md', ['repeated baseline refreshes', 'a refresh trigger']],
  ['skills/gauntlet-resume/reference/restore-loop.md', ['never refresh it inside the loop']],
  ['skills/gauntlet-resume/reference/reconstruction.md', []],
]);

test('only entry step 5 seeds the ledger task list', () => {
  const seed = 'plan_tracker({ action: "refresh", path: <absolute ledger path> })';
  for (const dir of ['skills', 'agents']) {
    for (const entry of readdirSync(join(root, dir), { recursive: true, withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const path = join(entry.parentPath, entry.name);
      const name = relative(root, path);
      let text = readFileSync(path, 'utf8');
      if (name === driver) {
        const entry = text.split('\n## Entry\n')[1]?.split('\n## Before each dispatch\n')[0];
        const step = entry?.split('\n').find(line => line.startsWith('5. Call `plan_check('));
        assert.ok(step?.includes('phase_tracker({ action: "start", phase: "implement" })`, then `' + seed), 'seed after implement starts');
        text = text.replace(step, step.replace(seed, ''));
      }
      assert.doesNotMatch(text, /action:\s*["']refresh["']|plan_tracker\s+refresh/i, name);
      if (!name.startsWith(loop) && !allow.has(name)) continue;
      for (const phrase of allow.get(name) ?? []) text = text.replaceAll(phrase, '');
      assert.doesNotMatch(text, /refresh/i, name);
    }
  }
});
