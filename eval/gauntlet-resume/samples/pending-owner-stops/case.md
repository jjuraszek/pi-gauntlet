bundle+: skills/gauntlet-resume/reference/brief-contract.md
# Input

Brief process state (verbatim from the brief):

Phases:
  ⊘ brainstorm (resume: doc/specs/2026-03-09-retire-legacy-parsers.md)
  ⊘ plan (resume: brief)
  → implement
  ○ verify
  ○ ship
Plan:
  ✓ [1] W1: Inventory legacy parsers
  ✓ [2] W1: Delete legacy/parsers tree
  ✓ [3] W1: Delete legacy/fixtures tree
  → [4] W2: Point imports at the new parser
  ○ [5] W3: Update the parser guide
Active task: W2: Point imports at the new parser

Resolved paths: worktree /work/app/.worktrees/retire-legacy; plan doc/plans/2026-03-09-retire-legacy-parsers.md; spec doc/specs/2026-03-09-retire-legacy-parsers.md. The plan commit exists (d4e5f6a).

Tool results, in order:

1. `git -C /work/app/.worktrees/retire-legacy ls-files --error-unmatch -- doc/plans/2026-03-09-retire-legacy-parsers.md` -> exit 0.
2. `git -C /work/app/.worktrees/retire-legacy status --porcelain -- doc/plans/2026-03-09-retire-legacy-parsers.md` -> prints nothing.
3. `plan_check({ planPath: "/work/app/.worktrees/retire-legacy/doc/plans/2026-03-09-retire-legacy-parsers.md" })` ->
   FAIL (1 findings)
   paths-exist @ line 143: Modify: path "docs/parsers.md" does not exist
   The row sits in the Files block of Task 5 (W3: Update the parser guide).
4. `git -C /work/app/.worktrees/retire-legacy log --diff-filter=D --format=%h -1 -- docs/parsers.md` -> prints 9f8e7d6.

Narrate what resume does from tool result 3 onward.
