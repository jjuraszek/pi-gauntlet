import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { inputSha, parseCase } from '../eval/lib/replay.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

for (const sample of ['overrule-approach', 'overrule-stuck-blocker', 'stuck-blocker-sections', 'consent-no-progress-stop', 'row-exhaustion']) {
  test(`${sample}: saved replies satisfy every fact`, () => {
    const root = `eval/gatekeep-pr/`;
    const expected = read(`${root}samples/${sample}/expected.md`);
    const { text, bundle } = parseCase(read(`${root}samples/${sample}/case.md`));
    const candidate = JSON.parse(read(`${root}results/${sample}/candidate.json`));
    assert.match(candidate.skillSha, /^[a-f0-9]{64}$/);
    assert.equal(candidate.inputSha, inputSha(read(`${root}replay.md`), text, bundle));
    assert.equal(Object.keys(candidate.outputs).length, 2);
    for (const [model, output] of Object.entries(candidate.outputs)) {
      assert.equal(output.status, 'ok', model);
      assert.equal(candidate.judge[model].factsSha, sha256(expected));
      assert.equal(candidate.judge[model].candidateOutputSha, sha256(output.text));
      for (const fact of parseExpected(expected).facts) assert.equal(candidate.judge[model].facts[fact.id]?.after, 'holds', `${model}/${fact.id}`);
    }
  });
}

test('overrule is a mapped developer disposition, not a course or a repair', () => {
  const reject = read('skills/gatekeep-pr/reference/reject.md');
  const loop = read('skills/gatekeep-pr/reference/post-selection-loop.md');
  const brief = read('skills/gatekeep-pr/verification-brief.md');
  const menus = read('skills/gatekeep-pr/reference/menus.md');
  for (const phrase of ['## Overrule', 'same flaw', 'Failing-check', 'Contract-exception', 'Non-finding', 'not covered - overruled in this run', 'never resumes a course', 'dispositioned: overruled', 'assess-terminal', 'blocker_numbers']) assert.ok(reject.includes(phrase), phrase);
  assert.ok(reject.includes('No problem number was given, so nothing was set aside.'));
  assert.ok(reject.includes('Problem <n> is not in the current report, so nothing was set aside.'));
  assert.ok(reject.includes('Give no instructions for completing a command when no listed blocker is eligible'));
  assert.match(read('skills/gatekeep-pr/reference/fix-wave.md'), /no retained local commits beyond the pushed head/);
  assert.match(loop, /Recognize exact[^\n]*overrule <n>/);
  assert.match(loop, /dispositioned `flaky` or `overruled` by the user/);
  assert.match(brief, /blocker_numbers: \[ \{ n, ids \} \]/);
  assert.match(menus, /overrule <n> sets problem <n> aside for this run/);
  assert.match(read('skills/gatekeep-pr/reference/fix-wave.md'), /overruled id is neither resolved nor open/);
  assert.ok(read('scripts/ci.mjs').includes('R("scripts/gatekeep-overrule.test.mjs")'));
  assert.match(read('skills/gatekeep-pr/reference/report.md'), /no carried or overruled approach problem/);
  assert.match(read('skills/gatekeep-pr/reference/report.md'), /Preserve the required set-aside sentence after an approach overrule/);
});

test('stuck findings explain the observed failed repair and only available choices', () => {
  const report = read('skills/gatekeep-pr/reference/report.md');
  for (const phrase of ['Problem <n>', '### What is blocked', '### Why the repair stopped', '### What you can do', 'under 180 words', 'Same check red twice', 'unknown', 'blocker_numbers', 'Copy the three heading lines byte-for-byte', 'Include one item for every offered', 'Include `deliver` when the menu offers it even at row exhaustion']) assert.ok(report.includes(phrase), phrase);
  assert.match(report, /failing.check[\s\S]*no `overrule`/i);
  assert.match(report, /not finding-based/);
});
