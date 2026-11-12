import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { lintTarget } from '../eval/lib/lint.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

test('verification repair dispatch carries blocking bounds and owned jobs into the shared implementer', () => {
  const driver = read('skills/loop-implementation/SKILL.md');
  const dispatch = driver.split('\n## After the loop\n')[1].split('\n2. Dispatch')[0];
  for (const token of [
    'Include this blocking-call contract in the repair task:',
    'timeout -k 30 <n>', 'n <= 600', 'background and poll longer work',
    "loop-implementer's Evidence command", 'copy its first three paragraphs verbatim',
    'apply ## Interrupted recovery steps 1-2',
    "failing leg's base and pre-bump iteration for jobs-file identity",
  ]) assert.ok(dispatch.includes(token), token);
  const rules = read('agents/loop-implementer.md').split('\n## Evidence command\n')[1].trim().split('\n\n').slice(0, 3).join('\n\n');
  for (const token of [
    'Preflight python3 and timeout', 'start_new_session=True', '"3600"',
    'scratch Python controller', 'separate tool call', 'OS-observed process start identity',
    'affirmative exit evidence', 'timed out after <n> s', 'pre-bump task iteration',
  ]) assert.ok(rules.includes(token), token);
  for (const path of ['doc/configuration.md', 'doc/implement-engines.md']) {
    const docs = read(path);
    assert.match(docs, /jobs.*pre-bump task iteration/);
    assert.doesNotMatch(docs, /repair child (?:records|writes|uses) no jobs file|repair child does not (?:record|write|use).*jobs/);
  }
  assert.ok(Buffer.byteLength(driver) < 45_000);
  assert.ok(driver.split('\n').length < 500);
});

test('CI includes the selective loop boundary regression files', () => {
  const ci = read('scripts/ci.mjs');
  for (const name of [
    'loop-boundary-integration', 'loop-conformance-grant', 'loop-engine-contract',
    'loop-implementer-actions', 'loop-implementer-process', 'loop-unreachable-cut',
    'loop-verification-repair',
  ]) assert.ok(ci.includes(`R("scripts/${name}.test.mjs")`), name);
});

test('boundary integration samples keep explicit ownership and allowance counterexamples', () => {
  assert.deepEqual(lintTarget(new URL('eval/loop-implementation', root).pathname), []);
  for (const [sample, tokens] of [
    ['seed-interrupted-count', ['seed: 1 of 1', 'loop: repair seed', 'rows +N', 'attempts 0']],
    ['companion-interrupted-recovery', ['repo-b', 'pending:', 'Missing provenance', 'loop: repair row 2']],
    ['exit-repair-capability', ['timeout -k 30', 'jobs', 'repairs: 4 of 4', 'without a proof demand or human turn']],
    ['tracker-verify', ['repairs: 4 of 4', 'second repair']],
    ['scaled-cap-grant', ['rule 3 supplies the fixed hint', 'admitted amendments']],
    ['last-attempt-model-boundary', ['rule 3 supplies the fixed hint', 'rule 4 escalates']],
    ['tracker-boundary', ['rule 3 supplies the fixed hint', 'iteration10']],
    ['human-stop-counts', ['repairs: 7 of 7', 'B dispatches', 'E and F recover automatically']],
    ['decision-repair', ['rule 3 supplies the fixed hint', 'rule 2 stops']],
    ['gate-line-first', ['Stopped: dirty tree with no dispatch pending', 'typed discard']],
    ['allowance-10-escalate-after', ['loop: repair row 2', 'no stop or human turn']],
    ['spent-row-escalation', ['loop: repair row 2', 'without a proof demand or human turn']],
    ['multi-row-return', ['loop: repair row 1', 'demanding proof or taking a human turn']],
    ['tracker-boundary', ['loop: repair row 2', 'no proof demand or human turn']],
  ]) {
    const text = read(`eval/loop-implementation/samples/${sample}/expected.md`);
    for (const token of tokens) assert.ok(text.includes(token), `${sample}: ${token}`);
  }
});
