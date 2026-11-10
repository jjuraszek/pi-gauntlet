import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { inputSha, parseCase } from '../eval/lib/replay.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
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

test('description-only repair replay recommends deliver on another author\'s PR', () => {
  const caseText = read(`${root}/samples/${sample}/case.md`);
  assert.match(caseText, /is_author: false/);
  const parsed = parseCase(caseText);
  const expected = read(`${root}/samples/${sample}/expected.md`);
  const facts = parseExpected(expected).facts;
  assert.ok(facts.some(({ id }) => id === 'recommendation'));
  const saved = JSON.parse(read(`${root}/results/${sample}/candidate.json`));
  assert.equal(saved.inputSha, inputSha(read(`${root}/replay.md`), parsed.text, parsed.bundle));
  assert.ok(saved.models.replay.length > 0);
  for (const model of saved.models.replay) {
    const output = saved.outputs[model];
    const judge = saved.judge[model];
    assert.equal(output.status, 'ok', model);
    assert.equal(judge.factsSha, sha256(expected), model);
    assert.equal(judge.candidateOutputSha, sha256(output.text), model);
    for (const { id } of facts) assert.equal(judge.facts[id]?.after, 'holds', `${model}: ${id}`);
    const initial = output.text.slice(output.text.indexOf('gauntlet: gate=gatekeep-pr/initial'));
    assert.match(initial, /^gauntlet: gate=gatekeep-pr\/initial recommended=1/);
    assert.match(initial, /^1\. deliver\b.*\[recommended\]/m);
  }
});
