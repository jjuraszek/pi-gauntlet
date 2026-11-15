import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const loop = read('skills/gatekeep-pr/reference/post-selection-loop.md');
const section = (start, end) => loop.slice(loop.indexOf(`${start}\n`), loop.indexOf(`${end}\n`));

test('merge execution confines the flag to bypass and consumes refusals before success routing', () => {
  const merge = section('### Merge course', '### Re-render');
  assert.match(merge, /Append `--admin` only on the bypass path: `merge_state_status == BLOCKED` and `permissions.bypass_eligible == true`/);
  assert.match(merge, /Omit `--admin` on every other path/);
  for (const [policy, flag] of [['squash', '--squash'], ['merge-commit', '--merge'], ['rebase', '--rebase']]) {
    const row = merge.split('\n').find(line => line.startsWith(`| \`${policy}\` |`));
    assert.ok(row, `${policy}: merge command row`);
    const flags = row.match(/--(?:squash|merge|rebase)\b/g);
    assert.deepEqual(flags, [flag], `${policy}: only its resolved merge flag`);
  }
  assert.match(merge, /nonzero exit, print gh's error verbatim, consume the selection without retry/);
  assert.match(merge, /no second attempt with or without `--admin`/);
  assert.match(merge, /re-run `### Pre-menu refresh`/);
  assert.match(merge, /final while all merge preconditions hold; obstacle explaining that GitHub still blocks this actor from merging/);
  assert.ok(merge.indexOf('nonzero exit') < merge.indexOf('state: MERGED'));
  assert.match(merge, /On a zero exit/);
  assert.match(merge, /skips the merge queue/);
  assert.match(merge, /parent reads `permissions.bypass_eligible` from the retained child record/);
  assert.match(read('skills/gatekeep-pr/reference/menus.md'), /`merge`[^\n]*`--admin` only on the bypass path/);
});

test('eligibility changes invalidate the selected merge even without a merge-state change', () => {
  const cas = section('### Compare-and-swap', '### Fix wave');
  assert.match(cas, /Section A's fixed GraphQL query/);
  assert.match(cas, /head, body, or base mismatch/);
  assert.match(cas, /A `bypass_eligible` change from the rendered menu invalidates the selected merge even with `BLOCKED` unchanged/);
  assert.match(cas, /run no `gh pr merge` and re-enter Pre-menu refresh for a fresh selection/);
});

for (const [name, repoSha] of [
  ['bypass-merge-pick-refused', '2ab622211ddf19cbca08f5914f770e9fe78ac0d9'],
  ['bypass-merge-pick-revoked', '49110877b66be79285ac5c2d43fcaf714543817f'],
]) {
  test(`historical saved replies: ${name} holds every post-pick fact`, () => {
    const root = 'eval/gatekeep-pr';
    read(`${root}/samples/${name}/case.md`);
    const expected = read(`${root}/samples/${name}/expected.md`);
    const saved = JSON.parse(read(`${root}/results/${name}/candidate.json`));
    assert.equal(saved.repoSha, repoSha);
    read(`${root}/replay.md`);
    assert.match(saved.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
    assert.match(saved.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
    assert.equal(Object.keys(saved.outputs).length, 2);
    for (const [model, output] of Object.entries(saved.outputs)) {
      assert.equal(output.status, 'ok', model);
      const judge = saved.judge[model];
      assert.match(judge.factsSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded facts hash');
      assert.equal(judge.candidateOutputSha, sha256(output.text));
      for (const { id } of parseExpected(expected).facts) assert.equal(judge.facts[id].after, 'holds', `${model}/${id}`);
    }
  });
}
