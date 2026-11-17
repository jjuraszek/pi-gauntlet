import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { sha256 } from '../eval/lib/checks.mjs';
import { cellReusable, judgmentCurrent } from '../eval/lib/records.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function historicalModels(candidate, baseline) {
  const models = [];
  for (const model of candidate.models.replay) {
    let usable = true;
    for (const record of [candidate, baseline]) {
      const output = record.outputs[model];
      const context = `${record.sample}/${record.arm}/${model}`;
      if (output?.status === 'error') {
        assert.equal(output.status, 'error', `${context}: errored replay excluded from evidence`);
        assert.ok(typeof output.error === 'string' && output.error.trim().length > 0, `${context}: errored replay excluded from evidence needs an error string`);
        console.log(`${context}: errored replay excluded from evidence`);
        usable = false;
        continue;
      }
      assert.equal(output?.status, 'ok', context);
      assert.ok(typeof output.text === 'string' && output.text.trim().length > 0, `${context}: nonempty reply text`);
      const hash = candidate.judge?.[model]?.[`${record.arm}OutputSha`];
      if (hash === undefined && candidate.outputs[model]?.status === 'error') { usable = false; continue; }
      assert.equal(hash, sha256(output.text), `${context}: recorded output hash`);
    }
    if (usable) models.push(model);
  }
  assert.ok(models.length > 0, `${candidate.sample}: at least one hash-verified ok reply pair`);
  return models;
}

const driver = read('skills/loop-implementation/SKILL.md');
const holds = read('skills/loop-implementation/reference/driver-holds.md');
const recovery = read('skills/loop-implementation/reference/interrupted-recovery.md');
const validation = driver.split('\n## Validate the return\n')[1].split('\n## Unreachable returns\n')[0];

test('home admission written contract limits attribution and all header deltas', () => {
  const boundary = validation.split('\n2. ')[0];
  assert.match(boundary, /Require a DONE return, empty .*status --porcelain.*exactly 1.*rev-list HEAD_BEFORE\.\.HEAD --count/);
  assert.match(boundary, /ledger at HEAD.*dispatched tuple.*`returned:`.*retained `pending:`.*`iterations:` equal to saved \+1/);
  assert.match(boundary, /tuple on neither line is wrong attribution; a retained tuple remains a result-validation miss/);
  assert.match(boundary, /wrong-attribution returns through ## Interrupted recovery, not result admission/);
  assert.match(boundary, /Read result rows and decisions from the ledger at HEAD only after this boundary passes/);
  assert.match(validation, /Admit exactly three header changes: `iterations` \+1, removal of the dispatched `pending:` line and replacement of `returned:` with the dispatched tuple's value; reject every other header change, including allowance/);
  assert.match(validation, /Keep every other row, header and prior decision unchanged apart from the dispatch header changes in step 2/);
  assert.match(validation, /attempts \+1, nonempty bounded evidence/);
  assert.match(validation, /set equality between changed rows and rows with exactly one new decision line, target first/);
  assert.match(validation, /inspect no commit message/);
  assert.doesNotMatch(holds, /format=%[sbB]|--grep/);
  assert.doesNotMatch(boundary, /format=%[sbB]|commit body's first two lines/);

  for (const [start, end, attribution] of [
    ['On a seed miss', 'Count seed attempts', /retain the dispatched tuple in `returned:`, setting it when the child retained pending/],
    ['On an ordinary miss', '\n## Unreachable', /keep or set `returned:` to the dispatched tuple/],
  ]) {
    const repair = validation.split(start)[1].split(end)[0];
    assert.match(repair, /headers \(including the saved allowance\)/);
    assert.match(repair, /retain(?:ing)? the incremented iterations/);
    assert.match(repair, /Clear `pending:`/);
    assert.match(repair, attribution);
  }
  assert.match(recovery, /`iterations:` = saved \+1, its saved `returned:` value and no `pending:`/);
  assert.match(recovery, /set only that row `failed`, attempts = saved attempts \+1/);
  assert.match(recovery, /preserve every other row and all prior decisions/);
  assert.ok(recovery.includes('repair row <n> | interrupted - <reason> | iteration <consumed>'));
  assert.match(recovery, /Never append a fabricated child decision/);
  for (const token of [
    'Recover without a human turn with or without amend permission.', 'Recovery itself is unconditional',
    'matching start identity and command', 'PGID equal to the pid', 'wait at most 10 s',
    'recheck identity, command and group leader before each signal',
    'skip that job and continue recovery', 'absent or empty jobs file means no jobs to terminate',
    'Print `terminated <k> child jobs`', 'delete the jobs file',
    'refresh and return to the ordered table in the same turn',
  ]) assert.ok(recovery.includes(token), token);
  assert.match(recovery.split('3. Write')[1], /`wrong attribution`.*as the concrete reason/);
  assert.match(recovery, /still alive after KILL.*do not block recovery/);
  assert.match(recovery, /files remain after reset.*next return is validated as usual/);
  assert.ok(recovery.indexOf('1. ') < recovery.indexOf('reset --hard HEAD_BEFORE'));
  assert.ok(recovery.indexOf('reset --hard HEAD_BEFORE') < recovery.indexOf('3. Write'));
  assert.match(validation, /Never project terminal child results before clean\/exactly-one-commit admission/);
  assert.match(validation, /Seed or ordinary.*committed tuple.*validation miss for the dispatched target after boundary admission, not a boundary rejection/);
});

test('historical saved replies: home admission decisions, not a driver implementation', async t => {
  const dir = 'eval/loop-implementation';
  const sample = 'returned-line-admission';
  const target = JSON.parse(read(`${dir}/target.json`));
  const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
  const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline.json`));
  read(`${dir}/samples/${sample}/case.md`);
  read(`${dir}/samples/${sample}/expected.md`);
  read(`${dir}/replay.md`);
  assert.match(candidate.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
  assert.match(candidate.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
  const identity = {
    skillSha: candidate.skillSha,
    inputSha: candidate.inputSha,
    kind: target.kind, assembly: target.assembly, thinking: candidate.models.thinking,
  };
  assert.ok(candidate.models.replay.length > 0, 'must select saved decisions');
  for (const model of historicalModels(candidate, baseline)) {
    await t.test(model, () => {
      assert.ok(cellReusable(candidate, model, identity), 'historical saved replies: reply matches recorded identity');
      const judgment = candidate.judge[model];
      for (const key of ['factsSha', 'judgePromptSha', 'intentSha']) {
        assert.match(judgment[key], /^[a-f0-9]{64}$/, `historical saved replies: recorded ${key}`);
      }
      assert.ok(judgmentCurrent(judgment, {
        factsSha: judgment.factsSha,
        judgePromptSha: judgment.judgePromptSha,
        intentSha: judgment.intentSha,
        baselineOutputSha: sha256(baseline.outputs[model].text),
        candidateOutputSha: sha256(candidate.outputs[model].text),
      }), 'historical saved replies: judgment matches recorded outputs');
      for (const fact of ['ledger-admission', 'wrong-attribution', 'retained-pending', 'counts', 'no-subject-read']) {
        assert.equal(judgment.facts[fact]?.after, 'holds', fact);
      }
      const output = candidate.outputs[model].text;
      // A case heading is `## B` plus any punctuation the reply chose; the values below are what is pinned.
      const section = (from, to) => output.split(new RegExp(`^## ${from}\\b[^\\n]*$`, 'm'))[1].split(new RegExp(`^## ${to}\\b[^\\n]*$`, 'm'))[0];
      const interrupted = section('B', 'C');
      // The recovery rule fixes the row's four cells, not their rendering: a table row or a `row 1:` bullet.
      assert.match(interrupted, /(?:\|\s*|\brow\s+)`?1`?\s*[|:]\s*`?failed`?\s*\|\s*`?1`?\s*\|\s*`?iteration 2: interrupted - wrong attribution`?\s*(?:\||$)/m);
      assert.ok(interrupted.includes('repair row 1 | interrupted - wrong attribution | iteration 3'));
      assert.ok(interrupted.includes('returned: none'));
      const ordinary = section('C', 'D');
      assert.ok(ordinary.includes('returned: 1 | home | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'));
      assert.match(ordinary, /repair row 1 \| [^\n]+ \| iteration 3/);
    });
  }
});

// These execute only the skill's Git reads and reset recipe. Admission and the
// repaired ledger mutation remain model decisions checked above, not JS logic.
test('home Git recipes expose each attribution fixture and restore the before-image', () => {
  const checkout = mkdtempSync(join(tmpdir(), 'loop-home-admission-'));
  const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
  const git = (...args) => execFileSync('timeout', ['-k', '30', '10', 'git', ...args], {
    cwd: checkout, env, encoding: 'utf8', timeout: 45_000,
  }).trimEnd();
  git('init', '-q', '-b', 'fixture');
  mkdirSync(join(checkout, 'docs'));
  const saved = '# Ledger - loop engine\niterations: 2\nallowance: 4\nreturned: none\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n| 1 | open | 0 | |\n| 2 | open | 0 | |\n\n## Decisions\nrow 0 done | seeded 1 rows, closed 0 on baseline | row 1\n';
  writeFileSync(join(checkout, 'docs/ledger.md'), saved);
  git('add', '--', 'docs/ledger.md');
  git('commit', '-qm', 'Start the admission fixture');
  const before = git('rev-parse', 'HEAD');
  const execute = (source, recipe) => {
    assert.ok(source.includes(`\`${recipe}\``), `production recipe exists: ${recipe}`);
    const command = recipe.replace('"<worktree>"', JSON.stringify(checkout))
      .replaceAll('HEAD_BEFORE', before).replace('<sha>', 'HEAD').replace('<ledger path>', 'docs/ledger.md');
    return execFileSync('timeout', ['-k', '30', '10', 'bash', '-c', command], {
      cwd: checkout, env, encoding: 'utf8', timeout: 45_000,
    }).trimEnd();
  };
  for (const [name, attribution] of [
    ['valid returned', `returned: 1 | home | ${before}`],
    ['wrong returned', `returned: 1 | home | ${'c'.repeat(40)}`],
    ['retained pending', `returned: none\npending: 1 | home | ${before}`],
  ]) {
    const committed = saved.replace('iterations: 2', 'iterations: 3').replace('returned: none', attribution)
      .replace('| 1 | open | 0 | |', '| 1 | done | 1 | node --test test/totals.test.mjs; 4 passed |')
      + 'row 1 done | Count imported plants | Reuse the totals fixture\n';
    writeFileSync(join(checkout, 'docs/ledger.md'), committed);
    writeFileSync(join(checkout, 'worker.txt'), 'Supplied completed work\n');
    git('add', '--', 'docs/ledger.md', 'worker.txt');
    git('commit', '-qm', 'An arbitrary message unrelated to attribution');
    assert.equal(execute(driver, 'git -C "<worktree>" status --porcelain'), '', name);
    assert.equal(execute(driver, 'git -C "<worktree>" rev-list HEAD_BEFORE..HEAD --count'), '1', name);
    assert.equal(execute(holds, 'git show <sha>:<ledger path>'), committed.trimEnd(), name);
    execute(recovery, 'git -C "<worktree>" reset --hard HEAD_BEFORE');
    execute(recovery, 'git -C "<worktree>" clean -fd');
    assert.equal(git('rev-parse', 'HEAD'), before, name);
    assert.equal(readFileSync(join(checkout, 'docs/ledger.md'), 'utf8'), saved, name);
    assert.equal(git('status', '--porcelain'), '', name);
  }
});
