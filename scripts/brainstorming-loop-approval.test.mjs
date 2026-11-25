import test from 'node:test';
import { replayFactsSha } from './replay-facts.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('plain loop approval persists the default grant and loop before completing brainstorm', () => {
  const gate = read('skills/gauntlet/brainstorm/spec-finalization.md');
  assert.match(gate, /\| bare `2` \| approve; persist `G`; engine `loop`; use the settings allowance \|/);
  assert.match(gate, /`\*\*Engine:\*\* loop` for 2(?:\/[45])* or `\*\*Engine:\*\* waves` for 1 directly below `\*\*Amend-grant:\*\*`/);
  const persistAt = gate.indexOf('On every implementation approval');
  const amendAt = gate.indexOf('commit --amend --no-edit -q', persistAt);
  const checkAt = gate.indexOf('contains both fields with the selected values', amendAt);
  const completeAt = gate.indexOf('phase_tracker({ action: "complete", phase: "brainstorm", engine })', checkAt);
  const routeAt = gate.indexOf('Continue without another prompt.', completeAt);
  assert.ok(persistAt < amendAt && amendAt < checkAt && checkAt < completeAt && completeAt < routeAt);
  assert.ok(gate.includes('keeping the council-audit body'));
  assert.ok(gate.includes('omit that line on a bare approval'));
  assert.ok(gate.includes('uses the settings allowance without writing it to the spec or settings'));
  assert.ok(gate.includes('skips plan with reason `loop engine` instead of writing a task plan'));
  assert.match(read('eval/gauntlet/samples/loop-gate/expected.md'), /^- loop: judged: Reply 2 persists the full default grant.*Engine loop.*HEAD.*completes brainstorm.*returned loop instructions/m);
});

test('saved plain loop approval replays hold on both models for the recorded facts', () => {
  const candidate = JSON.parse(read('eval/gauntlet/results/loop-gate/candidate.json'));
  const factsSha = replayFactsSha(candidate, read('eval/gauntlet/samples/loop-gate/expected.md'));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, factsSha, `${model}: recorded facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged reply`);
    assert.equal(judged.facts.loop?.after, 'holds', `${model}: default grant, loop and ordered continuation`);
  }
});
