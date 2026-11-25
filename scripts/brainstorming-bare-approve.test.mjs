import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';
import { replayFactsSha } from './replay-facts.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
test('bare approve and plain approval prose echo the rendered recommendation before applying the selected row', () => {
  const gate = read('skills/gauntlet/brainstorm/spec-finalization.md');
  const rule = gate.split('\n').find((line) => line.startsWith('For bare `approve`, resolve'));
  assert.ok(rule, 'explicit bare-approve normalization');
  for (const token of ['just-rendered gate', '1, 2, or 4', 'Taking "approve" as option <n> - <label>', 'before applying', 'bare digit', 'never recompute']) {
    assert.ok(rule.includes(token), token);
  }
  assert.ok(gate.indexOf(rule) > gate.indexOf('**Rejected replies.**'), 'reject invalid replies before acting');
  assert.ok(gate.indexOf(rule) < gate.indexOf('| bare `1` |'), 'normalize before accepted-row actions');
  for (const token of ['same mapping and literal echo', 'approval prose that names no row', 'no amendment, grant, or budget wording', 'approved, go ahead']) {
    assert.ok(rule.includes(token), token);
  }
  const selector = gate.split('\n').find((line) => line.startsWith('Wait for the user.'));
  assert.ok(selector.includes('plain approval prose'), 'reply selector includes prose normalization');
  const contract = read('doc/gate-contract.md').split('\n').find((line) => line.startsWith('| 1 - rows |'));
  for (const token of ['approval prose that names no row', 'no amendment, grant, or budget wording', 'Taking "approve" as option <n> - <label>']) {
    assert.ok(contract.includes(token), `public contract: ${token}`);
  }
});

for (const [sample, ids] of [
  ['all-none', ['f1', 'f2', 'f3', 'f4', 'f5', 'plan', 'draft']],
  ['flag-replies', ['plain-prose', 'defaults', 'approve-stop', 'worded-grant', 'worded-stop', 'worded-funding', 'wrong-engine', 'malformed', 'missing-row', 'old-suffix', 'removed']],
]) {
  test(`saved ${sample} replays normalize approval and preserve rejection rules on both models`, () => {
    const candidate = JSON.parse(read(`eval/spec-gate/results/${sample}/candidate.json`));
    const factsSha = replayFactsSha(candidate, read(`eval/spec-gate/samples/${sample}/expected.md`));
    assert.equal(Object.keys(candidate.outputs).length, 2);
    for (const [model, output] of Object.entries(candidate.outputs)) {
      assert.equal(output.status, 'ok', model);
      const judged = candidate.judge[model];
      assert.equal(judged.factsSha, factsSha, `${model}: recorded facts`);
      assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged reply`);
      for (const id of ids) {
        assert.equal(judged.facts[id]?.after, 'holds', `${model}/${id}`);
      }
    }
  });
}
