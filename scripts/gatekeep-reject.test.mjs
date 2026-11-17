import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { inputSha, parseCase } from '../eval/lib/replay.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('approach rubric requires evidence and a replacement of the main mechanism', () => {
  const baseline = read('../skills/gatekeep-pr/review-baseline.md');
  const grounds = baseline.split('\n## Approach grounds\n')[1]?.split('\n## ')[0];
  assert.ok(grounds, 'the review rubric must define Approach grounds');

  const rows = grounds.split('\n')
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
  assert.deepEqual(rows.map(([number, name, , , recommends]) => [number, name, recommends]), [
    ['1', 'Second mechanism', 'yes'],
    ['2', 'Architecture boundary', 'yes'],
    ['3', 'Unjustified reversal', 'yes'],
    ['4', 'Weakened guard', 'yes'],
    ['5', 'Symptom-level fix', 'yes'],
    ['6', 'Needless machinery', 'no'],
  ]);
  for (const [, name, definition, evidence] of rows) {
    assert.ok(definition?.length, `${name} must define the conflict`);
    assert.ok(evidence?.length, `${name} must name its evidence`);
  }
  assert.match(rows[5][3], /smaller change/i, 'complexity needs a concrete simpler alternative');
  assert.match(rows[5][3], /preserv.*outcome/i, 'the smaller change must keep the intended outcome');
  assert.match(grounds, /base.branch/i, 'other grounds cite evidence on the base branch');
  assert.match(grounds, /main mechanism/i, 'an approach remedy replaces the main mechanism');
  assert.match(grounds, /part of the diff/i, 'a local repair stays an ordinary finding');
  assert.match(grounds, /configures or records/, 'framework and external decisions need base-file evidence');
  assert.match(grounds, /non-blocking[\s\S]*nits[\s\S]*no note[\s\S]*no `reject`/, 'an overlay can downgrade a ground');

  const severity = baseline.split('\n## Severity axis\n')[1]?.split('\n## ')[0];
  assert.match(severity, /\| Approach conflict[^\n]*\| blocking \|/,
    'valid approach conflicts must be blockers rather than reuse nits');
});

test('the caller requests and validates approach conflicts before rendering the first report', () => {
  const brief = read('../skills/gatekeep-pr/verification-brief.md');
  const assessment = read('../skills/gatekeep-pr/reference/assessment.md');
  const findings = read('../skills/gatekeep-pr/reference/findings.md');
  const report = read('../skills/gatekeep-pr/reference/report.md');
  for (const field of ['builds', 'path', 'conflicts with', 'smaller', 'instead', 'replaces']) {
    assert.ok(brief.includes(`${field}:`), `reviewer entries need ${field}`);
  }
  assert.match(brief, /A<n>: <ground name/);
  assert.match(brief, /one hop/);
  assert.match(brief, /native verdict[\s\S]*never/);
  assert.match(brief, /## Approach conflicts/);
  assert.match(brief, /whole-PR approach check/);
  assert.match(brief, /native findings.*delta-bounded/);
  assert.match(assessment, /work_started == false/);
  assert.match(assessment, /## Approach conflicts[\s\S]*off-contract/);
  for (const rule of [/unknown ground/, /no base path/, /base path missing/, /no smaller change/, /no remedy/, /remedy edits part of the diff/, /cat-file -e/]) {
    assert.match(findings, rule);
  }
  assert.match(findings, /`P#` blocker[\s\S]*conflict key[\s\S]*provenance/);
  assert.match(findings, /approach entry dropped - <reason>/);
  assert.match(findings, /non-blocking[\s\S]*nits[\s\S]*no note[\s\S]*no `reject`/);
  assert.match(report, /one or two sentences/);
  assert.match(report, /base path.*trailing/);
  assert.match(report, /native verdict/);
  assert.match(report, /Do not double-count/);
  assert.ok(read('ci.mjs').includes('R("scripts/gatekeep-reject.test.mjs")'), 'CI selects the deterministic approach checks');
});

for (const sample of ['approach-conflict-report', 'approach-local-instance']) {
  test(`${sample}: saved sample-scoped replies satisfy every approach fact`, () => {
    const root = `../eval/gatekeep-pr/`;
    const expectedText = read(`${root}samples/${sample}/expected.md`);
    const { facts } = parseExpected(expectedText);
    const candidate = JSON.parse(read(`${root}results/${sample}/candidate.json`));
    const { text, bundle } = parseCase(read(`${root}samples/${sample}/case.md`));
    assert.equal(candidate.inputSha, inputSha(read(`${root}replay.md`), text, bundle));
    assert.equal(Object.keys(candidate.outputs).length, 2);
    for (const [model, output] of Object.entries(candidate.outputs)) {
      assert.equal(output.status, 'ok', model);
      const judgment = candidate.judge[model];
      assert.equal(judgment.factsSha, sha256(expectedText), model);
      assert.equal(judgment.candidateOutputSha, sha256(output.text), model);
      for (const fact of facts) {
        assert.equal(judgment.facts[fact.id]?.after, 'holds', `${sample}/${model}/${fact.id}`);
      }
    }
  });
}
