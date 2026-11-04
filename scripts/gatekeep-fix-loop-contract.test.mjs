import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('row budgets stop exhausted retries and escalate once before dispatch', () => {
  const fixWave = readFileSync(new URL('skills/gatekeep-pr/reference/fix-wave.md', root), 'utf8');
  const budgets = fixWave.split('\n### Budgets\n')[1]?.split('\n### Row dispatch\n')[0];
  assert.ok(budgets, 'apply row budgets before dispatch');
  for (const token of [
    'attempts >= allowance', 'two consecutive validation misses', 'repair.rounds_cap',
    'whichever binds first', 'open - <last decision line>', 'Continue other eligible rows',
    'stuck - no progress: row <n> exhausted (<ids>)', 'Preserve attempts',
    'threshold = min(escalateAfter, allowance - 1)', 'attempts >= threshold',
    'row <n> escalated', 'model: <implModel>', 'that attempt only',
    'stuck - escalationLoop.implModel unavailable', 'leave attempts and the ledger unchanged',
  ]) assert.ok(budgets.includes(token), `row budgets require ${token}`);
  const dispatch = fixWave.split('\n### Row dispatch\n')[1].split('\n### Admission\n')[0];
  assert.match(dispatch, /Apply Budgets before changing the ledger/);
  const findings = readFileSync(new URL('skills/gatekeep-pr/reference/findings.md', root), 'utf8');
  assert.match(findings, /open - <last decision line>/);
});

test('review closure aggregates required ids once per row before carried retries', () => {
  const fixWave = readFileSync(new URL('skills/gatekeep-pr/reference/fix-wave.md', root), 'utf8');
  const review = fixWave.split('\n## Review before push\n')[1].split('\n## Re-review task\n')[0].replaceAll('\\|', '|');
  for (const token of [
    'checkpoint ends with `counted` false',
    'evaluate each ledger row once over all its required ids',
    'every contributor P#/L# id', 'every selected nit id',
    '`open - <why>` or has no closure line', 'status `failed`, attempts unchanged',
    'row <n> reopened | review: <unresolved ids> - <why> | <reviewer\'s why>',
    '200 characters', 'next `previous decision`',
    'All required ids read `resolved`', 'Keep it `done` and dispatch nothing',
    'same row as the next carried-set retry target',
  ]) assert.ok(review.includes(token), `review aggregation requires ${token}`);
  assert.doesNotMatch(review, /When HEAD equals `pre_wave_head`/);
});

test('finding artifacts index each selected blocker and one complete nit batch', () => {
  const fixWave = readFileSync(new URL('skills/gatekeep-pr/reference/fix-wave.md', root), 'utf8');
  const artifacts = fixWave.split('\n### Finding artifacts\n')[1]?.split('\n### Shared worker context\n')[0];
  assert.ok(artifacts, 'create finding artifacts before worker context and dispatch');
  for (const token of [
    '<record path>-spec.md', '<record path>-ledger.md',
    'one AC per selected file blocker finding, in review order',
    'every contributor P#/L# id', 'symptom, location, failing test or `no scoped test`',
    'one final `fix nits` AC holding every selected nit id and text',
    'PR title and body verbatim', 'scope.original_intent', 'authoritative scope contract',
    '# Ledger - loop engine', '**Spec:**', 'base: <MB>',
    'verification: <resolved verification command or none>', 'checks: commands',
    'iterations: 0', 'allowance: <maxIterationsPerRow>',
    '| row | status | attempts | evidence |', '| <n> | open | 0 | |',
    '## Leg mapping', '| <n> | <n> | gatekeep |', '## Decisions',
    'row n indexes AC n', 'gauntlet_setting({ key: "loopEngine" })',
    'escalateAfter', 'gauntlet_setting({ key: "escalationLoop" })', 'implModel',
    'union of its payloads', 'append its AC before adding its ledger row and mapping',
  ]) assert.ok(artifacts.includes(token), `finding artifacts require ${token}`);
  assert.match(artifacts, /Description-target and reply payloads never become ACs or ledger rows/);
  assert.match(artifacts, /missing tool.*never guess/);
  assert.match(fixWave, /settle only per-pass wave fields; retain `repair\.wave\.spec` and `repair\.wave\.ledger` and all row history until terminal teardown/);
  for (const path of ['post-selection-loop.md', 'batch.md']) {
    const owner = readFileSync(new URL(`skills/gatekeep-pr/reference/${path}`, root), 'utf8');
    for (const token of ['repair.wave.spec', 'repair.wave.ledger', 'missing', 'stuck - run record unreadable']) {
      assert.ok(owner.includes(token), `${path} must retain and validate finding artifact ${token}`);
    }
  }
});

test('admission preserves failed companion work and charges only ordinary source results', () => {
  const fixWave = readFileSync(new URL('skills/gatekeep-pr/reference/fix-wave.md', root), 'utf8');
  const admission = fixWave.split('\n### Admission\n')[1]?.split('\n## Review before push\n')[0];
  const persona = readFileSync(new URL('agents/loop-implementer.md', root), 'utf8');
  const companion = persona.split('\n## Companion result commit\n')[1]?.split('\n## Boundaries\n')[0];
  assert.ok(admission && companion);
  // Pin the caller's admission checks to the unchanged companion wire contract.
  for (const token of ['pending:', 'iteration:', 'loop: row <n> <status>', 'target first', 'attempts unchanged']) {
    assert.ok(companion.includes(token), `persona companion requires ${token}`);
  }
  assert.match(companion, /target, attempts \+1 and status done\/failed/);
  assert.ok(admission.includes('loop: row <n> <done|failed>'), 'both done and failed are admitted subject statuses');
  for (const [workerRule, callerRule] of [
    ['leave the home ledger untouched', 'writing its row and extras to the external ledger'],
    ['table rows without a header', 'without a header'],
    ['at most three semicolon-separated result lines', 'at most three result lines'],
    ['commit exactly once', 'exactly one new commit'],
    ['check clean status', 'Require a clean tree'],
  ]) {
    assert.ok(companion.includes(workerRule), `persona result requires ${workerRule}`);
    assert.ok(admission.includes(callerRule), `caller admits ${callerRule}`);
  }
  assert.match(admission, /target attempts = saved attempts \+ 1/);
  assert.match(admission, /writing its row and extras.*appending its decision lines.*clearing `pending:`/);
  assert.match(admission, /Keep failed partial work and tests on the branch/);
  assert.match(admission, /Charge no round for an admitted failed `needs <what>` or `contract exception: <why>` decision/);
  assert.match(admission, /independent ordinary source-changing result in the same pass still charges once/);
  assert.match(admission, /reconcile.*same checks and round-charge exceptions/);
  const dispatch = fixWave.split('\n### Row dispatch\n')[1].split('\n### Admission\n')[0];
  for (const token of ['iteration', 'spec', 'ledger', 'base', 'target', 'previous decision', 'hint', 'Leg:', 'Rules:', 'mapped original AC', 'pending:']) {
    assert.ok(dispatch.includes(token), `caller supplies persona input ${token}`);
    assert.ok(persona.includes(token), `persona consumes caller input ${token}`);
  }
});

test('shared context leaves solution and commit contracts to each harness tail', () => {
  const fixWave = readFileSync(new URL('skills/gatekeep-pr/reference/fix-wave.md', root), 'utf8');
  const context = fixWave.split('\n### Shared worker context\n')[1].split('\n### Budgets\n')[0];
  const [shared, tails] = context.split('Append only the matching harness tail:');
  assert.doesNotMatch(shared, /re-solve|apply the payload|commit|reply/i);
  const pi = tails.split('| pi |')[1].split('\n')[0];
  const claude = tails.split('| Claude Code |')[1].split('\n')[0];
  assert.match(pi, /choose the fix/);
  assert.match(pi, /commit and reply.*Companion result commit/);
  assert.match(claude, /Apply the course-authorized drafted payload/);
  assert.match(claude, /Commit once/);
  assert.match(claude, /return `open/);
});

test('pi file findings dispatch companion loop rows while sync keeps implementer helpers', () => {
  const fixWave = readFileSync(new URL('skills/gatekeep-pr/reference/fix-wave.md', root), 'utf8');
  const sync = fixWave.split('\n## Sync\n')[1].split('\n## Wave\n')[0];
  const wave = fixWave.split('\n## Wave\n')[1].split('\n## Review before push\n')[0];
  for (const token of [
    'agent: "loop-implementer"', 'target: <row>', 'Leg: gatekeep', 'pending:',
    'acceptance:', 'level: "none"', 'context: "fresh"', 'async: false',
    'iteration: <i>', 'spec: <absolute derived spec>', 'ledger: <absolute ledger>',
    'base: <MB>', 'previous decision:', 'mapped original AC:', 'SCOPED_TEST_COMMANDS:',
    'outputMode: "file-only"', 'HEAD_BEFORE', 'iteration: <i + 1>',
    'Companion result commit',
  ]) assert.ok(wave.includes(token), `pi file-finding dispatch requires ${token}`);
  assert.doesNotMatch(wave, /For each file payload[^\n]*dispatch one fresh implementer/);
  assert.match(sync, /fresh conflict-stop implementer/);
  assert.match(sync, /fresh implementer to merge/);
  const review = fixWave.split('\n## Review before push\n')[1].split('\n## Re-review task\n')[0];
  assert.doesNotMatch(review, /fresh implementer/);
  assert.match(review, /Row dispatch/);
  const skill = readFileSync(new URL('skills/gatekeep-pr/SKILL.md', root), 'utf8');
  assert.match(skill, /`loop-implementer` for file findings/);
  assert.ok(readFileSync(new URL('scripts/ci.mjs', root), 'utf8').includes('R("scripts/gatekeep-fix-loop-contract.test.mjs")'));
  for (const path of [
    'skills/gatekeep-pr/reference/batch.md',
    'skills/gatekeep-pr/reference/post-selection-loop.md',
    'skills/gatekeep-pr/reference/findings.md',
    'agents/pr-gatekeeper.md',
  ]) assert.match(readFileSync(new URL(path, root), 'utf8'), /loop-implementer/, `${path} must route file findings to the row worker`);
});
