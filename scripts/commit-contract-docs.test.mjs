import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('engine and operator docs describe ledger attribution and decision counters', async () => {
  for (const path of ['doc/implement-engines.md', 'doc/configuration.md']) {
    const text = (await read(path)).replaceAll('\\|', '|');
    for (const token of ['returned: <target> | <repo> | <pre-dispatch HEAD>`', 'repair seed |', 'repair verification | <repo> <child sha7, or interrupted - <reason>> | iteration <i>', 'amended |', 'returns/', 'return-file.md', 'finishing-a-development-branch/reference/commit-message.md', 'the saved `returned:` value', 'migrate any cap before converting repair history']) {
      assert.ok(text.includes(token), `${path}: ${token}`);
    }
    assert.doesNotMatch(text, /loop: (?:repair|retry|amend|cut|migrate|escalate|seed)/);
    assert.doesNotMatch(text, /first two body lines match the dispatched/);
    assert.doesNotMatch(text, /amendment \||returned: <target>[^`]*iteration|unmatched `pending: verify`|match repo\/HEAD/);
  }
});

test('gate docs bound repairs by decisions without treating attribution misses as interruptions', async () => {
  const text = await read('doc/gate-contract.md');
  for (const token of ['repair verification | <repo> <child sha7, or interrupted - <reason>> | iteration <i>', 'plus one for a `pending: verify`', 'result-validation misses', 'restore the saved `returned:` value', 'amended |']) {
    assert.ok(text.includes(token), token);
  }
  assert.doesNotMatch(text, /loop: (?:repair|retry|amend|cut)|amendment \||unmatched `pending: verify`|matching repo\/HEAD/);
});

test('front-door docs expose the shared message contract', async () => {
  const readme = await read('README.md');
  assert.ok(readme.includes('skills/finishing-a-development-branch/reference/commit-message.md'));
  assert.ok(readme.includes('returned:'));
  const changelog = await read('CHANGELOG.md');
  const unreleased = changelog.split('## Unreleased\n')[1]?.split('\n## ')[0];
  assert.ok(unreleased?.includes('plain imperative sentence'));
  assert.ok(unreleased?.includes('ledger'));
});

const docs = ['README.md', 'doc/configuration.md', 'doc/implement-engines.md', 'doc/gate-contract.md',
  'skills/gauntlet-resume/reference/reconstruction.md'];
const prose = text => text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');

function headingIds(text) {
  const counts = new Map();
  return [...prose(text).matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)].map(([, heading]) => {
    const slug = heading.toLowerCase().replace(/<[^>]*>/g, '')
      .replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, '').replace(/\s/g, '-');
    const count = counts.get(slug) ?? 0;
    counts.set(slug, count + 1);
    return count ? `${slug}-${count}` : slug;
  });
}

test('current contract docs link to existing files and heading anchors', async () => {
  const failures = [];
  for (const path of docs) {
    const text = prose(await read(path));
    for (const [, href] of text.matchAll(/\]\(([^\s)]+)\)/g)) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue;
      const target = new URL(href, new URL(`../${path}`, import.meta.url));
      const anchor = decodeURIComponent(target.hash.slice(1));
      target.hash = '';
      try {
        assert.ok((await stat(target)).isFile(), 'target is not a file');
        if (anchor) assert.ok(headingIds(await readFile(target, 'utf8')).includes(anchor), 'heading is missing');
      } catch (error) {
        failures.push(`${path}: ${href}: ${error.message}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});
