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

test('bounded action authorization keeps the persona and decision contracts', () => {
  assert.equal(persona.split('---')[1], frontmatter);
  assert.ok(Buffer.byteLength(persona) < 50_000);
  assert.match(persona, /Limit each sentence to 200 characters/);
  assert.match(persona, /Put action accounting inside the first sentence, not in a third slot/);
  assert.match(persona, /Apply step 5's action authorization before running a check/);
});

test('stored action replay holds every required fact without a paid rerun', () => {
  const candidate = JSON.parse(read('../eval/loop-implementer/results/silence-bound-and-unreachable/candidate.json'));
  const cells = Object.entries(candidate.judge);
  assert.ok(cells.length > 0);
  for (const [model, cell] of cells) {
    assert.equal(candidate.outputs[model].status, 'ok');
    for (const fact of ['named-action', 'unreachable', 'spent-bound', 'flow-count', 'local-evidence', 'bounded-contract']) {
      assert.equal(cell.facts[fact].after, 'holds', `${model}: ${fact}`);
    }
  }
});

for (const [name, required] of [
  ['named bounded action', ['runner, inputs, count per flow', 'acceptance row or Design', 'without asking', 'ran <action> (<k> of <bound>)']],
  ['flow-wide accounting', ['all earlier decision lines', 'including other rows', 'seed, rows, repairs and finish', 'one more than the count']],
  ['unreachable prerequisite', ['unreachable: <what is missing> - <where it can run>', 'credential, environment or data not present', 'action the spec does not name', 'no further attempt in this session']],
  ['spent bound', ['bound spent: <action> <k> of <k>', 'first result line', 'failed']],
  ['replay evidence', ['Never record a paid or external action as the evidence\'s first segment', 'local replay or fixture check', 'action in a result line']],
]) {
  test(name, () => {
    for (const phrase of required) assert.ok(persona.includes(phrase), `missing: ${phrase}`);
  });
}
