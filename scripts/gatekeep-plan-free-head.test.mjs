import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix } from 'node:path';
import test from 'node:test';

const loop = readFileSync(new URL('../skills/gatekeep-pr/reference/post-selection-loop.md', import.meta.url), 'utf8');
const check = loop.split('### Plan-free head\n')[1]?.split('\n### ')[0] ?? '';

function recipe() {
  const blocks = [...check.matchAll(/```bash\n([\s\S]*?)\n```/g)];
  assert.equal(blocks.length, 1, 'one executable assessed-head artifact check');
  return blocks[0][1];
}

function run(command, args, options) {
  const result = spawnSync('timeout', ['-k', '30', '15', command, ...args], {
    encoding: 'utf8', timeout: 50_000, ...options,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  assert.notEqual(result.status, 124, 'fixture command timed out');
  return result;
}

function fixture(spec) {
  const cwd = mkdtempSync(join(tmpdir(), 'gatekeep-head-tree-'));
  const env = {
    PATH: process.env.PATH, HOME: cwd, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.test',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.test',
    SCOPE_SOURCE: 'spec', SPEC_PATH: spec,
  };
  function git(args, input) {
    const result = run('git', args, { cwd, env, input });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  }
  git(['init', '--quiet', '--initial-branch=fixture']);
  const blob = git(['hash-object', '-w', '--stdin'], 'synthetic artifact\n');
  const plans = posix.join(posix.dirname(posix.dirname(spec)), 'plans');
  const plan = posix.join(plans, posix.basename(spec));
  const ledger = plan.replace(/\.md$/, '-ledger.md');
  const unrelated = posix.join(plans, 'another-task-ledger.md');
  function snapshot(artifacts, parent) {
    git(['read-tree', '--empty']);
    for (const path of [spec, unrelated, ...artifacts]) git(['update-index', '--add', '--cacheinfo', `100644,${blob},${path}`]);
    const tree = git(['write-tree']);
    return git(['commit-tree', tree, ...(parent ? ['-p', parent] : [])], 'Synthetic tree fixture\n');
  }
  return { cwd, env, git, plan, ledger, snapshot };
}

test('merge preconditions bind the plan check and route present artifacts and lookup errors', () => {
  const prerequisites = loop.split('### Merge preconditions\n')[1].split('### Plan-free head\n')[0];
  assert.match(prerequisites, /paired task plan.*loop ledger.*### Plan-free head/);
  assert.match(check, /SCOPE_SOURCE.*from `scope\.source`/);
  assert.match(check, /SPEC_PATH.*from the carried `scope\.path`/);
  assert.match(check, /ASSESSED_SHA.*from the assessed `headRefOid`/);
  assert.match(check, /Exit 0 satisfies only this precondition/);
  assert.match(check, /nonzero exit.*withhold `merge`.*path.*lookup error/);
  assert.match(check, /every assessed-head change/);
  assert.match(check, /deletion.*diff.*not.*presence/);
  assert.match(loop, /\| Paired task artifact present at the assessed head \|.*blocker.*path/);
  assert.match(loop, /\| Assessed-head tree lookup failed \|.*stuck.*lookup error/);
  assert.match(recipe(), /git ls-tree --name-only "\$ASSESSED_SHA" -- "\$PLAN_PATH"/);
});

test('isolated head-tree recipe rejects present artifacts and accepts deletion-only heads', async t => {
  const command = recipe();
  for (const spec of ['doc/specs/task.md', 'docs/specs/task.md', 'services/widget/docs/specs/task [draft].md', 'specs/task.md']) {
    await t.test(spec, () => {
      const f = fixture(spec);
      const both = f.snapshot([f.plan, f.ledger]);
      const deleted = f.snapshot([], both);
      const unchanged = f.snapshot([f.plan, f.ledger], both);
      assert.equal(f.git(['diff-tree', '--no-commit-id', '--name-only', '-r', unchanged]), '');
      assert.deepEqual(f.git(['diff-tree', '--no-commit-id', '--name-only', '-r', deleted]).split('\n').sort(), [f.plan, f.ledger].sort());
      // Decoys disagree with the assessed tree: the recipe must not read the checkout or index.
      for (const path of [f.plan, f.ledger]) {
        mkdirSync(dirname(join(f.cwd, path)), { recursive: true });
        writeFileSync(join(f.cwd, path), 'untracked stale plan\n');
      }
      const cases = [
        { name: 'task plan only', head: f.snapshot([f.plan]), paths: [f.plan] },
        { name: 'ledger only', head: f.snapshot([f.ledger]), paths: [f.ledger] },
        { name: 'both artifacts', head: both, paths: [f.plan, f.ledger] },
        { name: 'unchanged base-tracked artifacts', head: unchanged, paths: [f.plan, f.ledger] },
        { name: 'head only deletes both artifacts', head: deleted, paths: [] },
        { name: 'unrelated plan only', head: f.snapshot([]), paths: [] },
      ];
      f.git(['read-tree', '--empty']);
      for (const { name, head, paths } of cases) {
        const result = run('bash', ['-c', command], { cwd: f.cwd, env: { ...f.env, ASSESSED_SHA: head } });
        assert.equal(result.status, paths.length ? 1 : 0, name);
        assert.equal(result.stderr, '', name);
        assert.deepEqual(result.stdout.trim().split('\n').filter(Boolean), paths.map(path => `${path} is a plan file finish removes before landing`), name);
      }
    });
  }
});

test('lookup failure remains a named withhold while a PR-only scope skips the lookup', () => {
  const command = recipe();
  const f = fixture('doc/specs/task.md');
  const missing = 'f'.repeat(40);
  const result = run('bash', ['-c', command], { cwd: f.cwd, env: { ...f.env, ASSESSED_SHA: missing } });
  assert.equal(result.status, 1);
  const lookup = run('git', ['ls-tree', '--name-only', missing, '--', f.plan], { cwd: f.cwd, env: f.env });
  assert.notEqual(lookup.status, 0);
  assert.match(lookup.stderr, /not a tree object/);
  assert.deepEqual(result.stdout.trimEnd().split('\n'), [f.plan, f.ledger].map(path => `Tree lookup failed for ${path}: ${lookup.stderr.trimEnd()}`));
  assert.equal(result.stderr, '');
  const skipped = run('bash', ['-c', command], { cwd: f.cwd, env: { ...f.env, SCOPE_SOURCE: 'pr', SPEC_PATH: '', ASSESSED_SHA: missing } });
  assert.equal(skipped.status, 0);
  assert.equal(skipped.stdout, '');
  assert.equal(skipped.stderr, '');
});
