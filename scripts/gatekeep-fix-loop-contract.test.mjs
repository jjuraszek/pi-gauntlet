import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);

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
