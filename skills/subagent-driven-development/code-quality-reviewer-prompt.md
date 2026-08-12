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
```

**In addition to standard code quality concerns, the reviewer should check:**
- Does each file have one clear responsibility with a well-defined interface?
- Are units decomposed so they can be understood and tested independently?
- Is the implementation following the file structure from the plan?
- Did this implementation create new files that are already large, or significantly grow existing files? (Don't flag pre-existing file sizes — focus on what this change contributed.)

**Code reviewer returns:** Strengths, Issues (Critical/Moderate/Minor), Assessment

## Re-review: trajectory verdict

Include the following in the reviewer's task text on every re-review, after
the prior review report pasted verbatim under a
`## Previous review report (re-review trigger)` heading:

If your task contains a "Previous review report (re-review trigger)" section
and you found issues, end your report with exactly one line:

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
