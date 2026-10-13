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
   FAIL (400 findings)
   paths-exist @ line 61: Modify: path "legacy/parsers/csv_v1.py" does not exist
   paths-exist @ line 62: Modify: path "legacy/parsers/csv_v2.py" does not exist
   paths-exist @ line 63: Modify: path "legacy/parsers/xml_v1.py" does not exist
   ... 397 more findings of the same shape: 200 under Task 2 (`legacy/parsers/...`) and 197 under Task 3 (`legacy/fixtures/...`). Every row sits in the Files block of Task 2 or Task 3.
4. `git -C /work/app/.worktrees/retire-legacy log --diff-filter=D --format=%h -1 -- <p>` -> prints one hash for every one of the 400 paths.
5. The second `plan_check` call on the same path -> PASS.
6. Every git and tracker call you make after that succeeds (exit 0).

Narrate the restore from tool result 3 to the closing line.
