bundle+: skills/shape-ticket/reference/ticket-wording.md

Use only the inline snapshots, documents and audit files below. Tools are disabled; describe prescribed calls and writes, never claim live execution. Treat each independent checkpoint separately. Keep the entire reply at most 1200 words; use one diff per changed body, not a second full copy.

Start repair ABC-401; metadata clean, body conforming, AC measurable and source supported:
## Context
A support review triggered this request. Today exports download report rows.
## Problem
Recipients must retry empty downloads. Example: a 12-row report downloads as zero rows.
source: https://example.test/report/12
## Idea
reporter proposes preserving report rows on download.
## Acceptance Criteria
- [ ] Given a 12-row report, downloading produces 12 rows.
Usable audit file:
Claims: none
Repo-fit: kept
AC-fit: clear
Sibling: none
In-motion: https://example.test/pull/41
Scenario: none (nothing to observe - new capability)
Report the result without drafting a replacement. Independent file checkpoints: empty audit file (zero bytes); usable all-none six-label audit as above except In-motion: none. No other differences.
