import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const driver = readFileSync(new URL('../skills/gauntlet/implement/loop/loop.md', import.meta.url), 'utf8');
const stagnation = readFileSync(new URL('../skills/gauntlet/implement/loop/empty-child-stagnation.md', import.meta.url), 'utf8');
const holds = readFileSync(new URL('../skills/gauntlet/implement/loop/driver-holds.md', import.meta.url), 'utf8');
const dispatch = driver.split('\n## Before each dispatch\n')[1].split('\n## Dispatch\n')[0] + '\n' + stagnation;
const ledgerPath = 'docs/ledger.md';
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
  GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
const run = (cwd, command, args) => execFileSync('timeout', ['-k', '30', '10', command, ...args], {
  cwd, env, encoding: 'utf8', stdio: 'pipe', timeout: 45_000,
}).trimEnd();

function fixture() {
  const path = mkdtempSync(join(tmpdir(), 'loop-worker-history-'));
  const git = (...args) => run(path, 'git', args);
  git('init', '-q', '-b', 'fixture');
  mkdirSync(join(path, 'docs'));
  const commit = files => {
    for (const [name, content] of Object.entries(files)) writeFileSync(join(path, name), content);
    git('add', '--', ...Object.keys(files));
    // Every commit has the same subject and no body; messages cannot identify workers.
    git('commit', '-qm', 'Keep the fixture state');
    return git('rev-parse', 'HEAD');
  };
  return { path, git, commit };
}

function ledger({ returned = 'none', attempts = 1, status = 'failed', decision = '' } = {}) {
  return `# Ledger - loop engine\niterations: ${attempts}\nallowance: 8\nreturned: ${returned}\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n| 1 | ${status} | ${attempts} | node --test test/example.test.mjs; recorded result |\n\n## Decisions\nrow 0 done | seeded 1 rows, closed 0 on baseline | row 1\n${decision}`;
}

// Execute the shipped recipes, not a JavaScript reimplementation of stagnation.
// The instructions own selection and hint rendering; assertions below pin their rule.
function recipe(checkout, text, values) {
  assert.ok((driver + '\n' + stagnation + '\n' + holds).includes(`\`${text}\``), `missing production recipe: ${text}`);
  let command = text;
  for (const [token, value] of Object.entries(values)) command = command.replaceAll(token, value);
  assert.doesNotMatch(command, /<[^>]+>/, 'substitute every recipe input');
  return run(checkout.path, 'bash', ['-c', command]);
}
const candidates = (home, base) => recipe(home,
  "git log -G'^returned: ' --format=%H <base>..HEAD -- <ledger path>",
  { '<base>': base, '<ledger path>': ledgerPath }).split('\n');
const snapshot = (home, sha) => recipe(home, 'git show <sha>:<ledger path>',
  { '<sha>': sha, '<ledger path>': ledgerPath });
const descendants = (owner, before) => recipe(owner,
  'git -C <owning checkout> rev-list --reverse --ancestry-path <S>..HEAD',
  { '<owning checkout>': JSON.stringify(owner.path), '<S>': before }).split('\n');
const paths = (owner, sha) => recipe(owner,
  'git -C <owning checkout> show --format= --name-only <worker sha>',
  { '<owning checkout>': JSON.stringify(owner.path), '<worker sha>': sha }).split('\n');

test('written stuck-row rule selects tuple changes, excludes parent decisions and requires two unchanged workers', () => {
  for (const sentence of [
    "compare each ledger's `returned:` value to its first parent's; keep only changes to a non-`none` tuple",
    'find the first commit from',
    'Use the companion checkout for companion objects',
    'Read home row status before/after from the ledger at S and worker SHA for home, or the listing commit\'s first parent and listing commit for companions',
    'Set the hint only when the last two workers for that row each changed no file outside the ledger and no row status',
    'Exclude seed and parent commits; a decision alone is not progress',
    'A later repair cannot move an older worker into a new window',
    'the last two attempts changed nothing outside the ledger',
    'a different selected target carries none',
  ]) assert.ok(dispatch.includes(sentence), sentence);
  assert.doesNotMatch(holds, /format=%[sbB]|--grep/);
  assert.doesNotMatch(dispatch, /format=%[sbB]|--grep/);
});

for (const [name, changedFiles, secondStatus] of [
  ['two ledger-only workers', {}, 'failed'],
  ['a worker changes code', { 'worker.txt': 'observable work\n' }, 'failed'],
  ['a worker changes row status', {}, 'done'],
]) {
  test(`home history recipes expose ${name}, not decision-only parent commits`, () => {
    const home = fixture();
    const initial = ledger();
    const base = home.commit({ [ledgerPath]: initial });
    const firstLedger = ledger({ returned: `1 | home | ${base}`, attempts: 2 });
    const first = home.commit({ [ledgerPath]: firstLedger });
    const beforeSecond = home.commit({ [ledgerPath]: firstLedger + 'rows +1 | Keep working\n' });
    const secondLedger = ledger({ returned: `1 | home | ${beforeSecond}`, attempts: 3, status: secondStatus });
    const second = home.commit({ [ledgerPath]: secondLedger, ...changedFiles });
    const parent = home.commit({ [ledgerPath]: secondLedger + 'row 1 escalated | implModel round | allowed attempts 9\n' });

    assert.deepEqual(candidates(home, base), [second, first]);
    assert.equal(snapshot(home, parent), snapshot(home, second) + '\nrow 1 escalated | implModel round | allowed attempts 9');
    for (const [listing, before, expected, files, status] of [
      [second, beforeSecond, secondLedger, [ledgerPath, ...Object.keys(changedFiles)], secondStatus],
      [first, base, firstLedger, [ledgerPath], 'failed'],
    ]) {
      assert.equal(snapshot(home, listing), expected.trimEnd());
      assert.ok(snapshot(home, `${listing}^`).includes('| 1 | failed |'));
      assert.ok(snapshot(home, listing).includes(`| 1 | ${status} |`));
      assert.notEqual(snapshot(home, listing).match(/^returned: .+$/m)[0],
        snapshot(home, `${listing}^`).match(/^returned: .+$/m)[0]);
      assert.equal(descendants(home, before)[0], listing);
      assert.deepEqual(paths(home, listing), files);
    }
    assert.equal(home.git('status', '--porcelain'), '');
  });
}

test('a repair listing recovers the original worker, not the parent that records its tuple', () => {
  const home = fixture();
  const base = home.commit({ [ledgerPath]: ledger() });
  const pendingLedger = ledger({ attempts: 2 }).replace('returned: none', `returned: none\npending: 1 | home | ${base}`);
  const worker = home.commit({ [ledgerPath]: pendingLedger, 'worker.txt': 'work retained during result repair\n' });
  const recorded = ledger({ returned: `1 | home | ${base}`, attempts: 2,
    decision: 'repair row 1 | retained pending tuple | iteration 2\n' });
  const repair = home.commit({ [ledgerPath]: recorded });
  home.commit({ [ledgerPath]: recorded + 'rows +1 | Continue\n' });

  assert.deepEqual(candidates(home, base), [repair]);
  assert.match(snapshot(home, `${repair}^`), /^returned: none$/m);
  assert.ok(snapshot(home, repair).includes(`returned: 1 | home | ${base}`));
  assert.equal(descendants(home, base)[0], worker);
  assert.deepEqual(paths(home, worker), [ledgerPath, 'worker.txt']);
  assert.deepEqual(paths(home, repair), [ledgerPath]);
  assert.equal(home.git('status', '--porcelain'), '');
});

test('companion listings locate workers in their owning checkout and statuses in home snapshots', () => {
  const home = fixture();
  const companion = fixture();
  const base = home.commit({ [ledgerPath]: ledger() });
  const before = companion.commit({ 'worker.txt': 'before\n' });
  const worker = companion.commit({ 'worker.txt': 'after\n' });
  const recorded = ledger({ returned: `1 | companion | ${before}`, attempts: 2 });
  const listing = home.commit({ [ledgerPath]: recorded });
  home.commit({ [ledgerPath]: recorded + 'rows +1 | Continue\n' });

  assert.deepEqual(candidates(home, base), [listing]);
  assert.ok(snapshot(home, listing).includes(`returned: 1 | companion | ${before}`));
  assert.ok(snapshot(home, `${listing}^`).includes('| 1 | failed | 1 |'));
  assert.ok(snapshot(home, listing).includes('| 1 | failed | 2 |'));
  assert.equal(descendants(companion, before)[0], worker);
  assert.deepEqual(paths(companion, worker), ['worker.txt']);
  assert.throws(() => descendants(home, before), /Invalid revision range/);
  assert.equal(home.git('status', '--porcelain'), '');
  assert.equal(companion.git('status', '--porcelain'), '');
});
