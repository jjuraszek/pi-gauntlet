# Code Quality Reviewer Prompt Template

Use this template when dispatching a code quality reviewer subagent.

**Purpose:** Verify implementation is well-built (clean, tested, maintainable)

**Only dispatch after spec compliance review passes.**

```
Dispatch one code-reviewer for the code-touching wave:
  planPath: [absolute plan path]
  anchor: "### Task N:"
  anchors: [use instead of anchor for all tasks in the wave]
  Spec: [absolute authoritative home spec path]
  Work from: [integrated review checkout]
  Implementer reports: [saved report paths]
  BASE_SHA: [WAVE_BASE_SHA recorded before worker dispatch]
  HEAD_SHA: [the literal WORKTREE for the integrated wave, including re-reviews]
  SCOPED_TEST_COMMANDS: [dispatch-supplied union of scoped command values verbatim | none]

  Read the selected task sections, Spec anchors, Tests:/via: and Files: Create:/Test: paths yourself. Derive Rules from the task and home-spec leg as your persona directs. Read the implementer reports by path; verify against the integrated diff.
  Keep the report layout and emit structured output matching the persona contract, verdict and footer, including behaviourChange on every report. On an unreadable plan/anchor report REJECT with anchorUnreadable and the required Reasoning line.
```

**In addition to standard code quality concerns, the reviewer should check:**
- Does each file have one clear responsibility with a well-defined interface?
- Are units decomposed so they can be understood and tested independently?
- Is the implementation following the file structure from the plan?
- Did this implementation create new files that are already large, or significantly grow existing files? (Don't flag pre-existing file sizes — focus on what this change contributed.)

Keep inline callers of `../requesting-code-review/code-reviewer.md` unchanged; this local template carries the anchored SDD wave contract.

## Re-review: trajectory verdict

Include the following in the reviewer's task text on every re-review, after
the prior review report path under a
`## Previous review report (re-review trigger)` heading.
Read the saved report yourself; retain the supplied `## Fix delta` block:

If your task contains a "Previous review report (re-review trigger)" section
and you found issues, append exactly one more line after `Behaviour-change:` — this
line, not `Behaviour-change:`, is the true final line of the report:

TRAJECTORY: CONVERGING (<n_prev> -> <n_now>, max severity <X>)
TRAJECTORY: DIVERGING
TRAJECTORY: STAGNANT (repeat of: <finding>)

Pick the first label that applies, in this order:

1. STAGNANT: a previous Critical or Moderate finding survives materially unchanged - name it.
   (e.g. the same unchecked error path flagged last round is still unchecked)
2. DIVERGING: <n_now> >= <n_prev>, or the fix introduced a new Critical or Moderate finding.
   (e.g. 3 findings fixed but the fix broke an import: DIVERGING, not CONVERGING)
3. CONVERGING: otherwise - the Critical/Moderate count fell, no new Critical or
   Moderate appeared, and every surviving Critical or Moderate was materially improved.

<n_prev>/<n_now> count Critical and Moderate findings only; Minors - ride-along
Minors declined or unchanged, and `(outside fix delta)` downgrades alike - never
move the `TRAJECTORY:` line. <X> is the highest remaining severity. For this line the severity set is
exactly Critical/Moderate/Minor, regardless of the vocabulary used elsewhere in
your report.

The orchestrator dispatches one extra fix only when this line says CONVERGING
without "max severity Critical" - be accurate, not generous.

If you found no issues, report success as usual and omit this line.
First reviews (no previous-report section) omit this line.
