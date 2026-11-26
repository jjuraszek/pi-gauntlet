import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
function historicalModels(record) {
  const models = [];
  for (const model of record.models.replay) {
    const output = record.outputs[model];
    const context = `${record.sample}/${model}`;
    if (output?.status === 'error') {
      assert.equal(output.status, 'error', `${context}: errored replay excluded from evidence`);
      assert.ok(typeof output.error === 'string' && output.error.trim().length > 0, `${context}: errored replay excluded from evidence needs an error string`);
      console.log(`${context}: errored replay excluded from evidence`);
      continue;
    }
    assert.equal(output?.status, 'ok', context);
    assert.ok(typeof output.text === 'string' && output.text.trim().length > 0, `${context}: nonempty reply text`);
    assert.equal(record.judge?.[model]?.candidateOutputSha, sha256(output.text), `${context}: recorded output hash`);
    models.push(model);
  }
  assert.ok(models.length > 0, `${record.sample}: at least one hash-verified ok reply`);
  return models;
}

const root = '../eval/gatekeep-pr';
const sample = 'post-step-pr-named';

test('PR-named actions resolve only through unique merge-base commands', () => {
  const findings = read('../skills/gatekeep-pr/reference/findings.md');
  const steps = findings.split('## PR-named steps\n')[1]?.split('\n## ')[0];
  assert.ok(steps, 'step 5 owns after-merge action discovery and command resolution');
  for (const rule of [
    /PR body.*spec at the assessed head/,
    /Exclude observation-only acceptance or verification clauses and automatic deploy or release notes from post steps\./,
    /merge-base.*overrides file.*AGENTS\.md/,
    /one hop/,
    /same sentence, list item or table row/,
    /distinct command strings/,
    /Exactly one.*runnable/,
    /PR text.*never supplies.*command/,
    /No command.*two or more.*unfilled token.*open/,
    /every source sentence/,
    /cleanup.*item.*one row.*list order/,
    /post menu.*closing message.*source sentence/,
    /cleanup\.md.*dispatcher/,
  ]) assert.match(steps, rule);
  const post = read('../skills/gatekeep-pr/reference/menus.md').split('## post\n')[1].split('\n## ')[0];
  assert.match(post, /findings\.md.*## PR-named steps/);
  assert.match(post, /always include runnable PR-named steps/);
  assert.match(post, /show its source sentence beside its command/);
});

test('historical saved replies: PR-named steps offer trusted steps and preserve unresolved sources', () => {
  read(`${root}/samples/${sample}/case.md`);
  const expected = read(`${root}/samples/${sample}/expected.md`);
  const facts = parseExpected(expected).facts;
  const saved = JSON.parse(read(`${root}/results/${sample}/candidate.json`));
  read(`${root}/replay.md`);
  assert.match(saved.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
  assert.match(saved.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
  assert.ok(saved.models.replay.length > 0);
  for (const model of historicalModels(saved)) {
    const output = saved.outputs[model];
    const judge = saved.judge[model];
    assert.equal(output.status, 'ok', model);
    assert.match(judge.factsSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded facts hash');
    assert.equal(judge.candidateOutputSha, sha256(output.text), model);
    for (const { id } of facts) assert.equal(judge.facts[id]?.after, 'holds', `${model}: ${id}`);
    assert.equal((output.text.match(/gauntlet: gate=gatekeep-pr\/own-merge/g) ?? []).length, 1, model);
    assert.match(output.text, /gauntlet: done merged/, model);
  }
});
