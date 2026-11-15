import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('engine and operator docs describe ledger attribution and decision counters', async () => {
  for (const path of ['doc/implement-engines.md', 'doc/configuration.md']) {
    const text = await read(path);
    for (const token of ['returned:', 'repair seed |', 'repair verification |', 'amendment |', 'returns/', 'return-file.md', 'commit-message.md']) {
      assert.ok(text.includes(token), `${path}: ${token}`);
    }
    assert.doesNotMatch(text, /loop: (?:repair|retry|amend|cut|migrate|escalate|seed)/);
    assert.doesNotMatch(text, /first two body lines match the dispatched/);
  }
});

test('gate docs bound repairs by decisions without treating attribution misses as interruptions', async () => {
  const text = await read('doc/gate-contract.md');
  for (const token of ['repair verification |', 'unmatched `pending: verify`', 'result-validation misses', 'returned:']) {
    assert.ok(text.includes(token), token);
  }
  assert.doesNotMatch(text, /loop: (?:repair|retry|amend|cut)/);
});

test('front-door docs expose the shared message contract', async () => {
  const readme = await read('README.md');
  assert.ok(readme.includes('skills/_shared/commit-message.md'));
  assert.ok(readme.includes('returned:'));
  const changelog = await read('CHANGELOG.md');
  const unreleased = changelog.split('## Unreleased\n')[1]?.split('\n## ')[0];
  assert.ok(unreleased?.includes('plain imperative sentence'));
  assert.ok(unreleased?.includes('ledger'));
});
