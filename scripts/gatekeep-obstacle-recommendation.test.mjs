import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { inputSha, parseCase } from '../eval/lib/replay.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
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

test('saved obstacle replay distinguishes pending progress, ruleset block and unchanged cap prerequisite', () => {
  const caseText = read(`${root}/samples/${sample}/case.md`);
  const parsed = parseCase(caseText);
  const expected = read(`${root}/samples/${sample}/expected.md`);
  const facts = parseExpected(expected).facts;
  for (const id of ['pending', 'blocked', 'cap', 'authority']) {
    assert.ok(facts.some((fact) => fact.id === id), id);
  }
  const saved = JSON.parse(read(`${root}/results/${sample}/candidate.json`));
  assert.equal(saved.inputSha, inputSha(read(`${root}/replay.md`), parsed.text, parsed.bundle));
  assert.ok(saved.models.replay.length > 0);
  for (const model of saved.models.replay) {
    const output = saved.outputs[model];
    const judge = saved.judge[model];
    assert.equal(output.status, 'ok', model);
    assert.doesNotMatch(output.text, /^(?:Delivers|Role|Prior review|Sync|Verdict|Evidence|Not offered):/m, model);
    assert.doesNotMatch(output.text, /\b(?:rounds_used|rounds_cap|syncs_used|syncs_cap)\b|\b(?:rounds?|syncs?|attempts?)\s+(?:used\s*[:=]?\s*)?\d+\s*(?:of|\/)\s*\d+/i, model);
    assert.doesNotMatch(output.text, /9c1e4f2|7001|merge_state_status|reviewDecision|binding check/, model);
    assert.equal(judge.factsSha, sha256(expected), model);
    assert.equal(judge.candidateOutputSha, sha256(output.text), model);
    for (const { id } of facts) assert.equal(judge.facts[id]?.after, 'holds', `${model}: ${id}`);
    const menus = output.text.split('gauntlet: gate=gatekeep-pr/obstacle recommended=1').slice(1);
    assert.equal(menus.length, 3, model);
    for (const [index, action] of ['deliver', 'stop', 'stop'].entries()) {
      assert.match(menus[index], new RegExp(`^1\\. ${action}\\b.*\\[recommended\\]`, 'm'), model);
    }
  }
});
