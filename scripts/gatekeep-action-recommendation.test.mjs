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
const sample = 'pr-body-false-claim';

test('initial recommendation distinguishes a drafted repair from an author decision', () => {
  const menus = read('../skills/gatekeep-pr/reference/menus.md');
  assert.match(menus, /## Recommendation\n/);
  for (const pattern of [
    /every open blocker has a drafted repair/,
    /none needs the author's decision/,
    /head is pushable and `deliver` is offered, recommend `deliver` regardless of authorship/,
    /immediately above `Pick one:`.*recommendation.*reason.*finding or state/,
    /recommendation confers no authority/i,
  ]) assert.match(menus, pattern);
});

test('historical saved replies: description-only repair recommends deliver on another author\'s PR', () => {
  const caseText = read(`${root}/samples/${sample}/case.md`);
  assert.match(caseText, /is_author: false/);
  const expected = read(`${root}/samples/${sample}/expected.md`);
  const facts = parseExpected(expected).facts;
  assert.ok(facts.some(({ id }) => id === 'recommendation'));
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
    const initial = output.text.slice(output.text.indexOf('gauntlet: gate=gatekeep-pr/initial'));
    assert.match(initial, /^gauntlet: gate=gatekeep-pr\/initial recommended=1/);
    assert.match(initial, /^1\. deliver\b.*\[recommended\]/m);
  }
});
