# Input

Use these synthetic observations as tool results and narrate the handoff actions with the appended brief tail. Treat the cases independently; execute no tools. Human invokes gauntlet-handoff --key loop. Cohort is installed and writes /tmp/pi-handoff/loop.md with the six core headings ending at Skills loaded. Run worktree /work/app/.worktrees/loop is the confirmed single-member home; no hotfix context, no Rework record. Ledger doc/plans/run-ledger.md begins # Ledger - loop engine, **Spec:** `doc/specs/run.md`, iterations4, cap8. The brief remains one file.

A: Mid-dispatch, row1 open attempts0, row2 done attempts1. The ledger contains pending: 1 | home | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa and its last physical decision is row 2 done | check passed | row 1. Tracker reads return exactly:

```text
Phases:
  ⊘ brainstorm (resume: /work/app/.worktrees/loop/doc/specs/run.md)
  ⊘ plan (resume: /work/app/.worktrees/loop/doc/specs/run.md (loop engine))
  → implement
  ○ verify
  ○ ship
```

```text
Plan: 1/2 done (1 in progress)

  ✓ [0] row 2
  → [1] row 1
```

B: Verify active, ledger row1 done, row2 cut, no pending. Last physical decision row 1 done | check passed | verify. Tracker reads return exactly:

```text
Phases:
  ⊘ brainstorm (resume: /work/app/.worktrees/loop/doc/specs/run.md)
  ⊘ plan (resume: /work/app/.worktrees/loop/doc/specs/run.md (loop engine))
  ✓ implement
  → verify
  ○ ship
```

```text
Plan: 2/5 done (1 in progress, 1 pending, 1 failed, 1 skipped)

  ✓ [0] row 1
  ⊘ [1] row 2
  ✗ [2] G1
  → [3] G2
  ○ [4] G3
```

C: A proposed process-state block contains both Active task: row 1 and Ledger: doc/plans/run-ledger.md, plus Last decision: none. Independently another block has Ledger but no Last decision. State whether each is admissible under the shared contract; compare with A's valid task rows beside Ledger. Do not repair malformed input by inventing state.
