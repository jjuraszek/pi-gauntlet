import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('rejected gate replies stop before approval or change-request persistence', () => {
  const gate = read('skills/brainstorming/reference/spec-finalization.md');
  const rejectAt = gate.indexOf('**Rejected replies.**');
  const acceptAt = gate.indexOf('| bare `1` |');
  assert.ok(rejectAt >= 0 && rejectAt < acceptAt, 'validate before accepted reply mapping');
  const rejected = gate.slice(rejectAt, acceptAt);
  for (const token of [
    'exactly one clarifying question', 'no file or commit changes',
    'a second invalid reply leaves the gate waiting too',
    'before plain approval and before change requests',
    '`--fund-rounds=N` on row 2', '`--allowance=N` on row 1',
    'any flag on row 3 or 4', 'digit, label, or `approve`',
    'amendment, grant, or budget intent in words', 'auto-apply is the default',
    'positive safe integer', '[1-9][0-9]*', 'repeated flag', 'unknown `--` token',
    '`; allowance N`', '`, allowance N`', '`; fund N fix rounds`',
    '`, fund N fix rounds`', '`N more fix rounds`', 'matching flag',
    'no row digit, row label, or `approve`', 'rendered rows', 'withheld', '`5`, `6`',
  ]) assert.ok(rejected.includes(token), token);
  for (const stale of [
    'Add "; fund N fix rounds"', '| `2; fund 3 fix rounds`',
    '| bare `4` or `5` | approve', '| waves approval prose with a funding token | approve',
    '`approve, auto-apply amends` or equivalent prose approves and grants',
    '`5` approves and grants',
  ]) assert.ok(!gate.includes(stale), `retired acceptance: ${stale}`);
});

test('saved rejected-reply cases ask once and leave files and commits unchanged on both models', () => {
  for (const [target, sample, ids] of [
    ['spec-gate', 'flag-replies', ['worded-stop', 'worded-funding']],
    ['brainstorming', 'loop-funded-reply', ['five', 'four', 'malformed', 'words', 'suffixes', 'flags', 'selection']],
  ]) {
    const root = `eval/${target}`;
    const candidate = JSON.parse(read(`${root}/results/${sample}/candidate.json`));
    const factsSha = sha256(read(`${root}/samples/${sample}/expected.md`));
    assert.equal(Object.keys(candidate.outputs).length, 2);
    for (const [model, output] of Object.entries(candidate.outputs)) {
      assert.equal(output.status, 'ok', `${sample}/${model}`);
      const judged = candidate.judge[model];
      assert.equal(judged.factsSha, factsSha, `${sample}/${model}: current facts`);
      assert.equal(judged.candidateOutputSha, sha256(output.text), `${sample}/${model}: judged output`);
      for (const id of ids) assert.equal(judged.facts[id]?.after, 'holds', `${sample}/${model}/${id}`);
      if (sample === 'flag-replies') {
        assert.match(output.text, /^[ \t]*`?run allowance: 6`?\r?\n(?:[ \t]*\r?\n)*[ \t]*`?\/skill:loop-implementation`?\r?$/m, `${model}: accepted control retains its carrier ordering`);
      }
    }
  }
});
