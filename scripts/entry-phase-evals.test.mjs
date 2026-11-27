import assert from 'node:assert/strict';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { prepareTarget } from '../eval/run.mjs';
import { runMechanical, sha256 } from '../eval/lib/checks.mjs';
import { intentBody } from '../eval/lib/intent.mjs';
import { MODELS } from '../eval/lib/models.mjs';
import { readRecord, cellReusable, judgmentCurrent } from '../eval/lib/records.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
// The saved baseline replies used the pre-move tree, even after main advances.
const base = '590bb884eaaff246d10e169cf0fcff70cba9a732';
for (const [target, sample, historical] of [
  ['gauntlet', 'handoff-follows-pointer'],
  ['gauntlet', 'ordinary-request-no-run'],
  // This unselected sample retains its reply and judgment from before the contract-judgment edit.
  ['gatekeep-pr', 'overrides-own-block-only', {
    skillSha: '2047110d7db4f6ed133728734c0bb80018d52aa889a61a25edf4783292d1dc67',
    intentSha: 'd32eec97ae2d6458855d0af46f0e147a197af03b616401e50c76d9005212c345',
  }],
]) test(`${target}/${sample}: both ${historical ? 'historical' : 'candidate'} models meet every must-hold`, () => {
  const prep = prepareTarget({ root, target, sample, base });
  assert.ok(prep.plans, prep.message);
  const [plan] = prep.plans;
  const [before, after] = ['baseline', 'candidate'].map(arm => readRecord(join(prep.dir, 'results'), sample, arm));
  for (const model of MODELS.replay) {
    for (const [record, skillSha] of [[before, sha256(plan.baseSkill)], [after, historical?.skillSha ?? sha256(plan.candSkill)]]) {
      assert.ok(cellReusable(record, model, { kind: prep.target.kind, assembly: prep.target.assembly, thinking: MODELS.thinking,
        skillSha, inputSha: plan.input }), `${model}: missing or stale replay`);
    }
    assert.ok(judgmentCurrent(after.judge[model], { factsSha: sha256(plan.expectedText), intentSha: historical?.intentSha ?? sha256(intentBody(prep.intentText)),
      judgePromptSha: sha256(prep.judgeText), baselineOutputSha: sha256(before.outputs[model].text), candidateOutputSha: sha256(after.outputs[model].text) }), `${model}: stale judgment`);
    assert.ok(['improved', 'unchanged'].includes(after.judge[model].verdict), `${model}: ${after.judge[model].verdict}`);
    const mechanical = runMechanical(plan.facts, after.outputs[model].text);
    for (const { id, kind } of plan.facts) {
      assert.equal(after.judge[model].facts[id]?.after, 'holds', `${model}: ${id}`);
      if (kind === 'mechanical') assert.equal(mechanical[id], 'holds', `${model}: ${id}`);
    }
  }
});
