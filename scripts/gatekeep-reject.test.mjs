import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

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

  const severity = baseline.split('\n## Severity axis\n')[1]?.split('\n## ')[0];
  assert.match(severity, /\| Approach conflict[^\n]*\| blocking \|/,
    'valid approach conflicts must be blockers rather than reuse nits');
});
