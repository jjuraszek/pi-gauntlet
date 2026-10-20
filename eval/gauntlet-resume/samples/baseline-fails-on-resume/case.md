bundle+: skills/gauntlet-resume/reference/brief-contract.md
# Input

Brief process state:

Phases:
  ⊘ brainstorm (resume: spec)
  ⊘ plan (resume: brief)
  → implement
  ○ verify
  ○ ship
Plan: 0/1 done (1 in progress, 0 pending)
  → [0] W1: Parse options
Active task: W1: Parse options

Resolved paths: worktree /work/demo/.worktrees/options; spec /work/demo/.worktrees/options/doc/specs/options.md; plan /work/demo/.worktrees/options/doc/plans/options.md. Brief is pasted. Entry checks passed; restore armed the flow, skipped brainstorm and started plan. The plan is tracked and clean. No landed fix is named.

Observed results in order:
1. Parent plan_check -> FAIL (1 findings): open-questions: plan has open questions: - Task 1: `node --test test/parse.test.mjs` fails on abc1234 (exit 1): expected valid options.
2. A fresh foreground plan-writer dispatched for rerun baseline returns `OPEN QUESTIONS /work/demo/.worktrees/options/doc/plans/options.md`. The plan's Open Questions still contains exactly the same failure row; the rerun failed again on abc1234 with exit 1.
3. Parent plan_check -> FAIL (1 findings): open-questions: plan has open questions: - Task 1: `node --test test/parse.test.mjs` fails on abc1234 (exit 1): expected valid options.

Narrate from result 1 to the end of this turn. No human has selected an option. Include every dispatch and tracker mutation you make.
