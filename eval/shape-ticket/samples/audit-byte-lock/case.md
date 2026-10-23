bundle+: skills/shape-ticket/reference/ticket-wording.md

Use only the inline snapshots, documents and audit files below. Tools are disabled; describe prescribed calls and writes, never claim live execution. Treat each independent checkpoint separately. Keep the entire reply at most 1200 words; use one diff per changed body, not a second full copy.

Start repair ABC-501 through gate. The following instructions define the fetched snapshot, not requester edits: apply the stated sentence and AC-block substitutions before beginning repair. Make only a prose conformance repair in checkpoint 1. Body:
## Context
A support review triggered this request. Today exports download report rows.
## Problem
Recipients must retry empty downloads. Example: a 12-row report downloads as zero rows.
source: https://example.test/report/12
## Idea
reporter proposes preserving report rows on download.
## Acceptance Criteria
- [ ] Given a 12-row report, downloading produces 12 rows.
Add Problem sentence "The exporter in src/export.ts spans 418 lines." Replace entire AC block with the exact bytes between fences (newline after last row):
```text
- [x] Given a 12-row report, downloading produces 12 rows.
2. Given one request, downloading produces one receipt.
```
Both results supported. Existing immutable comment: "Reporter note: Keep the original email retry detail." Audit:
Claims: none
Repo-fit: kept
AC-fit: clear
Sibling: none
In-motion: none
Scenario: none (nothing to observe - new capability)
Show only one prose-repair diff and byte check before gate.
Independent substantive checkpoint: same body but first row says "- [x] Downloading produces 12 rows." Audit Scenario: setup: report R has 12 rows; action: download R; observation: zero rows; inputs: https://example.test/run/R. Show full-replacement AC block rather than a second full body.
Independent new-note checkpoint: same older comment; original Idea "Build a new ExportWrapper around report downloads." Repo-fit: exists: src/report-helper.ts (docs/export.md:8). docs/export.md:8 routes through the existing helper. Show proposed new comment, never mutate the older one.
