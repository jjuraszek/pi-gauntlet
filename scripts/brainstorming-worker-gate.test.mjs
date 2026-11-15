import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sample = 'eval/spec-gate/samples/worker-path';

test('gate withholding composes without restoring the council row when no audit exists', () => {
  const gate = read('skills/brainstorming/reference/spec-finalization.md');
  const rule = gate.split('\n').find((line) => line.startsWith('Apply the withholding rules independently'));
  assert.ok(rule, 'independent withholding rule');
  for (const token of ['worker path', 'council aborted before an audit existed', 'omit row 3', 'Council:', 'zero-row', 'PR-subject', 'never renumber']) {
    assert.ok(rule.includes(token), token);
  }
  assert.doesNotMatch(gate, /Whenever rows exist, render the four-row template above/);
  assert.match(gate, /a withheld row's digit or label[^\n]+Name the rendered rows; never remap/);
});

test('saved worker gate covers absent audits and combined withholding on both models', () => {
  const candidate = JSON.parse(read('eval/spec-gate/results/worker-path/candidate.json'));
  const factsSha = sha256(read(`${sample}/expected.md`));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, factsSha, `${model}: current facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged output`);
    for (const id of ['f1', 'f2', 'f3', 'f4', 'f5', 'combined', 'aborted', 'hidden']) {
      assert.equal(judged.facts[id]?.after, 'holds', `${model}/${id}`);
    }
  }
});
