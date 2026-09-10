# Code Quality Reviewer Prompt Template

Use this template when dispatching a code quality reviewer subagent.

**Purpose:** Verify implementation is well-built (clean, tested, maintainable)

**Only dispatch after spec compliance review passes.**

```
Dispatch a subagent with the code-reviewer template:
  Use the template at ../requesting-code-review/code-reviewer.md

  DESCRIPTION: [task summary, from implementer's report]
  PLAN_OR_REQUIREMENTS: Task N from [plan-file]
  BASE_SHA: [commit before task]
  HEAD_SHA: [current commit]
  SCOPED_TEST_COMMANDS: [the consuming task's Tests: commands; wave reviews: the union of the wave's tasks' Tests: commands; `none` for the whole-diff verify-phase review]
```

**In addition to standard code quality concerns, the reviewer should check:**
- Does each file have one clear responsibility with a well-defined interface?
- Are units decomposed so they can be understood and tested independently?
- Is the implementation following the file structure from the plan?
- Did this implementation create new files that are already large, or significantly grow existing files? (Don't flag pre-existing file sizes — focus on what this change contributed.)

**Code reviewer returns:** Strengths, Issues (Critical/Moderate/Minor), Assessment

Emit finding IDs and the `Parallel-safe:` line per that contract, then the `Behaviour-change:` line.

Footer order: `Parallel-safe:` when present (issue-bearing reviews only), then `Behaviour-change:` on **every** report including clean ones, then `TRAJECTORY:` when a re-review trigger fired - `TRAJECTORY:` stays the true final line. `Behaviour-change: yes` when applying any Critical or Moderate fix would alter observable behaviour - values, control flow, routing, emitted output, persisted state; `no` when every fix is structural or stylistic, and on clean reports.

## Re-review: trajectory verdict

Include the following in the reviewer's task text on every re-review, after
the prior review report pasted verbatim under a
`## Previous review report (re-review trigger)` heading:

If your task contains a "Previous review report (re-review trigger)" section
and you found issues, append exactly one more line after `Behaviour-change:` — this
line, not `Behaviour-change:`, is the true final line of the report:

TRAJECTORY: CONVERGING (<n_prev> -> <n_now>, max severity <X>)
TRAJECTORY: DIVERGING
TRAJECTORY: STAGNANT (repeat of: <finding>)

Pick the first label that applies, in this order:

1. STAGNANT: a previous finding survives materially unchanged - name it.
   (e.g. the same unchecked error path flagged last round is still unchecked)
2. DIVERGING: <n_now> >= <n_prev>, or the fix introduced any new finding.
   (e.g. 3 findings fixed but the fix broke an import: DIVERGING, not CONVERGING)
3. CONVERGING: otherwise - the count fell, nothing new appeared, and every
   surviving finding was materially improved.

<n_prev>/<n_now> are finding counts; <X> is the highest remaining severity.
For this line the severity set is exactly Critical/Moderate/Minor, regardless
of the vocabulary used elsewhere in your report.

The orchestrator dispatches one extra fix only when this line says CONVERGING
without "max severity Critical" - be accurate, not generous.

If you found no issues, report success as usual and omit this line.
First reviews (no previous-report section) omit this line.
