import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('plan funding appends its budget to the default grant before verified persistence', () => {
  const gate = read('skills/gauntlet/brainstorm/spec-finalization.md');
  assert.ok(gate.includes('| `1 --fund-rounds=N` | approve; persist `G; fund N fix rounds`; engine `waves` |'));
  assert.ok(!gate.includes('| `1` with a budget token |'), 'funding alone must not opt out of the default grant');
  assert.ok(gate.includes('N matching `[1-9][0-9]*`'));
  assert.ok(gate.includes("Keep `G` verbatim, including its final period (`approval.; fund N fix rounds`)."));
  assert.ok(gate.includes('quote the exact resulting `**Amend-grant:**` value in full, including any funding suffix'));
  const decodeAt = gate.indexOf('run Value decoding');
  const persistAt = gate.indexOf('On every implementation approval', decodeAt);
  const amendAt = gate.indexOf('commit --amend --no-edit -q', persistAt);
  const checkAt = gate.indexOf('contains both fields with the selected values', amendAt);
  const completeAt = gate.indexOf('phase_tracker({ action: "complete", phase: "brainstorm" })', checkAt);
  assert.ok(decodeAt < persistAt && persistAt < amendAt && amendAt < checkAt && checkAt < completeAt);
});

for (const [target, sample, fact] of [
  ['spec-gate', 'flag-replies', 'plan-funded'],
  ['brainstorming', 'grant-budget-reply', 'funded-value'],
]) {
  test(`${target}/${sample} saves the funded default grant on both replay models`, () => {
    const candidate = JSON.parse(read(`eval/${target}/results/${sample}/candidate.json`));
    const factsSha = sha256(read(`eval/${target}/samples/${sample}/expected.md`));
    assert.equal(Object.keys(candidate.outputs).length, 2);
    for (const [model, output] of Object.entries(candidate.outputs)) {
      assert.equal(output.status, 'ok', model);
      const judged = candidate.judge[model];
      assert.equal(judged.factsSha, factsSha, `${model}: current facts`);
      assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged reply`);
      assert.equal(judged.facts[fact]?.after, 'holds', `${model}: ${fact}`);
    }
  });
}
