import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('combined plan opt-out and funding persists only the budget before the waves handoff', () => {
  const gate = read('skills/brainstorming/reference/spec-finalization.md');
  assert.ok(gate.includes('| `1 --amends-stop --fund-rounds=N` | approve; persist `fund N fix rounds`; engine `waves` |'));
  assert.ok(gate.includes('without `--amends-stop`, append `; fund N fix rounds` to `G`'));
  assert.ok(gate.includes('Apply this opt-out rule only without funding: For `--amends-stop` approvals, persist `none`'));
  assert.ok(gate.includes('With both `--amends-stop` and `--fund-rounds=N` on row 1, persist only `fund N fix rounds`, without amend permission, and keep engine `waves`.'));
  const decodeAt = gate.indexOf('run Value decoding');
  const persistAt = gate.indexOf('On every implementation approval', decodeAt);
  const amendAt = gate.indexOf('commit --amend --no-edit -q', persistAt);
  const checkAt = gate.indexOf('contains both fields with the selected values', amendAt);
  const completeAt = gate.indexOf('phase_tracker({ action: "complete", phase: "brainstorm" })', checkAt);
  const handoffAt = gate.indexOf('Then invoke `/skill:writing-plans` on 1', completeAt);
  assert.ok(decodeAt >= 0 && decodeAt < persistAt && persistAt < amendAt && amendAt < checkAt && checkAt < completeAt && completeAt < handoffAt);
});

test('saved combined flags persist fund 3 fix rounds without amendment permission on both models', () => {
  const candidate = JSON.parse(read('eval/spec-gate/results/flag-replies/candidate.json'));
  const factsSha = sha256(read('eval/spec-gate/samples/flag-replies/expected.md'));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, factsSha, `${model}: current facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged reply`);
    assert.equal(judged.facts['plan-stop-funded']?.after, 'holds', `${model}: budget-only approval`);
  }
});
