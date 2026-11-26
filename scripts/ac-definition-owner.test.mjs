import assert from 'node:assert/strict';
import { globSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const sources = globSync(['README.md', '{agents,skills,extensions,doc}/**/*'], {
  cwd: root, exclude: ['doc/specs'], withFileTypes: true,
}).filter(entry => entry.isFile()).map(entry => {
  const path = relative(root, join(entry.parentPath, entry.name));
  return [path, read(path)];
});

test('one shipped reference owns the acceptance criterion definition', () => {
  const definition = 'An acceptance criterion states a functionality or a constraint the change delivers: what is observed, not how it is built.';
  const owners = sources.filter(([, text]) => text.includes(definition)).map(([path]) => path);
  assert.deepEqual(owners, ['skills/shape-ticket/reference/ac-classes.md']);
});

test('current instructions do not give competing rules for stages and deployed observations', () => {
  const retired = /\b(observation half|observable half|mechanism half|not judged here|workflow-stage proof|deploy-window rule|operator step|post action)\b/i;
  assert.deepEqual(sources.flatMap(([path, text]) => {
    const match = text.match(retired);
    return match ? [`${path}: ${match[0]}`] : [];
  }), []);
});

test('shipped instructions and extension sources do not use the retired venue disposition', () => {
  const offenders = sources.filter(([path, text]) => {
    if (path.startsWith('extensions/') && path.endsWith('.test.ts')) return false;
    // Finish removes loop ledgers; their evidence quotes the inputs that checks reject.
    if (/^doc\/plans\/[^/]+-ledger\.md$/.test(path) && text.startsWith('# Ledger - loop engine\n')) return false;
    return text.includes('venue:');
  });
  assert.deepEqual(offenders.map(([path]) => path), []);
});

test('only ticket migration readers name the old housekeeping heading', () => {
  const readers = sources.filter(([, text]) => text.includes('Post-deployment housekeeping')).map(([path]) => path);
  assert.deepEqual(readers.sort(), [
    'skills/gauntlet/brainstorm/gatherer.md',
    'skills/gauntlet/brainstorm/ticket-acceptance.md',
    'skills/shape-ticket/SKILL.md',
  ]);
});

test('sorters, council and conformance use the shared definition', () => {
  for (const [token, paths] of [
    ['ac-classes.md', ['skills/shape-ticket/SKILL.md', 'skills/gauntlet/brainstorm/ticket-acceptance.md', 'skills/check-delivery/SKILL.md']],
    ['AC definition:', [
      'skills/gauntlet/brainstorm/council.md', 'skills/gauntlet/amendment-surface.md', 'skills/gauntlet/conformance-check.md',
      'skills/chase-bug/hotfix.md', 'skills/shape-ticket/SKILL.md',
      'agents/spec-council-member.md', 'agents/spec-council-applier.md', 'agents/conformance-reviewer.md',
    ]],
  ]) {
    assert.deepEqual(paths.filter(path => !read(path).includes(token)), [], `missing ${token}`);
  }
});

test('companion spec grammar carries Integration between Problem and Decisions', () => {
  assert.match(read('skills/gauntlet/legs.md'), /^```markdown\n# <home spec title>\n[^`]*^## Problem\n[^`]*^## Integration\n[^`]*^## Decisions\n/m);
  assert.match(read('skills/gauntlet/amendment-surface.md'), /^Apply the \[carried-part rewrite rule\]\(legs\.md#home-block-and-companion-files\)\nin this same amendment\. Commit home,/m);
  assert.match(read('skills/gauntlet/brainstorm/spec-pr.md'), /\)\. Apply the \[carried-part rewrite rule\]\(\.\.\/legs\.md#home-block-and-companion-files\) before re-dispatching/);
});
