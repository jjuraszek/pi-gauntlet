bundle+: skills/gauntlet-resume/reference/brief-contract.md
# Input

Brief process state (verbatim from the brief):

Phases:
  ⊘ brainstorm (resume: doc/specs/2026-03-16-rate-limit-header.md)
  ⊘ plan (resume: brief)
  → implement
  ○ verify
  ○ ship
Plan:
  ✓ [1] W1: Emit the rate-limit header
  → [2] W2: Read the header in the client
Active task: W2: Read the header in the client

Resolved paths: worktree /work/app/.worktrees/rate-limit; plan doc/plans/2026-03-16-rate-limit-header.md; spec doc/specs/2026-03-16-rate-limit-header.md. The plan has exactly two tasks. The plan commit exists (0c1d2e3).

Tool results, in order:

1. `git -C /work/app/.worktrees/rate-limit ls-files --error-unmatch -- doc/plans/2026-03-16-rate-limit-header.md` -> exit 0.
2. `git -C /work/app/.worktrees/rate-limit status --porcelain -- doc/plans/2026-03-16-rate-limit-header.md` -> prints nothing.
3. `plan_check({ planPath: "/work/app/.worktrees/rate-limit/doc/plans/2026-03-16-rate-limit-header.md" })` ->
   FAIL (1 findings)
   table-closure @ line 98: row owner Task 3: no such task exists

Narrate what resume does from tool result 3 onward.
