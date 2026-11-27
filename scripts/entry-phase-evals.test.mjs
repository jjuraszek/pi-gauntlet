import assert from 'node:assert/strict';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { prepareTarget } from '../eval/run.mjs';
import { runMechanical, sha256 } from '../eval/lib/checks.mjs';
import { intentBody } from '../eval/lib/intent.mjs';
import { MODELS } from '../eval/lib/models.mjs';
import { isAssessedCandidate } from './replay-facts.mjs';
import { readRecord, cellReusable, judgmentCurrent } from '../eval/lib/records.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
// The saved baseline replies used the pre-move tree, even after main advances.
const base = '590bb884eaaff246d10e169cf0fcff70cba9a732';
for (const [target, sample] of [
  ['gauntlet', 'handoff-follows-pointer'],
  ['gauntlet', 'ordinary-request-no-run'],
  ['gatekeep-pr', 'overrides-own-block-only'],
]) test(`${target}/${sample}: both candidate models meet every must-hold`, () => {
  const prep = prepareTarget({ root, target, sample, base });
  assert.ok(prep.plans, prep.message);
  const [plan] = prep.plans;
  const [before, after] = ['baseline', 'candidate'].map(arm => readRecord(join(prep.dir, 'results'), sample, arm));
  const skillSha = sha256(plan.candSkill);
  const intentSha = sha256(intentBody(prep.intentText));
  const historical = isAssessedCandidate(target, sample, after, skillSha, intentSha);
  for (const model of MODELS.replay) {
    for (const [record, replaySha] of [[before, sha256(plan.baseSkill)], [after, historical ? after.skillSha : skillSha]]) {
      assert.ok(cellReusable(record, model, { kind: prep.target.kind, assembly: prep.target.assembly, thinking: MODELS.thinking,
        skillSha: replaySha, inputSha: plan.input }), `${model}: missing or stale replay`);
    }
    assert.ok(judgmentCurrent(after.judge[model], { factsSha: sha256(plan.expectedText), intentSha: historical ? after.judge[model].intentSha : intentSha,
      judgePromptSha: sha256(prep.judgeText), baselineOutputSha: sha256(before.outputs[model].text), candidateOutputSha: sha256(after.outputs[model].text) }), `${model}: stale judgment`);
    assert.ok(['improved', 'unchanged'].includes(after.judge[model].verdict), `${model}: ${after.judge[model].verdict}`);
    const mechanical = runMechanical(plan.facts, after.outputs[model].text);
    for (const { id, kind } of plan.facts) {
      assert.equal(after.judge[model].facts[id]?.after, 'holds', `${model}: ${id}`);
      if (kind === 'mechanical') assert.equal(mechanical[id], 'holds', `${model}: ${id}`);
    }
  }
});
