import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sample = 'eval/spec-gate/samples/option-6-handoff';

test('draft PR row 4 persists deferred headers before spec-only publication and create-only retry', () => {
  const gate = read('skills/brainstorming/reference/spec-finalization.md');
  assert.ok(gate.includes('for row-4 reply decoding, publication'));
  assert.ok(gate.split('\n').includes("4 - draft PR: approve the spec's content only and publish it as a draft PR; to continue, start a fresh session and run `/skill:brainstorming #<N>` there."), 'draft row includes the fresh-session continuation command before publication');
  assert.ok(gate.includes('omit row 2 and all its flag lines, including `--allowance=N`; render rows 1, 3, 4'));
  assert.ok(gate.includes('Loop engine unavailable: this spec has no acceptance-criteria rows.'));
  const ref = read('skills/brainstorming/reference/spec-pr.md');
  const publish = ref.slice(ref.indexOf('## Publish row 4'), ref.indexOf('### Draft-PR cleanup'));
  for (const token of [
    'On clean `4`', '**Amend-grant:** none', '**Engine:** deferred',
    'commit --amend --no-edit -q', 'show HEAD:<spec path>',
    'shared predicate against `origin/$DEFAULT` before pushing',
    'push -u origin <branch>', 'gh pr create --draft --head <branch> --base "$DEFAULT"',
    '--body-file -', "<<'EOF'", 'no push, no amend',
    '4 - retry opening the draft PR [recommended]',
    'gauntlet: gate=brainstorming/user-review-gate recommended=4',
    'Context: unknown', 'no amend and no push',
    'Continue: start a fresh session, then run `/skill:brainstorming #<N>`.',
    'Start no plan or loop',
  ]) assert.ok(publish.includes(token), token);
  assert.doesNotMatch(publish, /(?:option|row|Retry|clean|hidden|retryable)\s+`?6\b/);
  assert.ok(publish.indexOf('show HEAD:<spec path>') < publish.indexOf('push -u origin'));
});

test('saved row-4 publication replay proves persistence, spec-only push and safe retry on both models', () => {
  const candidate = JSON.parse(read('eval/spec-gate/results/option-6-handoff/candidate.json'));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const initialGate = output.text.split(/\nRecommended:/)[0];
    assert.deepEqual([...initialGate.matchAll(/^(\d+) - /gm)].map((match) => match[1]), ['1', '3', '4'], `${model}: zero-row publication stays reachable`);
    assert.doesNotMatch(initialGate, /--allowance/);
    assert.ok(output.text.includes('Loop engine unavailable: this spec has no acceptance-criteria rows.'), `${model}: omission explained`);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, sha256(read(`${sample}/expected.md`)), `${model}: current facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged output`);
    for (const id of ['menu', 'persistence', 'publication', 'single-member', 'completion', 'replies', 'invalid', 'rejection', 'create-failure', 'retry', 'retry-menu', 'continue']) {
      assert.equal(judged.facts[id]?.after, 'holds', `${model}/${id}`);
    }
  }
});
