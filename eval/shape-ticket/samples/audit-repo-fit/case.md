bundle+: skills/shape-ticket/reference/ticket-wording.md

Use only the inline snapshots, documents and audit files below. Tools are disabled; describe prescribed calls and writes, never claim live execution. Treat each independent checkpoint separately. Keep the entire reply at most 1200 words; use one diff per changed body, not a second full copy.

Start repair through the existing confirmation gate, no approval yet. Snapshot ABC-201 has body:
## Context
A support review triggered this request. Today exports download report rows.
## Problem
Recipients must retry empty downloads. Example: a 12-row report downloads as zero rows.
source: https://example.test/report/12
## Idea
reporter proposes preserving report rows on download.
## Acceptance Criteria
- [ ] Given a 12-row report, downloading produces 12 rows.
Replace Idea with "Build a new ExportWrapper around report downloads." This is the reporter's original sketch. Root AGENTS.md routes export reuse to docs/export.md; docs/export.md:8 says use src/report-helper.ts, which already preserves rows.
Audit file:
Claims: none
Repo-fit: exists: src/report-helper.ts (docs/export.md:8)
AC-fit: clear
Sibling: none
In-motion: none
Scenario: none (nothing to observe - new capability)
Independent AC-only checkpoint: leave Idea as in the base body and replace AC with "- [ ] Given a 12-row report, downloading through a new ExportWrapper produces 12 rows." Audit Repo-fit: kept; AC-fit: how: Given a 12-row report - docs/export.md:8. Show the changed row and retained original mechanism, not another complete body. No human clarification is needed.
