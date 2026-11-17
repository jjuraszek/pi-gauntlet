import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
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
  env: { ...env, ...variables }, encoding: 'utf8', timeout: 55_000, stdio: 'pipe',
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

function fixture() {
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
  return { scratch, primary, checkout, root };
}

test('teardown removes only the first gate run and the second still reads its saved progress', () => {
  const { primary, checkout, root } = fixture();
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

for (const reason of ['outside root', 'wrong basename', 'symlink', 'symlink ancestor', 'KEEP outside']) {
  test(`ownership failure moves and deletes nothing: ${reason}`, () => {
    const { primary, scratch, root } = fixture();
    const owned = mkdtempSync(join(root, 'gate.'));
    let runDir = owned;
    if (reason === 'outside root') runDir = mkdtempSync(join(scratch, 'gate.'));
    if (reason === 'wrong basename') runDir = mkdtempSync(join(root, 'other.'));
    if (reason === 'symlink') {
      runDir = join(root, 'gate.link');
      symlinkSync(owned, runDir);
    }
    if (reason === 'symlink ancestor') {
      const alias = join(root, 'gate.alias');
      symlinkSync(owned, alias);
      mkdirSync(join(owned, 'pr-37'));
      runDir = join(alias, 'pr-37');
    }
    const body = join(runDir, 'reply.body');
    const outside = join(scratch, 'outside.body');
    write(body, 'reply');
    write(outside, 'other run');
    const keep = reason === 'KEEP outside' ? [body, outside] : [body];
    assert.throws(() => teardown(primary, runDir, keep), error => {
      assert.notEqual(error.status, 0);
      assert.match(error.stderr.toString(), /expected|not an owned/);
      assert.equal(error.stdout.toString(), '', 'validate every path before moving any draft');
      return true;
    });
    assert.equal(readFileSync(body, 'utf8'), 'reply');
    assert.equal(readFileSync(outside, 'utf8'), 'other run');
    assert.ok(existsSync(owned));
  });
}

test('child retirement preserves its sibling and refuses the parent until every child leaves', () => {
  const { primary, root } = fixture();
  const parent = mkdtempSync(join(root, 'gate.'));
  const first = join(parent, 'pr-37');
  const second = join(parent, 'pr-38');
  write(join(first, 'state'), 'first');
  write(join(second, 'state'), 'second');
  write(join(parent, 'roster'), 'retained roster');
  teardown(primary, first);
  assert.equal(existsSync(first), false);
  assert.equal(readFileSync(join(second, 'state'), 'utf8'), 'second');
  assert.throws(() => teardown(primary, parent), /child run folder remains/);
  assert.equal(readFileSync(join(parent, 'roster'), 'utf8'), 'retained roster');
  teardown(primary, second);
  teardown(primary, parent);
  assert.equal(existsSync(parent), false);
});

test('selected teardown replay retains hash-verified passing facts', () => {
  const read = (path) => readFileSync(new URL(`../eval/gatekeep-pr/${path}`, import.meta.url), 'utf8');
  const expected = read('samples/teardown-own-run-folder/expected.md');
  const facts = parseExpected(expected).facts;
  assert.equal(facts.length, 5);
  const saved = JSON.parse(read('results/teardown-own-run-folder/candidate.json'));
  const baseline = JSON.parse(read('results/teardown-own-run-folder/baseline.json'));
  assert.equal(saved.models.replay.length, 2);
  for (const model of saved.models.replay) {
    assert.equal(saved.outputs[model].status, 'ok');
    const judge = saved.judge[model];
    assert.equal(judge.factsSha, sha256(expected));
    assert.equal(judge.candidateOutputSha, sha256(saved.outputs[model].text));
    assert.equal(judge.baselineOutputSha, sha256(baseline.outputs[model].text));
    for (const { id } of facts) assert.equal(judge.facts[id].after, 'holds', `${model}: ${id}`);
  }
});

test('teardown derives ownership from the primary after the PR worktree is removed', () => {
  const { primary, checkout, root } = fixture();
  const runDir = mkdtempSync(join(root, 'gate.'));
  write(join(runDir, 'state'), 'saved progress');
  git(primary, 'worktree', 'remove', checkout);
  assert.equal(existsSync(checkout), false);
  teardown(primary, runDir);
  assert.equal(existsSync(runDir), false);
});
