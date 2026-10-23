bundle+: skills/shape-ticket/reference/ticket-wording.md

Use only the inline snapshots, documents and audit files below. Tools are disabled; describe prescribed calls and writes, never claim live execution. Treat each independent checkpoint separately. Keep the entire reply at most 1200 words; use one diff per changed body, not a second full copy.

Start fresh-feature Draft and existing create gate. Ask: add report receipts; no current receipt capability exists. Context: support review; current exports download rows. Problem: users cannot identify a download; source https://example.test/receipts. Idea: reporter proposes receipts. AC: Given a downloaded report, viewing its receipt shows the report ID.
Audit:
Claims: none
Repo-fit: kept
AC-fit: clear
Sibling: none
In-motion: none
Scenario: none (nothing to observe - new capability)
Show body and gate allowing write approval, no simulated approval.
Independent defect checkpoint: repair ABC-301 body:
## Context
A support review triggered this request. Today exports download report rows.
## Problem
Recipients must retry empty downloads. Example: a 12-row report downloads as zero rows.
source: https://example.test/report/12
## Idea
reporter proposes preserving report rows on download.
## Acceptance Criteria
- [ ] Given a 12-row report, downloading produces 12 rows.
AC currently "- [ ] Downloading produces 12 rows." Audit Scenario: setup: report R has 12 rows in staging; action: download R; observation: download has zero rows; inputs: https://example.test/run/R, screenshot.png. All other labels quiet. Fill missing setup/action and show scenario footer.
Independent source-gap checkpoint: same defect but source footer is missing at filing. Keep scenario observation/inputs independent of source evidence acknowledgment.
Access checkpoint: Scenario: none (no access to staging credentials or browser). State disposition without drafting another body.
