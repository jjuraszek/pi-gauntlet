import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { sha256 } from '../eval/lib/checks.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const reconstruction = read('skills/gauntlet-resume/reference/reconstruction.md');
const pending = reconstruction.split('\n### Pending recovery\n')[1].split('\n### Returns conversion\n')[0];
const driver = read('skills/loop-implementation/SKILL.md');

test('home resume written rules preserve the original boundary and consumed counts', () => {
  for (const text of [
    'Select the decoder before any tracker call',
    'Reject duplicate or malformed values without writes',
    'preserving the consumed iteration and the before-image rather than bumping again',
    'For an on-disk `pending:` tuple, use the loop driver\'s return admission and interrupted recovery',
    'pre-dispatch ledger at the tuple SHA (home)',
    'With no `pending:`, read `returned:` from the committed home ledger',
    '`none` leaves nothing to recover',
    'Read the ledger at S as the before-image',
    "use that introducing commit's ledger `iterations:` as the consumed count, never the live ledger's",
    'Classify settled evidence before comparing the live ledger to the original dispatch count',
    "comparing each candidate's ledger to its first parent's",
    'Require matching target/home identity and count = before-image iterations +1',
    'stop on an unavailable before-image or malformed attribution',
    'Read no commit message',
    "apply the driver's Validate the return checks to the entire S..HEAD range",
    'allowing only the consumed iteration, tuple removal and `returned:` replacement as header deltas',
    'Admit a clean single return once with no second count or attempt increment',
    'A tuple introduced by a parent repair is settled when that ledger diff appends its matching repair decision',
    'Prove a later repair or approved ledger mutation from its ledger diff, not a subject',
    'require child ancestor of saved HEAD, saved HEAD ancestor of live HEAD, unchanged ledger since that saved HEAD',
    'matching canonical task names/statuses as defined in `brief-contract.md`',
    'With later commits or dirt and no settled evidence, ask before tracker calls',
    'List S..HEAD and every dirty path',
    '`interrupted` discards them through `reset --hard <S>` and `clean -fd`',
    'Keep bytes, counters and tasks unchanged until answered',
    'Confirmed settled preserves the current ledger and requires fresh gates',
    "confirmed interrupted runs the driver's interrupted recovery against S and its before-image without another bump",
    'unknown stops without mutation',
  ]) assert.ok(pending.includes(text), text);
  assert.doesNotMatch(pending, /format=%[sBb]|HEAD\^|--grep/);
  assert.match(reconstruction, /Validate the original one-commit .* range against its unchanged before-image/);
  assert.match(reconstruction, /migration changes neither admission ranges nor the home HEAD used for recovery/);
});

test('historical saved replies: home resume preserves completed isolated classifications', async t => {
  const dir = 'eval/gauntlet-resume';
  const sample = 'returned-line-recovery';
  const target = JSON.parse(read(`${dir}/target.json`));
  const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate-isolated.json`));
  const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline-isolated.json`));
  read(`${dir}/samples/${sample}/case.md`);
  read(`${dir}/samples/${sample}/expected.md`);
  read(`${dir}/replay.md`);
  assert.match(candidate.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
  assert.match(candidate.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
  assert.equal(candidate.kind, target.kind);
  assert.equal(candidate.assembly, target.assembly);
  assert.ok(candidate.models.replay.length > 0, 'must select saved decisions');
  for (const model of candidate.models.replay) {
    await t.test(model, () => {
      assert.equal(candidate.outputs[model]?.status, 'ok', model);
      assert.equal(baseline.outputs[model]?.status, 'ok', model);
      for (const [arm, record] of [['baseline', baseline], ['candidate', candidate]]) {
        const output = record.outputs[model];
        assert.ok(typeof output.text === 'string' && output.text.length > 0, `${arm}/${model}: nonempty reply text`);
      }
      const judgment = candidate.judge[model];
      for (const key of ['factsSha', 'judgePromptSha', 'intentSha']) {
        assert.match(judgment[key], /^[a-f0-9]{64}$/, `historical saved replies: recorded ${key}`);
      }
      assert.equal(judgment.baselineOutputSha, sha256(baseline.outputs[model].text));
      assert.equal(judgment.candidateOutputSha, sha256(candidate.outputs[model].text));
      assert.equal(judgment.facts.home?.after, 'holds');
      assert.ok(['improved', 'unchanged'].includes(judgment.verdict), model);
    });
  }
});

// Execute documented Git reads only. Admission, ambiguity and count-preserving
// writes remain instruction decisions, not a test-only recovery implementation.
test('resume Git reads retain S as the before-image across later commits and dirt', () => {
  const checkout = mkdtempSync(join(tmpdir(), 'loop-home-resume-'));
  const ledger = 'docs/ledger.md';
  const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
  const git = (...args) => execFileSync('timeout', ['-k', '30', '10', 'git', ...args], {
    cwd: checkout, env, encoding: 'utf8', timeout: 45_000, stdio: ['ignore', 'pipe', 'pipe'],
  }).trimEnd();
  git('init', '-q', '-b', 'fixture');
  mkdirSync(join(checkout, 'docs'));
  const saved = '# Ledger - loop engine\niterations: 2\nallowance: 4\nreturned: none\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n| 1 | open | 0 | |\n\n## Decisions\n';
  writeFileSync(join(checkout, ledger), saved);
  git('add', '--', ledger);
  git('commit', '-qm', 'Keep arbitrary fixture prose');
  const before = git('rev-parse', 'HEAD');
  const execute = (source, recipe, sha = 'HEAD') => {
    assert.ok(source.includes(`\`${recipe}\``), `production recipe exists: ${recipe}`);
    const command = recipe.replaceAll('"<worktree>"', JSON.stringify(checkout))
      .replaceAll('<worktree>', JSON.stringify(checkout))
      .replaceAll('<base>', before).replaceAll('HEAD_BEFORE', before)
      .replaceAll('<sha>', sha).replaceAll('<ledger path>', ledger);
    return execFileSync('timeout', ['-k', '30', '10', 'bash', '-c', command], {
      cwd: checkout, env, encoding: 'utf8', timeout: 45_000,
    }).trimEnd();
  };
  const snapshot = sha => execute(driver, 'git show <sha>:<ledger path>', sha);
  const discover = () => execute(pending, "git -C <worktree> log -G'^returned: ' --format=%H <base>..HEAD -- <ledger path>");
  const count = () => execute(driver, 'git -C "<worktree>" rev-list HEAD_BEFORE..HEAD --count');
  const dirt = () => execute(reconstruction, 'git -C <worktree> status --porcelain');

  writeFileSync(join(checkout, ledger), saved.replace('iterations: 2', 'iterations: 3')
    .replace('returned: none', `returned: none\npending: 1 | home | ${before}`));
  assert.equal(count(), '0');
  assert.equal(snapshot(before), saved.trimEnd(), 'on-disk pending never changes the committed before-image');
  assert.equal(dirt(), ' M docs/ledger.md');

  const returned = saved.replace('iterations: 2', 'iterations: 3')
    .replace('returned: none', `returned: 1 | home | ${before}`)
    .replace('| 1 | open | 0 | |', '| 1 | done | 1 | node --test test/plants.test.mjs; 1 passed |')
    + 'row 1 done | Count plants | Reuse the plants fixture\n';
  writeFileSync(join(checkout, ledger), returned);
  git('add', '--', ledger);
  git('commit', '-qm', 'A message with no recovery metadata');
  const child = git('rev-parse', 'HEAD');
  assert.equal(discover(), child);
  assert.equal(count(), '1');
  assert.equal(dirt(), '');
  assert.equal(snapshot('HEAD'), returned.trimEnd());
  assert.equal(snapshot(before), saved.trimEnd());

  writeFileSync(join(checkout, 'later.txt'), 'Later verification work\n');
  git('add', '--', 'later.txt');
  git('commit', '-qm', 'Unrelated prose after the home return');
  assert.equal(count(), '2', 'use the whole dispatch range, not HEAD^..HEAD');
  assert.equal(discover(), child, 'a code-only HEAD does not hide the ledger return');
  assert.equal(snapshot('HEAD^'), returned.trimEnd(), 'HEAD^ is not the pre-dispatch ledger');
  assert.equal(snapshot(before), saved.trimEnd());
  writeFileSync(join(checkout, 'later.txt'), 'Dirty later work\n');
  writeFileSync(join(checkout, 'untracked.txt'), 'Untracked later work\n');
  assert.equal(dirt(), ' M later.txt\n?? untracked.txt');
  assert.equal(discover(), child);
  assert.equal(snapshot(before), saved.trimEnd());
  assert.throws(() => git('show', `${'0'.repeat(40)}:${ledger}`), /fatal:/, 'missing before-image fails rather than implying admission');

  git('reset', '--hard', child);
  git('clean', '-fd');
  let amended = returned;
  const decisions = ['row 1 retry | Reset the window | Keep row history',
    `repair verification | home ${child} | iteration 5 - Fix the check`];
  for (const [index, decision] of decisions.entries()) {
    amended = amended.replace(/^iterations: \d+$/m, `iterations: ${index + 4}`) + decision + '\n';
    writeFileSync(join(checkout, ledger), amended);
    git('add', '--', ledger);
    git('commit', '-qm', 'Preserve the admitted return tuple');
    assert.equal(discover(), child, 'later ledger mutations do not introduce the unchanged tuple');
    assert.match(snapshot(child), /^iterations: 3$/m, 'consumed count belongs to the introducing commit');
    assert.match(snapshot('HEAD'), new RegExp(`^iterations: ${index + 4}$`, 'm'));
  }
});
