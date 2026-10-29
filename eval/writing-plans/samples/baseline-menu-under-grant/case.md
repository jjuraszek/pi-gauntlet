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

Narrate only these independent variants from that starting state. In each, the evidence supports the supplied recommendation and no human reply has arrived:

- Variant A: `Recommendation: narrow hook-config - only config coverage is relevant`.
- Variant B: `Recommendation: amend - correct the config requirement within its component`.
- Variant C: `Recommendation: fix-first - isolate the existing base failure`.
- Variant D: `Recommendation: none - no justified route`.
- Variant E: `Recommendation: narrow - no concrete filter known`.

Keep each variant to at most a short paragraph and the whole reply under 800 words.
