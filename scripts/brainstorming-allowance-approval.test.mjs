import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('loop allowance flag stays separate from grant persistence and precedes the handoff', () => {
  const gate = read('skills/brainstorming/reference/spec-finalization.md');
  assert.ok(gate.includes('| `2 --allowance=N` | approve; persist `G`; engine `loop`; carry `run allowance: N` to ledger seeding |'));
  assert.ok(gate.includes('On row 2, accept one `--allowance=N` flag'));
  assert.ok(gate.includes('Strip only an accepted `--allowance=N` flag before decoding the grant'));
  assert.ok(gate.includes('persist it only in the ledger, not in the spec or settings'));
  assert.ok(!gate.includes('For 4/5, accept one optional'));
  const checkAt = gate.indexOf('contains both fields with the selected values');
  const completeAt = gate.indexOf('phase_tracker({ action: "complete", phase: "brainstorm" })', checkAt);
  const carrierAt = gate.indexOf('For an accepted `--allowance=N` flag on row 2, print exactly one line `run allowance: <n>` immediately before invoking `/skill:loop-implementation`', completeAt);
  assert.ok(checkAt >= 0 && checkAt < completeAt && completeAt < carrierAt);
  assert.ok(gate.includes('omit that line on a bare approval'));
  assert.ok(gate.includes('Render the carrier as a standalone plain-text line, even when narrating the handoff; keep it in the approving turn only, never in the spec or settings.'));
});

test('saved allowance flag replays carry run allowance 6 without a spec allowance on both models', () => {
  const candidate = JSON.parse(read('eval/spec-gate/results/flag-replies/candidate.json'));
  const factsSha = sha256(read('eval/spec-gate/samples/flag-replies/expected.md'));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, factsSha, `${model}: current facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged reply`);
    assert.equal(judged.facts['loop-allowance']?.after, 'holds', `${model}: separate allowance carrier`);
    assert.match(output.text, /^[ \t]*`?run allowance: 6`?\r?\n(?:[ \t]*\r?\n)*[ \t]*`?\/skill:loop-implementation`?\r?$/m, `${model}: literal carrier directly before invocation`);
  }
});
