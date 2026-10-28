bundle-: skills/writing-plans/reference/plan-contract.md

# Input

Worktree /work/app. Approved spec /work/app/doc/specs/timeout.md. Plan /work/app/doc/plans/timeout.md. Skill /opt/pi/skills/writing-plans/SKILL.md and contract /opt/pi/skills/writing-plans/reference/plan-contract.md. Phase plan is in_progress, substep plan-write. You dispatched plan-writer per step 3; it returned `OPEN QUESTIONS /work/app/doc/plans/timeout.md`. Parent plan_check returns FAIL with open-questions naming the row and baseline-line naming the missing bullet. The plan starts:

## Open Questions
- Task 1: `node --test tests/timeout.test.ts` fails on def5678 (exit 1): existing timeout lookup failed
  ```text
  tests 1, pass 0, fail 1: existing timeout lookup failed
  ```

The task's Tests command is node --test tests/timeout.test.ts. No human choice has arrived. Narrate the parent handling through the pause.

Produce only the user-facing recovery question, not a narrated procedure.
