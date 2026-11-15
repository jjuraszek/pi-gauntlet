import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { sha256 } from '../eval/lib/checks.mjs';
import { cellReusable, judgmentCurrent } from '../eval/lib/records.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
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

const dir = 'eval/loop-implementer';
const sample = 'home-plain-commit';
const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline.json`));
const target = JSON.parse(read(`${dir}/target.json`));
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

// Reuse the paid wording decision; replay only its final publication boundary in Git.
// The imported-plant implementation, seed, driver admission and recovery are not run.
function ordinaryReturn(output) {
  const trace = output.split(/\n(?:---\n\n# Snapshot B:|## B\.)/)[0];
  const messages = [...trace.matchAll(/```text\n([\s\S]*?)\n\s*```/g)]
    .map((match) => match[1].split('\n').map((line) => line.trim()).join('\n'))
    .filter((value) => value.startsWith('Count imported plants'));
  assert.equal(messages.length, 1, 'one exact ordinary commit message');
  const returned = [...trace.matchAll(/returned: 1 \| home \| ([a-f0-9]{40})/g)];
  assert.equal(returned.length, 1, 'one resulting returned tuple');
  const decision = trace.match(/Final reply:\n(row 1 done \| [^\n]+)/)?.[1];
  assert.ok(decision, 'ordinary final decision');
  const add = trace.match(/timeout -k 30 \d+ git add (src\/page-count\.mjs test\/page-count\.test\.mjs docs\/ledger\.md)/)?.[1];
  assert.ok(add, 'explicit staging includes ledger');
  const commits = [...trace.matchAll(/timeout -k 30 \d+ git commit ([^`\n]+)/g)];
  assert.equal(commits.length, 1);
  const commit = commits[0][1];
  assert.match(commit, /^(?:-F \/tmp\/[^ ]+|-m "[^"]+" -m "[^"]+")$/);
  const commitArgs = commit.startsWith('-F ') ? null
    : [...commit.matchAll(/-m "([^"]+)"/g)].flatMap((match) => ['-m', match[1]]);
  assert.equal([...trace.matchAll(/timeout -k 30 \d+ git status --porcelain/g)].length, 1);
  assert.match(trace, /iterations: 4/);
  assert.match(trace, /(?:pending:` line is removed|no remaining `pending:` header)/);
  assert.equal(returned[0][0], 'returned: 1 | home | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
  return { message: messages[0], returned: returned[0][0], decision, paths: add.split(' '), commitArgs };
}

test('historical saved replies: home row publication commits isolated wording effects', async (t) => {
  assert.ok(candidate.models.replay.length > 0, 'must select saved replies');
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
      for (const fact of ['ordinary-message', 'clean-message', 'home-attribution', 'home-ledger', 'commit-boundary']) {
        assert.equal(judgment.facts[fact]?.after, 'holds', fact);
      }
      const result = ordinaryReturn(candidate.outputs[model].text);
      const scratch = mkdtempSync(join(tmpdir(), 'loop-home-publication-'));
      const checkout = join(scratch, 'checkout');
      mkdirSync(checkout);
      const git = (...args) => execFileSync('timeout', ['-k', '30', '10', 'git', ...args], {
        cwd: checkout, encoding: 'utf8', timeout: 45_000,
        env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
          GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
          GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' },
      }).trimEnd();
      const write = (path, value) => {
        mkdirSync(dirname(join(checkout, path)), { recursive: true });
        writeFileSync(join(checkout, path), value);
      };
      git('init', '-q', '-b', 'fixture');
      const header = '# Ledger - loop engine\niterations: 3\nallowance: 4\nreturned: none\n';
      write('docs/ledger.md', `${header}\n| row | status | attempts | evidence |\n|---|---|---|---|\n| 1 | open | 0 | |\n\n## Decisions\n`);
      git('add', '--', 'docs/ledger.md');
      git('commit', '-qm', 'Start publication fixture');
      const before = git('rev-parse', 'HEAD');
      const tuple = result.returned.replace('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', before);
      // Row results are fixed inputs, not a replay of implementation or ledger parsing.
      // Bind the synthetic SHA while keeping the saved message and decision verbatim.
      const row = '| 1 | done | 1 | timeout -k 30 120 node --test test/page-count.test.mjs; 3 passed; 0 failed |';
      const ledger = `${header.replace('iterations: 3', 'iterations: 4').replace('returned: none', tuple)}\n| row | status | attempts | evidence |\n|---|---|---|---|\n${row}\n\n## Decisions\n${result.decision}\n`;
      write('docs/ledger.md', ledger);
      for (const path of result.paths.filter((path) => path !== 'docs/ledger.md')) {
        write(path, '// Completed row work supplied at the publication boundary.\n');
      }
      git('add', '--', ...result.paths);
      const messagePath = join(scratch, 'message.txt');
      writeFileSync(messagePath, `${result.message}\n`);
      git('commit', ...(result.commitArgs ?? ['-F', messagePath]));
      assert.equal(git('rev-list', '--count', `${before}..HEAD`), '1');
      assert.equal(git('status', '--porcelain'), '');
      const message = git('show', '-s', '--format=%B', 'HEAD');
      assert.equal(message, 'Count imported plants in compliance pagination\n\nRefs #81');
      assert.doesNotMatch(message, /^(?:pending:|iteration:|returned:|row \d+|\|)/m);
      assert.equal(git('show', 'HEAD:docs/ledger.md'), ledger.trimEnd());
      assert.equal([...ledger.matchAll(/^returned: /gm)].length, 1);
      assert.ok(ledger.includes(`returned: 1 | home | ${before}\n`));
      assert.doesNotMatch(ledger, /^pending:/m);
      assert.deepEqual(git('ls-tree', '-r', '--name-only', 'HEAD').split('\n'), [...result.paths].sort());
    });
  }
});
