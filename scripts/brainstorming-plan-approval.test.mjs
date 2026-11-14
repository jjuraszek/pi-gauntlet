import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('plain plan approval persists the default grant and waves before completing brainstorm', () => {
  const gate = read('skills/brainstorming/reference/spec-finalization.md');
  assert.match(gate, /\| bare `1` \| approve; persist `G`; engine `waves` \|/, 'plain 1 grants and selects waves');
  const grant = gate.match(/^Default grant \(`G`\): `([^`]+)`$/m)?.[1];
  assert.ok(grant, 'label the canonical grant independently of a menu digit');
  assert.equal(gate.split(grant).length - 1, 1, 'one canonical sentence');
  assert.ok(!gate.includes('`1`, `approve`, or equivalent prose approves without a grant'));
  assert.ok(!gate.includes('`none` for 1/4'));
  const persistAt = gate.indexOf('On every implementation approval');
  const amendAt = gate.indexOf('commit --amend --no-edit -q', persistAt);
  const checkAt = gate.indexOf('contains both fields with the selected values', amendAt);
  const completeAt = gate.indexOf('phase_tracker({ action: "complete", phase: "brainstorm" })', checkAt);
  const routeAt = gate.indexOf('Then invoke `/skill:writing-plans` on 1', completeAt);
  assert.ok(persistAt < amendAt && amendAt < checkAt && checkAt < completeAt && completeAt < routeAt);
  assert.ok(gate.includes('directly below `**Amend-grant:**` in the header block'));
  assert.ok(gate.includes('quote the exact resulting `**Amend-grant:**` value in full'));
  const grants = read('skills/brainstorming/reference/amendment-surface.md');
  assert.ok(grants.includes('a bare `1` or `2` at the spec gate'));
  assert.ok(grants.includes("the gate's default grant line"));
  assert.match(read('eval/brainstorming/samples/engine-waves/expected.md'), /^- plan-default: judged:.*A.*default grant.*waves.*HEAD.*completing brainstorm.*writing-plans/m);
});

test('saved plan-default replays hold on both models for the current facts', () => {
  const candidate = JSON.parse(read('eval/brainstorming/results/engine-waves/candidate.json'));
  const factsSha = sha256(read('eval/brainstorming/samples/engine-waves/expected.md'));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, factsSha, `${model}: current facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged reply`);
    assert.equal(judged.facts['plan-default']?.after, 'holds', `${model}: default grant, waves and ordered continuation`);
  }
});
