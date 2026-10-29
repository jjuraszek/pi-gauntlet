bundle-: skills/writing-plans/reference/plan-contract.md
bundle+: skills/brainstorming/reference/amendment-surface.md

# Input

Worktree /work/app. Approved spec /work/app/doc/specs/hook.md. Plan /work/app/doc/plans/hook.md. Skill /opt/pi/skills/writing-plans/SKILL.md and contract /opt/pi/skills/writing-plans/reference/plan-contract.md. Phase plan is in_progress, substep plan-write. You dispatched plan-writer per step 3; it returned `OPEN QUESTIONS /work/app/doc/plans/hook.md`. Parent plan_check returns FAIL with open-questions naming the row and baseline-line naming the missing bullet. The plan starts:

## Open Questions
- Task 1: `node --test tests/hook.test.ts` fails on abc1234 (exit 1): existing config resolution failed
  ```text
  tests 1, pass 0, fail 1: existing config resolution failed
  ```

The task's Tests command is node --test tests/hook.test.ts. The approved spec header contains `**Amend-grant:** auto-apply amends`. No human choice has arrived.

Narrate only variant F, amendment re-entry: the parent has applied one item, dispatched plan-writer with Amend and In-flight, and checked its return. The unchanged Task 1 command fails on abc1234 with the same assertion, unrelated to the batch edit. Recommendation is narrow hook-config. No repeated evidence or dirty paths exist. Narrate continuation and contrast a test-dirtied protected plan path, repeated already-applied evidence, and a third aftermath item. Attempts and iteration/cap budget are unchanged; no recommendation buys retries.

Keep the continuation and each contrast to at most a short paragraph and the whole reply under 800 words.
