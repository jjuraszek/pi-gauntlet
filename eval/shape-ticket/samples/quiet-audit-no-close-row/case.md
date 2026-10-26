bundle+: skills/shape-ticket/reference/tracker-ladder.md

/skill:shape-ticket #42

Repair checkpoint after audit before Draft. Present the actual step 8 gate under 1200 words; no approval has been given. GitHub acme/records #42 is OPEN, metadata clean, no comments, no overflow, no audit edit or other conformance defect. Roast has no unrelated findings and gates pass. The only defect is the missing source footer; the audit's scenario none alone does not add a footer. No gathered URL or attachment exists.

Snapshot title: Preserve import failure details on return
```untrusted
## Context
Support reviews saved import failures.

## Problem
Reopening a failed import drops its failure details, leaving support unable to explain the failure. Import run 42 displays "row 8 rejected" before navigation and only "failed" on return.

## Idea
Reporter proposes retaining failure details.

## Acceptance Criteria
1. Given failed import 42, when support leaves and reopens it, the view still displays "row 8 rejected".
```

Already-opened source confirms that the current return view loses failure details; the reported failure still occurs. Audit:
```untrusted
Claims: Reopening a failed import drops its failure details - verified: src/import-history.ts:18
Repo-fit: kept
AC-fit: clear
Sibling: none
In-motion: none
Scenario: none (missing current-system access)
```
Repair the missing footer only, preserving all existing prose and AC bytes. Render the actual gate and stop for a selection without any live write.
