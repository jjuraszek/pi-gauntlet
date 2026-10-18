# Input

Approved spec: /work/app/.worktrees/rate-limit/doc/specs/2026-03-16-rate-limit-header.md. Worktree: /work/app/.worktrees/rate-limit. Skill files: /opt/pi/skills/writing-plans/SKILL.md and /opt/pi/skills/writing-plans/reference/plan-contract.md. `phase_tracker` status: brainstorm complete, plan in_progress (just started). No plan file exists yet. Overrides file: none.

Tool results, in order, as you call them:

1. The `plan-writer` dispatch returns `PLAN WRITTEN /work/app/.worktrees/rate-limit/doc/plans/2026-03-16-rate-limit-header.md`.
2. `plan_check({ planPath: "/work/app/.worktrees/rate-limit/doc/plans/2026-03-16-rate-limit-header.md" })` returns `PASS — plan verified and stamped for implement-start`.
3. Reading the plan shows `## Wave 1 — Server` with `### Task 1: Emit the rate-limit header` and `### Task 2: Count requests per key`, then `## Wave 2 — Client` with `### Task 3: Read the header in the client`, and no `## Open Questions` section.

Narrate what you do from the start of the plan phase through the `plan_tracker` init.
