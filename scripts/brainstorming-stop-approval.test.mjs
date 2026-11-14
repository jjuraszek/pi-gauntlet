import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const cases = [
  { row: 1, engine: 'waves', fact: 'plan-stop' },
  { row: 2, engine: 'loop', fact: 'loop-stop' },
];

test('amends-stop persists none with the selected engine through verified approval', () => {
  const gate = read('skills/brainstorming/reference/spec-finalization.md');
  for (const { row, engine } of cases) {
    assert.ok(gate.includes(`| \`${row} --amends-stop\` | approve; persist \`none\`; engine \`${engine}\``), `row ${row} opts out without changing engine`);
  }
  assert.ok(gate.includes("For `--amends-stop` approvals, persist `none` rather than the default grant and keep the selected row's engine."));
  assert.match(gate, /On every implementation approval[^\n]+edit` the spec's `\*\*Amend-grant:\*\*` value to the decoded table value for every reply/);
  assert.ok(gate.includes('quote the exact resulting `**Amend-grant:**` value in full'));
  const amendAt = gate.indexOf('commit --amend --no-edit -q', gate.indexOf('On every implementation approval'));
  const checkAt = gate.indexOf('contains both fields with the selected values', amendAt);
  const completeAt = gate.indexOf('phase_tracker({ action: "complete", phase: "brainstorm" })', checkAt);
  assert.ok(amendAt >= 0 && amendAt < checkAt && checkAt < completeAt);
});

test('saved amends-stop replies hold on both replay models for the current facts', () => {
  const candidate = JSON.parse(read('eval/spec-gate/results/flag-replies/candidate.json'));
  const factsSha = sha256(read('eval/spec-gate/samples/flag-replies/expected.md'));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, factsSha, `${model}: current facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged reply`);
    for (const { fact } of cases) assert.equal(judged.facts[fact]?.after, 'holds', `${model}: ${fact}`);
  }
});
