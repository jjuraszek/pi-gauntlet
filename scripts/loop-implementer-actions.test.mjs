import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const persona = read('../agents/loop-implementer.md');
const frontmatter = `
name: loop-implementer
description: 'Dispatch for a loop-engine iteration on the target acceptance-criteria row plus proved same-leg extras, with evidence and one decision line each.'
tools: read, write, edit, bash
defaultContext: fresh
inheritProjectContext: true
inheritSkills: false
systemPromptMode: replace
completionGuard: true
`;

test('named action authorization keeps the persona and decision contracts', () => {
  assert.equal(persona.split('---')[1], frontmatter);
  assert.ok(Buffer.byteLength(persona) < 50_000);
  assert.match(persona, /Limit each sentence to 200 characters/);
  assert.doesNotMatch(persona, /action accounting|ran <action>|bound spent:|count below bound|count exhausted|highest recorded k|durable accounting|human-authorized recovery/);
  assert.match(persona, /Apply step 5's action authorization before running a check/);
});

test('action fixtures cover reruns, approval deferrals and local seed evidence', () => {
  const sample = '../eval/loop-implementer/samples/';
  const expected = read(`${sample}silence-bound-and-unreachable/expected.md`);
  for (const fact of ['named-action', 'unreachable', 'rerun', 'named-runs', 'local-evidence', 'bounded-contract']) {
    assert.ok(expected.includes(`- ${fact}: judged:`), `missing action fact: ${fact}`);
  }
  assert.doesNotMatch(expected, /^- (spent-bound|flow-count|interrupted-spend|durable-reservation):/m);
  assert.match(expected, /writes no.*(?:ran|bound spent)/);
  const cases = read(`${sample}silence-bound-and-unreachable/case.md`);
  assert.match(cases, /^K:.*later approval/m);
  assert.match(cases, /eleven independent iterations, A-K/);
  assert.doesNotMatch(read(`${sample}seed-evidence-carry/case.md`), /ran chart-capture|bound spent:|preserves accounting/);
  assert.match(read(`${sample}seed-evidence-carry/expected.md`), /without.*action record/);
  assert.doesNotMatch(read(`${sample}seed-recovery/case.md`), /human authorized/i);
});

for (const [name, required] of [
  ['named action', ['acceptance row or Design names', "authorized for the whole flow by the spec's approval", 'without asking on every attempt that needs it', 'Reuse its output for local rechecks rather than spending it again']],
  ['counts and approval deferrals do not withhold named actions', ['a count, or wording that defers it to a later approval', 'does not withhold it']],
  ['unreachable prerequisite', ['unreachable: <what is missing> - <where it can run>', 'credential, environment or data not present', 'action the spec does not name', 'no further attempt in this session']],
  ['replay evidence', ['Never record a paid or external action as the evidence\'s first segment', 'local replay or fixture check', 'action in a result line']],
]) {
  test(name, () => {
    for (const phrase of required) assert.ok(persona.includes(phrase), `missing: ${phrase}`);
  });
}
