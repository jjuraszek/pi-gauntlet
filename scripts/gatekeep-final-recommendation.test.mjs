import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const root = '../eval/gatekeep-pr';
const sample = 'final-row-one';

test('final recommendation prefers available merge regardless of authorship, then approve', () => {
  const menus = read('../skills/gatekeep-pr/reference/menus.md');
  const recommendation = menus.split('## Recommendation\n')[1].split('\n## initial')[0];
  assert.match(recommendation, /In the final state, recommend `merge` whenever available.*ordinary path.*admin override.*regardless of authorship/);
  assert.match(recommendation, /otherwise recommend `approve` when available, else `stop`/);
  const final = menus.split('## final\n')[1].split('\n## assess terminal')[0];
  assert.match(final, /Choose the recommendation through `## Recommendation`/);
  assert.doesNotMatch(final, /Recommend merge for own PR|recommend approve for someone else's/);
});

test('historical saved replies: final puts merge before approve for own, other-author and bypass PRs', () => {
  read(`${root}/samples/${sample}/case.md`);
  const expected = read(`${root}/samples/${sample}/expected.md`);
  const facts = parseExpected(expected).facts;
  for (const id of ['own', 'other', 'bypass', 'approve', 'authority']) {
    assert.ok(facts.some((fact) => fact.id === id), id);
  }
  const saved = JSON.parse(read(`${root}/results/${sample}/candidate.json`));
  read(`${root}/replay.md`);
  assert.match(saved.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
  assert.match(saved.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
  assert.ok(saved.models.replay.length > 0);
  for (const model of saved.models.replay) {
    const output = saved.outputs[model];
    const judge = saved.judge[model];
    assert.equal(output.status, 'ok', model);
    assert.match(judge.factsSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded facts hash');
    assert.equal(judge.candidateOutputSha, sha256(output.text), model);
    for (const { id } of facts) assert.equal(judge.facts[id]?.after, 'holds', `${model}: ${id}`);
    const menus = output.text.split('gauntlet: gate=gatekeep-pr/final recommended=1').slice(1);
    assert.equal(menus.length, 4, model);
    for (const [index, action] of ['merge', 'merge', 'merge', 'approve'].entries()) {
      assert.match(menus[index], new RegExp(`^1\\. ${action}\\b.*\\[recommended\\]`, 'm'), model);
    }
  }
});
