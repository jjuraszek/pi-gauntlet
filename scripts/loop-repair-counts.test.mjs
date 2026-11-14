import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { sha256 } from '../eval/lib/checks.mjs';
import { intentBody } from '../eval/lib/intent.mjs';
import { MODELS } from '../eval/lib/models.mjs';
import { assemble, inputSha, parseCase } from '../eval/lib/replay.mjs';
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

test('isolated saved decisions count three seed repairs and two verification repairs plus pending', async t => {
  const dir = 'eval/loop-implementation';
  const sample = 'ledger-repair-counts';
  const target = JSON.parse(read(`${dir}/target.json`));
  const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
  const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline.json`));
  const { bundle, drop, text } = parseCase(read(`${dir}/samples/${sample}/case.md`));
  const selected = { ...target, skillFiles: target.skillFiles.filter(({ path }) => !drop.includes(path)) };
  const identity = {
    skillSha: sha256(assemble(selected, read, bundle)),
    inputSha: inputSha(read(`${dir}/replay.md`), text, bundle),
    kind: target.kind, assembly: target.assembly, thinking: MODELS.thinking,
  };
  assert.deepEqual(candidate.models.replay, MODELS.replay);
  for (const model of MODELS.replay) {
    await t.test(model, () => {
      assert.ok(cellReusable(candidate, model, identity), 'reply must match current instructions and input');
      const judgment = candidate.judge[model];
      assert.ok(judgmentCurrent(judgment, {
        factsSha: sha256(read(`${dir}/samples/${sample}/expected.md`)),
        judgePromptSha: sha256(read('eval/judge.md')),
        intentSha: sha256(intentBody(read(`${dir}/intent.md`))),
        baselineOutputSha: sha256(baseline.outputs[model].text),
        candidateOutputSha: sha256(candidate.outputs[model].text),
      }), 'judgment must cover current facts and replies');
      for (const fact of ['seed-stop', 'verification-reservation', 'settled-count', 'ledger-only']) {
        assert.equal(judgment.facts[fact]?.after, 'holds', fact);
      }
      assert.ok(candidate.outputs[model].text.includes('Stopped on seed'));
      assert.ok(candidate.outputs[model].text.includes('seed: 3 of 3'));
    });
  }
});
