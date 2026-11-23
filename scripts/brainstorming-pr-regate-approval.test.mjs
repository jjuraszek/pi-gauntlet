import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sample = 'eval/gauntlet/samples/spec-pr-regate';

test('marked PR approvals decode row 1/2 flags and commit all three headers without amending', () => {
  const source = read('skills/gauntlet/brainstorm/spec-pr.md');
  const regate = source.slice(source.indexOf('## Re-gate a marked spec PR'));
  assert.match(regate, /Offer 1\/2 and optional 3; with zero AC rows omit 2 and its flags/);
  assert.match(regate, /Withhold 4 with `Withheld: draft PR - #N already exists`/);
  assert.doesNotMatch(regate, /1\/2\/4\/5|omit 4\/5|Withhold 6/);
  const approval = regate.split('\n').find((line) => line.startsWith('For approval 1/2'));
  assert.ok(approval, 'published approval rule');
  for (const token of [
    'with their accepted flags', 'rejected-reply checks and accepted mapping',
    '`waves` for 1 or `loop` for 2', 'decoded `**Amend-grant:**`',
    'exactly one `**PR:** <owner/repo#N>` directly below Engine', 'lowercasing owner/repo',
    'new commit `spec: select engine and grant for PR #N`', 'never amend a published commit',
    'Verify all three fields through `git show HEAD:<spec path>` before brainstorm completion',
    'run allowance:', 'on its own line immediately before invoking loop-implementation',
    'even in a narrated approval trace', 'Keep the allowance out of the spec and settings',
  ]) assert.ok(approval.includes(token), token);
  assert.match(source, /Offer the ordinary AC-dependent 1\/2 choices and optional pinned audit 3/);
});

test('saved marked PR re-gates persist engine, grant and PR for bare and flagged approvals on both models', () => {
  const candidate = JSON.parse(read('eval/gauntlet/results/spec-pr-regate/candidate.json'));
  const expected = read(`${sample}/expected.md`);
  const facts = parseExpected(expected).facts;
  assert.ok(facts.some(({ id }) => id === 'flags'), 'flagged approval coverage');
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    assert.match(output.text, /^run allowance: 6\r?$/m, `${model}: shared or separate allowance traces render the standalone carrier`);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, sha256(expected), `${model}: current facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged output`);
    for (const { id } of facts) assert.equal(judged.facts[id]?.after, 'holds', `${model}/${id}`);
  }
});
