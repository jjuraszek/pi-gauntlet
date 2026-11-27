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
const sample = 'action-row-one';

test('obstacle recommendations rank unavailable progress above authorship and pending progress above stop', () => {
  const menus = read('../skills/gatekeep-pr/reference/menus.md');
  const recommendation = menus.split('## Recommendation\n')[1].split('\n## initial')[0];
  for (const pattern of [
    /no available non-stop row can change the outcome.*recommend `stop`/,
    /unchanged failed prerequisite/,
    /pending binding check.*flaky.*recommend `deliver`/,
    /including obstacle and cap exits/,
  ]) assert.match(recommendation, pattern);
  assert.ok(recommendation.indexOf('no available non-stop row') < recommendation.indexOf("human's own PR"));
  const obstacle = menus.split('## obstacle\n')[1].split('\n## contract exception')[0];
  assert.match(obstacle, /Choose the recommendation through `## Recommendation`/);
  assert.doesNotMatch(obstacle, /then `stop` `\[recommended\]`/);
});

test('contract proposals use the contract judgment instead of a fixed preserve recommendation', () => {
  const menus = read('../skills/gatekeep-pr/reference/menus.md');
  for (const [text, pin] of [
    [menus, 'contract-exception recommends `preserve contract`'],
    [menus, '`preserve contract` `[recommended]`'],
    [read('../README.md'), 'Contract proposals recommend preserve contract'],
    [read('../doc/gate-contract.md'), 'Contract proposals favor preserve contract'],
  ]) assert.ok(!text.includes(pin), `fixed recommendation: ${pin}`);
  assert.match(menus, /Contract judgment/);
  assert.match(read('../skills/gatekeep-pr/reference/findings.md'), /^## Contract judgment$/m);
});

test('historical saved replies: actions cover authorship, safe repairs, contract proposals and obstacle progress', () => {
  read(`${root}/samples/${sample}/case.md`);
  const expected = read(`${root}/samples/${sample}/expected.md`);
  const facts = parseExpected(expected).facts;
  assert.equal(facts.length, 8);
  for (const id of ['pending', 'blocked', 'cap', 'authority', 'own', 'body-only', 'author-only', 'contract']) {
    assert.ok(facts.some((fact) => fact.id === id), id);
  }
  const saved = JSON.parse(read(`${root}/results/${sample}/candidate.json`));
  read(`${root}/replay.md`);
  assert.match(saved.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
  assert.match(saved.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
  assert.ok(saved.models.replay.length > 0);
  for (const model of historicalModels(saved)) {
    const output = saved.outputs[model];
    const judge = saved.judge[model];
    assert.equal(output.status, 'ok', model);
    assert.doesNotMatch(output.text, /^(?:Delivers|Role|Prior review|Sync|Verdict|Evidence|Not offered):/m, model);
    assert.doesNotMatch(output.text, /\b(?:rounds_used|rounds_cap|syncs_used|syncs_cap)\b|\b(?:rounds?|syncs?|attempts?)\s+(?:used\s*[:=]?\s*)?\d+\s*(?:of|\/)\s*\d+/i, model);
    assert.doesNotMatch(output.text, /9c1e4f2|7001|merge_state_status|reviewDecision|binding check/, model);
    assert.match(judge.factsSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded facts hash');
    assert.equal(judge.candidateOutputSha, sha256(output.text), model);
    for (const { id } of facts) assert.equal(judge.facts[id]?.after, 'holds', `${model}: ${id}`);
    const menus = output.text.split(/gauntlet: gate=gatekeep-pr\/(?:obstacle|initial|contract-exception) recommended=1/).slice(1);
    assert.equal(menus.length, 7, model);
    for (const [index, action] of ['deliver', 'stop', 'stop', 'deliver', 'deliver', 'assess', 'preserve contract'].entries()) {
      assert.match(menus[index], new RegExp(`^1\\. ${action}\\b.*\\[recommended\\]`, 'm'), model);
    }
  }
});
