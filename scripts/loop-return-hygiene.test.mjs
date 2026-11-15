import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative } from 'node:path';
import test from 'node:test';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const transport = read('skills/loop-implementation/reference/return-file.md');
const recipe = marker => {
  const match = transport.match(new RegExp(`<!-- ${marker} -->\\s*\x60\x60\x60bash\\n([\\s\\S]*?)\\n\x60\x60\x60`));
  assert.ok(match, `production recipe: ${marker}`);
  return match[1];
};
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
  GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
const run = (command, args, variables = {}) => execFileSync('timeout', ['-k', '30', '20', command, ...args], {
  env: { ...env, ...variables }, encoding: 'utf8', timeout: 55_000,
}).trimEnd();
const git = (root, ...args) => run('git', ['-C', root, ...args]);
const write = (path, value) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
};
const assertPrivate = (common, path) => {
  const local = relative(realpathSync(common), realpathSync(path));
  assert.ok(local && local !== '..' && !local.startsWith('../') && !isAbsolute(local), 'return must be inside the Git common directory');
};

// Exercise only filesystem publication/deletion with supplied results, not dispatch,
// implementation, admission accounting, finish, or a multi-stage workflow.
const cases = [
  { name: 'loop home', leg: 'home', home: true },
  { name: 'loop companion', leg: 'companion' },
  { name: 'gatekeep fix', leg: 'gatekeep' },
  { name: 'hotfix seed', leg: 'hotfix', seed: true },
  { name: 'hotfix row', leg: 'hotfix' },
];
for (const value of cases) for (const linked of [false, true]) {
  test(`${value.name}: ${linked ? 'linked' : 'primary'} publication adds no tracked return artifact and stays clean`, () => {
    const scratch = mkdtempSync(join(tmpdir(), 'loop-return-hygiene-'));
    const primary = join(scratch, 'primary');
    mkdirSync(primary);
    git(primary, 'init', '-q', '-b', 'fixture');
    write(join(primary, 'work.txt'), 'Before the supplied result\n');
    git(primary, 'add', '--', 'work.txt');
    git(primary, 'commit', '-qm', 'Start the hygiene fixture');
    const before = git(primary, 'rev-parse', 'HEAD');
    const checkout = linked ? join(scratch, 'worker') : primary;
    if (linked) git(primary, 'worktree', 'add', '-q', '--detach', checkout, before);
    const common = git(checkout, 'rev-parse', '--path-format=absolute', '--git-common-dir');
    const variables = { CHECKOUT: checkout, HEAD_BEFORE: before, ITERATION: '6' };
    const ledgerPath = value.home ? join(checkout, 'doc/plans/fixture-ledger.md') : join(scratch, 'parent/ledger.md');
    const tuple = `${value.seed ? 'seed' : '1'} | ${value.leg} | ${before}`;
    const evidence = 'timeout -k 30 10 test -f work.txt; fixture assertion';
    const row = `| 1 | ${value.seed ? 'open | 0' : 'done | 1'} | ${evidence} |`;
    const decision = value.seed ? 'row 0 done | seeded 1 rows, closed 0 on baseline | row 1'
      : 'row 1 done | Publish the supplied result. | Reuse work.txt.';
    const ledger = `# Ledger - loop engine\niterations: 6\nallowance: 4\n${value.home ? 'returned' : 'pending'}: ${tuple}\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n${row}\n\n## Decisions\n${decision}\n`;
    write(ledgerPath, ledger);
    let returnPath;
    let returnBytes;
    if (!value.home) {
      returnPath = run('bash', ['-c', `${recipe('return-path-shell')}\n${recipe('return-prepare-shell')}\nprintf '%s\\n' "$RETURN_FILE"`], variables);
      returnBytes = `pending: ${tuple}\niteration: 6\n\n${row}\n\n${decision}\n`;
      write(returnPath, returnBytes);
      assertPrivate(common, returnPath);
      assert.equal(git(checkout, 'status', '--porcelain'), '', 'publishing the return does not dirty the checkout');
    }
    if (!value.seed) write(join(checkout, 'work.txt'), 'Supplied completed result\n');
    // Broad staging here is an adversarial fixture: no exclude rule may hide a sidecar.
    git(checkout, 'add', '--all');
    git(checkout, 'commit', '--allow-empty', '-qm', 'Publish the supplied result');
    const paths = value.home ? ['doc/plans/fixture-ledger.md', 'work.txt'] : ['work.txt'];
    assert.deepEqual(git(checkout, 'ls-tree', '-r', '--name-only', 'HEAD').split('\n'), paths);
    assert.equal(git(checkout, 'diff', '--diff-filter=A', '--name-only', before, 'HEAD'), value.home ? 'doc/plans/fixture-ledger.md' : '');
    assert.equal(git(checkout, 'rev-list', '--count', `${before}..HEAD`), '1');
    assert.equal(git(checkout, 'status', '--porcelain'), '');
    if (returnPath) {
      assert.equal(readFileSync(returnPath, 'utf8'), returnBytes, 'private result survives the worker commit');
      run('bash', ['-c', recipe('return-delete-shell')], { ...variables, RETURN_FILE: returnPath });
      assert.equal(existsSync(returnPath), false, 'admission-boundary deletion leaves no return file');
    } else {
      assert.equal(existsSync(join(common, 'gauntlet/returns')), false, 'home uses only its plan-dir ledger');
    }
    assert.equal(readFileSync(ledgerPath, 'utf8'), ledger, 'transport does not mutate the ledger');
    for (const root of new Set([primary, checkout])) assert.equal(git(root, 'status', '--porcelain'), '', root);
    if (linked) assert.equal(git(primary, 'rev-parse', 'HEAD'), before, 'worker leaves the primary unchanged');
  });
}

test('metadata containment rejects a checkout sidecar even when Git ignores it', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'loop-return-containment-'));
  git(scratch, 'init', '-q', '-b', 'fixture');
  const common = git(scratch, 'rev-parse', '--path-format=absolute', '--git-common-dir');
  write(join(common, 'info/exclude'), 'returns/\n');
  const sidecar = join(scratch, 'returns/result.md');
  write(sidecar, 'A misplaced result\n');
  assert.equal(git(scratch, 'status', '--porcelain'), '', 'clean status alone cannot prove containment');
  assert.throws(() => assertPrivate(common, sidecar), /return must be inside the Git common directory/);
});
