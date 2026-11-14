import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sample = 'eval/spec-gate/samples/all-none';

test('bare approve echoes the rendered recommendation before applying the selected row', () => {
  const gate = read('skills/brainstorming/reference/spec-finalization.md');
  const rule = gate.split('\n').find((line) => line.startsWith('For bare `approve`, resolve'));
  assert.ok(rule, 'explicit bare-approve normalization');
  for (const token of ['just-rendered gate', '1, 2, or 4', 'Taking "approve" as option <n> - <label>', 'before applying', 'bare digit', 'never recompute']) {
    assert.ok(rule.includes(token), token);
  }
  assert.ok(gate.indexOf(rule) > gate.indexOf('**Rejected replies.**'), 'reject invalid replies before acting');
  assert.ok(gate.indexOf(rule) < gate.indexOf('| bare `1` |'), 'normalize before accepted-row actions');
});

test('saved all-none replays echo bare approve and follow each recommended row on both models', () => {
  const candidate = JSON.parse(read('eval/spec-gate/results/all-none/candidate.json'));
  const factsSha = sha256(read(`${sample}/expected.md`));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, factsSha, `${model}: current facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged reply`);
    for (const id of ['f1', 'f2', 'f3', 'f4', 'f5', 'plan', 'draft']) {
      assert.equal(judged.facts[id]?.after, 'holds', `${model}/${id}`);
    }
  }
});
