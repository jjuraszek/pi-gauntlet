import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';

const reference = readFileSync(new URL('../skills/gatekeep-pr/reference/post-selection-loop.md', import.meta.url), 'utf8');
const quote = value => `'${value.replaceAll("'", "'\\''")}'`;
const env = {
  ...process.env,
  GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
  GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
};
const run = (command, args, variables = {}) => execFileSync('timeout', ['-k', '30', '20', command, ...args], {
  env: { ...env, ...variables }, encoding: 'utf8', timeout: 55_000,
}).trimEnd();
const git = (root, ...args) => run('git', ['-C', root, ...args]);
const write = (path, contents) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
};

function teardown(primary, runDir, keep = []) {
  const block = reference.match(/<!-- gate-teardown-shell -->\s*```bash\n([\s\S]*?)\n\s*```/);
  assert.ok(block, 'gate teardown must ship the marked gate-teardown-shell block');
  return run('bash', ['-c', `KEEP=(${keep.map(quote).join(' ')})\n${block[1]}`], {
    PRIMARY: primary, RUN_DIR: runDir,
  });
}

test('teardown removes only the first gate run and the second still reads its saved progress', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'gate-teardown-'));
  const primary = join(scratch, "primary's checkout");
  mkdirSync(primary);
  git(primary, 'init', '-q', '-b', 'fixture');
  git(primary, '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', 'commit', '--allow-empty', '-qm', 'Start the teardown fixture');
  const checkout = join(scratch, 'linked checkout');
  git(primary, 'worktree', 'add', '-q', '--detach', checkout, 'HEAD');
  const common = git(checkout, 'rev-parse', '--path-format=absolute', '--git-common-dir');
  const root = join(common, 'gauntlet/tmp');
  mkdirSync(root, { recursive: true });
  const first = mkdtempSync(join(root, 'gate.'));
  const second = mkdtempSync(join(root, 'gate.'));
  const artifacts = [
    'state', 'state-spec.md', 'state-ledger.md',
    'verify.output', 'verify.log', 'review.output', 'review.log',
    'row.output', 'row.log', 'controller.py', 'worker.jobs',
    'description.body', 'landed-body', 'reply.body', 'coverage.body',
  ];
  for (const folder of [first, second]) {
    for (const name of artifacts) write(join(folder, name), `${folder}: ${name}\nsaved progress\n`);
  }
  const saved = new Map(artifacts.map(name => [name, readFileSync(join(second, name))]));
  const stateLocator = join(second, 'state');

  teardown(primary, first);

  assert.equal(existsSync(first), false, 'the handled exit must actually remove its own run');
  for (const [name, bytes] of saved) {
    assert.deepEqual(readFileSync(join(second, name)), bytes, `second run retains ${name}`);
  }
  assert.equal(readFileSync(stateLocator, 'utf8'), saved.get('state').toString(), 'the next step reads the same saved progress at its locator');
  assert.equal(git(primary, 'status', '--porcelain'), '');
  assert.equal(git(checkout, 'status', '--porcelain'), '');
});
