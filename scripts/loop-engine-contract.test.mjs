import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { STAGE_SKILL_DIRS, lintStageSkillDirs } from './stage-skill-lint.mjs';
const root = new URL('../', import.meta.url);
test('driver dispatch matches fresh persona and durable ledger contract', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const persona = readFileSync(new URL('agents/loop-implementer.md', root), 'utf8');
  for (const field of ['iteration', 'spec', 'ledger', 'base', 'target', 'previous decision', 'hint']) {
    assert.ok(driver.includes(`${field}:`), field);
    assert.ok(persona.includes(field), field);
  }
  for (const token of ['context: "fresh"', 'async: false', 'outputMode: "file-only"', 'the parent validates the ledger and the commit', '# Ledger - loop engine', 'iterations: 0', 'loop: repair row', 'whole-diff minors:', 'audited-base:', 'plan_check']) assert.ok(driver.includes(token), token);
  const steps = ['## Before each dispatch', '## Dispatch', '## Validate the return', '## Exit verification', '## After the loop'];
  for (let i = 1; i < steps.length; i++) assert.ok(driver.indexOf(steps[i]) > driver.indexOf(steps[i - 1]), steps[i]);
  const continuation = driver.slice(driver.indexOf('## After the loop'));
  assert.ok(driver.indexOf('action: "complete", phase: "implement"') < driver.indexOf('## After the loop'));
  assert.ok(continuation.indexOf('whole-diff `code-reviewer`') < continuation.indexOf('separate fresh `conformance-reviewer`'));
  for (const fact of ['3 + funded N', 'latest `row <n> retry`', 'Two consecutive validation misses', 'only `open` -> `done`', 'attempts +1', 'Exactly one NEW', 'spent < N', 'no reopening and no automatic rerun', 'No task reopen/update is awaited']) assert.ok(driver.includes(fact), fact);
  assert.match(driver, /Count empty child commits and validation misses only after the latest `loop: retry row <n>` commit\. Funding alone resets neither window\. Preserve every row's attempts and the total iteration cap\./);
  assert.match(driver, /Select `seed` until a validated `loop: seed evidence` commit with its `row 0 done` decision and evidence on every non-cut row survives on the branch, independently of `iterations`/);
  assert.match(driver, /Validate by dispatched `target`, not iteration number/);
  assert.match(driver, /For `target: seed`, explicitly instruct the child to apply its seed contract even when iteration is greater than 0/);
  assert.doesNotMatch(driver, /Select `seed` at iteration 0; otherwise/);
  assert.match(persona, /defaultContext: fresh/);
  assert.match(persona, /completionGuard: true/);
  assert.doesNotMatch(persona.split('---')[1], /^(model|thinking):/m);
  assert.ok(persona.includes('semicolons'));
  assert.ok(persona.includes('Escape pipes'));
  assert.ok(driver.split('\n').length < 500);
  assert.doesNotMatch(driver, /plan_tracker\(.*init|worktree: true|model:\s/);
  assert.ok(STAGE_SKILL_DIRS.includes('skills/loop-implementation'));
  assert.deepEqual(lintStageSkillDirs(root.pathname, ['skills/loop-implementation']), []);
});
