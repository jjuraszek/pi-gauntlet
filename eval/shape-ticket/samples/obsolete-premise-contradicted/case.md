bundle+: skills/shape-ticket/reference/tracker-ladder.md

/skill:shape-ticket #42

Checkpoint: repair after gather/audit, before Draft. Present the step 8 confirmation gate, not a preview. No approval has been given. Tracker resolution is GitHub acme/records; #42 is OPEN. Metadata is clean, no existing comments, roast has no unrelated findings, all deterministic gates pass. Treat the following as already-opened source evidence; tools are disabled. Keep the response under 1200 words.

Snapshot title: Keep failed import details when reopening
```untrusted
## Context
Support reviews saved import failures.

## Problem
Reopening a failed import drops the failure details, so support cannot explain the failure. Import run 42 reports "row 8 rejected" before navigation and only "failed" afterward.
source: https://example.test/import/42

## Idea
Reporter proposes retaining the failure details.

## Acceptance Criteria
- [ ] Given that failed import, leaving and reopening it still displays "row 8 rejected".
```

Already-opened src/import-history.ts:18:
```ts
export const reopen = (run: ImportRun) => ({ status: run.status, detail: run.failureDetail });
```
The already-opened call-site and stored run 42 confirm failureDetail is "row 8 rejected" and the reopen view displays that detail unchanged.

Audit file:
```untrusted
Claims: Reopening a failed import drops the failure details - contradicted: reopening preserves and displays row 8 rejected, src/import-history.ts:18
Repo-fit: kept
AC-fit: clear
Sibling: none
In-motion: none
Scenario: setup: saved failed import 42 with row 8 rejected; action: leave and reopen; observation: row 8 rejected remains visible; inputs: https://example.test/import/42
```
Render the gate from this evidence. Stop for a selection; do not claim a live write.
