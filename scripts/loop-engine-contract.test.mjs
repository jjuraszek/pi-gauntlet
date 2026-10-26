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

test('ledger cap is durable across grants, child validation and legacy admission', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  assert.match(driver, /iterations: 0\ncap: <n>/);
  for (const fact of ['maxIterationsPerRow', '`iterations` >= `cap`', 'loop: raise cap', 'ledger has no cap: line - seeded under the old loopEngine contract', 'latest operational `row <n> ...` decision', 'including cap', 'cap +50 |', '[1-9][0-9]*', 'cap +50x', 'separate replies', 'cap grant resets neither window']) assert.ok(driver.includes(fact), fact);
  const entry = driver.split('## Entry')[1].split('## Before each dispatch')[0];
  assert.match(entry, /\(rows not initialized cut\) \* maxIterationsPerRow \+ 1/);
  assert.match(entry, /Later cuts, reopens and requirement-preserving amendments leave cap unchanged/);
  assert.doesNotMatch(entry, /`maxIterations`/);
  const stop = driver.split('## Human stop')[1].split('## After the loop')[0];
  for (const token of ['durable iterations + N', 'leaving iterations and all attempts unchanged', 'return to the ordered table', 'a second invalid reply holds the same stop with no commit', 'Only retry starts new windows']) assert.ok(stop.includes(token), token);
  assert.match(driver, /dirty-tree and commit-boundary stops.*never offer `cap \+N`/);
  assert.match(driver, /before.*rule 1/);
  assert.match(driver, /every stop.*Preserve every row's attempts and the total iteration cap\./);
});
