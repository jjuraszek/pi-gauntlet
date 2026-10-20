bundle+: skills/gauntlet-resume/reference/brief-contract.md
# Input

Brief process state:

Phases:
  ⊘ brainstorm (resume: spec)
  ⊘ plan (resume: brief)
  ⊘ implement (resume: brief)
  → verify
  ○ ship
Plan: 2/2 done (0 in progress, 0 pending)
  ✓ [0] W1: Parse options
  ✓ [1] W1: Validate options
Active task: none

Resolved paths: worktree /work/demo/.worktrees/options; spec /work/demo/.worktrees/options/doc/specs/options.md; plan /work/demo/.worktrees/options/doc/plans/options.md. Brief is pasted. The plan predates baseline bullets and has none. It is tracked and clean. No landed fix is named. Entry checks passed and restore has armed the flow, skipped brainstorm, and started plan.

Observed results in order:
1. Parent plan_check on the resolved plan -> FAIL (2 findings): baseline-line: Task 1: command `node --test test/parse.test.mjs` has no baseline: bullet; baseline-line: Task 2: command `node --test test/validate.test.mjs` has no baseline: bullet.
2. A fresh foreground plan-writer dispatched for rerun baseline returns `PLAN WRITTEN`; it ran both commands and generated passing baseline bullets without changing task identities or order.
3. Parent plan_check on the same plan -> PASS.
4. All remaining tracker calls succeed.

Narrate from result 1 through the restore closing line. Include the plan-writer dispatch arguments and exact tracker initialization payload. Do not invent baseline SHAs or runs in the parent.
