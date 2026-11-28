import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const stop = readFileSync(new URL('skills/gauntlet/implement/loop/human-stop.md', root), 'utf8');
const driver = readFileSync(new URL('skills/gauntlet/implement/loop/loop.md', root), 'utf8');
const gate = driver.split('\n## After the loop\n')[1].split('\n2. Dispatch')[0];
const wording = readFileSync(new URL('skills/gauntlet/commit-message.md', root), 'utf8');
const companion = readFileSync(new URL('skills/gauntlet/implement/loop/coordinated-legs.md', root), 'utf8');
const recovery = readFileSync(new URL('skills/gauntlet/implement/loop/interrupted-recovery.md', root), 'utf8');
const restoreLoop = readFileSync(new URL('skills/gauntlet-resume/reference/restore-loop.md', root), 'utf8');
const amendment = readFileSync(new URL('skills/gauntlet/amendment-surface.md', root), 'utf8');

const bookkeeping = [
  ['Ledger skeleton', 'Start the acceptance ledger', driver, 'shared Ledger skeleton sentence'],
  ['Retry', 'Grant acceptance row <n> one more attempt', stop, 'shared Retry sentence'],
  ['Allowance raise', 'Raise the attempt allowance by <n>', stop, 'shared Allowance raise sentence'],
  ['Escalation', 'Escalate acceptance row <n> to the stronger model', driver, 'shared Escalation sentence'],
  ['Row repair, validation miss or interrupted', 'Record a failed attempt on acceptance row <n>', driver + recovery + companion, 'shared Row repair sentence'],
  ['Seed repair', 'Record a failed baseline attempt', driver + recovery + companion, 'shared Seed repair sentence'],
  ['Verification repair marker', 'Record a verification repair', gate, 'shared Verification repair marker sentence'],
  ['Companion row record', 'Record the <repo> result for acceptance row <n>', companion, 'shared Companion row record or Companion seed record sentence'],
  ['Companion seed record', 'Record the <repo> baseline', companion, 'shared Companion row record or Companion seed record sentence'],
  ['Verification-produced changes', 'Keep the changes the verification run produced', gate, 'shared Verification-produced changes sentence'],
];

for (const [event, subject, instructions, citation] of bookkeeping) {
  test(`bookkeeping wording: ${event}`, () => {
    const fixed = wording.split('### Fixed bookkeeping sentences\n')[1].split('\n## Squash-default note')[0];
    assert.equal(fixed.split('\n').filter(line => line.startsWith(`| ${event} |`)).length, 1);
    assert.ok(fixed.includes(`| ${event} | \`${subject}\` |`));
    assert.ok(instructions.includes(citation), citation);
    assert.ok(wording.includes('Use these subjects verbatim, substituting only the named values.'));
    assert.ok(wording.includes('Put no ticket reference on ledger bookkeeping commits.'));
  });
}

test('bookkeeping writers resolve the shared wording file instead of a local template', () => {
  for (const path of [
    'skills/gauntlet/implement/loop/loop.md',
    'skills/gauntlet/implement/loop/coordinated-legs.md',
    'skills/gauntlet/implement/loop/interrupted-recovery.md',
    'skills/gauntlet-resume/reference/plan-repair.md',
    'skills/gauntlet/amendment-surface.md',
  ]) {
    const file = new URL(path, root);
    const text = readFileSync(file, 'utf8');
    const link = text.match(/\[commit-message\.md\]\(([^)]+)\)/);
    assert.ok(link, path);
    assert.equal(readFileSync(new URL(link[1], file), 'utf8'), wording, path);
  }
  assert.ok(wording.includes('Keep `pending:` lines, `iteration:` lines, ledger rows and decision lines out of it.'));
});

test('row and seed repairs append decisions on both validation misses and interruptions', () => {
  const admission = driver.split('\n## Validate the return\n')[1].split('\n## Unreachable returns\n')[0];
  for (const [text, decision, citation] of [
    [admission, 'repair row <n> | <concrete miss> | iteration <consumed>', 'shared Row repair sentence'],
    [admission, 'repair seed | seed miss: <concrete miss> | iteration <consumed>', 'shared Seed repair sentence'],
    [recovery, 'repair row <n> | interrupted - <reason> | iteration <consumed>', 'shared Row repair sentence'],
    [recovery, 'repair seed | seed interrupted: <reason> | iteration <consumed>', 'shared Seed repair sentence'],
    [companion, 'repair row <n> | <miss> | iteration <consumed>', 'shared Row repair sentence'],
    [companion, 'repair seed | seed miss: <concrete miss> | iteration <consumed>', 'shared Seed repair sentence'],
  ]) {
    const paragraph = text.split('\n').find(line => line.includes(`\`${decision}\``));
    assert.ok(paragraph, decision);
    assert.match(paragraph, /[Aa]ppend /);
    assert.ok(paragraph.indexOf(citation) > paragraph.indexOf(decision), citation);
  }
  assert.ok(driver.includes('repair row <n>` lines'));
  assert.ok(driver.includes('Count seed attempts as `repair seed` lines in the home ledger'));
});

test('verification repair markers append their ledger decisions for admitted and interrupted repairs', () => {
  for (const decision of [
    'repair verification | <repo> <child sha7> | iteration <consumed>',
    'repair verification | <repo> interrupted - <reason> | iteration <consumed>',
  ]) {
    const at = gate.indexOf(`\`${decision}\``);
    assert.ok(at >= 0, decision);
    assert.match(gate.slice(at - 20, at), /append $/i);
    assert.match(gate.slice(at + decision.length + 2), /^\. Commit with the shared Verification repair marker sentence| and commit with the shared Verification repair marker sentence/);
  }
  assert.ok(gate.includes('stage only the ledger with saved row cells, saved `returned:`, the already-consumed iteration and no `pending:`'));
});

test('ledger amendments and cuts append one decision and use the patterned amendment subject', () => {
  assert.ok(wording.includes('| Amendment commit | `Amend the spec for <first item title, shortened to fit>`, adding ` and <N-1> more` for N > 1 within the subject limit |'));
  const decision = 'amended | <cut row n, or N item(s)> | <first item title>';
  assert.ok(stop.includes(`Append \`${decision}\` and commit spec + ledger with the shared amendment source.`));
  assert.ok(amendment.includes(`Append one \`${decision}\` decision to the ledger, using \`cut row n\` only for a single-cut batch.`));
  assert.ok(amendment.includes('Commit spec + ledger together using the shared amendment message below'));
  assert.ok(amendment.includes('compose one commit per batch from its Amendment commit row, including ledger cuts and human-selected spec dispositions'));
  assert.ok(driver.includes('Retry, cut, amend, raise-allowance and escalate commits never clear the tuple.'));
});

test('verification repairs reserve and consume the shared allowance across legs and resume', () => {
  assert.ok(Buffer.byteLength(driver) < 50_000);
  assert.match(companion, /Route `pending: verify` through.*After the loop step 1/);
  assert.match(restoreLoop, /For `pending: verify`, use After the loop step 1's repair contract/);
  for (const token of [
    'repairs < allowance', 'current failing test names or assertion lines match',
    'ignore timings', 'Never decide from gate index and exit code alone', 'Count `repairs` as `repair verification` lines in the home ledger',
    'plus one for a `pending: verify` tuple on disk',
    'pending: verify | <repo> | <HEAD>', 'on disk before dispatch',
    'repairs: <k> of <allowance>', 'no per-row retry increments',
    'Remove `pending:` only in the parent repair marker',
    'exact pending tuple and consumed `iteration:`',
  ]) assert.ok(gate.includes(token), token);
  assert.doesNotMatch(gate, /once per flow|one repair below|Never repair again for another leg|spent identity/);
});

test('interrupted verification repairs clean both boundaries and consume only the reserved repair', () => {
  for (const token of [
    '## Interrupted recovery steps 1-2', 'all ledger rows, attempts, mapping, allowance, `returned:` and prior decisions unchanged',
    'exactly one empty repair marker in home (no repair code)', 'already-consumed iteration',
    "loop-<failing leg's base SHA>-<pre-bump iteration>.jobs",
    'reset home to the saved home HEAD', 'no second bump',
    'non-empty `status --porcelain` after reset blocks neither the marker nor the rerun',
    "Rerun the failing checkout's gate pairs once",
    'still-unexecuted pairs from other checkouts', 'Never spend verify-phase credits',
    'failure pass with the verification repair count',
  ]) assert.ok(gate.includes(token), token);
  assert.doesNotMatch(gate, /provenance|ownership|no-launch|recovery-incomplete|action-spend|accounting|after owned jobs exit and the boundary is clean/);
});

test('verification reset or marker failure repeats within the same allowance before any dispatch', () => {
  for (const token of [
    'rev-parse HEAD', 'step 3 commit is not written', 'dispatch nothing',
    'run steps 2-3 again from the saved copy', 'verification repair count',
    'held with the saved copy while no commit can land',
    'ledger-only repair commit lands on `HEAD_BEFORE`',
    'existing row, seed or verification exhaustion stop',
    "never use any other HEAD as the next dispatch's `HEAD_BEFORE`",
  ]) assert.ok(recovery.includes(token), token);
});
