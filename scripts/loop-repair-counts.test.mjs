import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { sha256 } from '../eval/lib/checks.mjs';
import { MODELS } from '../eval/lib/models.mjs';
import { cellReusable, judgmentCurrent } from '../eval/lib/records.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const driver = read('skills/loop-implementation/SKILL.md');

test('repair counts are ledger instructions, not commit-message counters', () => {
  const seed = driver.split('\nCount seed attempts as ')[1].split('\n\n')[0];
  assert.ok(seed, 'seed count instruction exists');
  for (const token of [
    '`repair seed` lines in the home ledger', 'including interrupted and validation-miss repairs',
    'never count commit messages', 'count is below the ledger allowance',
    'At allowance render `Stopped on seed` with `seed: <k> of <allowance>`',
    'Keep row attempts at 0',
  ]) assert.ok(seed.includes(token), token);
  const verify = driver.split('Count `repairs` as ')[1].split('\n')[0];
  for (const token of [
    '`repair verification` lines in the home ledger plus one for a `pending: verify` tuple on disk',
    'no per-row retry increments', 'Recover this count from the ledger on every resume',
    'appends the decision and clears the tuple together',
    'Recover an outstanding tuple before any new gate run or dispatch',
  ]) assert.ok(verify.includes(token), token);
  assert.doesNotMatch(seed + verify, /--grep|format=%[sbB]|commits since/);
});

test('historical saved replies: decisions count three seed repairs and two verification repairs plus pending', async t => {
  const dir = 'eval/loop-implementation';
  const sample = 'ledger-repair-counts';
  const target = JSON.parse(read(`${dir}/target.json`));
  const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
  const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline.json`));
  read(`${dir}/samples/${sample}/case.md`);
  read(`${dir}/samples/${sample}/expected.md`);
  read(`${dir}/replay.md`);
  assert.match(candidate.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
  assert.match(candidate.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
  const identity = {
    skillSha: candidate.skillSha,
    inputSha: candidate.inputSha,
    kind: target.kind, assembly: target.assembly, thinking: MODELS.thinking,
  };
  assert.deepEqual(candidate.models.replay, MODELS.replay);
  for (const model of MODELS.replay) {
    await t.test(model, () => {
      assert.ok(cellReusable(candidate, model, identity), 'historical saved replies: reply matches recorded identity');
      const judgment = candidate.judge[model];
      for (const key of ['factsSha', 'judgePromptSha', 'intentSha']) {
        assert.match(judgment[key], /^[a-f0-9]{64}$/, `historical saved replies: recorded ${key}`);
      }
      assert.ok(judgmentCurrent(judgment, {
        factsSha: judgment.factsSha,
        judgePromptSha: judgment.judgePromptSha,
        intentSha: judgment.intentSha,
        baselineOutputSha: sha256(baseline.outputs[model].text),
        candidateOutputSha: sha256(candidate.outputs[model].text),
      }), 'historical saved replies: judgment matches recorded outputs');
      for (const fact of ['seed-stop', 'verification-reservation', 'settled-count', 'ledger-only']) {
        assert.equal(judgment.facts[fact]?.after, 'holds', fact);
      }
      assert.ok(candidate.outputs[model].text.includes('Stopped on seed'));
      assert.ok(candidate.outputs[model].text.includes('seed: 3 of 3'));
    });
  }
});
