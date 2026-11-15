import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sample = 'eval/brainstorming/samples/pr-subject-gate';

test('PR subjects withhold draft row 4 and clarify hidden selections without remapping', () => {
  const gate = read('skills/brainstorming/reference/spec-finalization.md');
  const rule = gate.split('\n').find((line) => line.startsWith('On every PR subject'));
  for (const token of ['omit row 4', 'Withheld: draft PR - #N already exists', 'hidden 4', 'rendered choices']) {
    assert.ok(rule.includes(token), token);
  }
  assert.doesNotMatch(rule, /(?:row|hidden) 6/);
  assert.match(gate, /a withheld row's digit or label[^\n]+Name the rendered rows; never remap/);
  const classifier = read('skills/brainstorming/reference/pr-subject.md');
  const unmarked = classifier.split('\n').find((line) => line.startsWith('| Shape passes, marker absent'));
  assert.match(unmarked, /with 4 withheld/);
  assert.match(unmarked, /On approval 1\/2 persist/);
  assert.doesNotMatch(unmarked, /with 6 withheld|approval 1\/2\/4\/5/);
});

test('saved PR-subject gate omits row 4 and rejects its digit and label on both models', () => {
  const candidate = JSON.parse(read('eval/brainstorming/results/pr-subject-gate/candidate.json'));
  const factsSha = sha256(read(`${sample}/expected.md`));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, factsSha, `${model}: current facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged output`);
    for (const id of ['withheld', 'menu', 'clarification', 'recommendation']) {
      assert.equal(judged.facts[id]?.after, 'holds', `${model}/${id}`);
    }
  }
});
