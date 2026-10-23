bundle+: skills/shape-ticket/SKILL.md
bundle+: skills/shape-ticket/reference/ticket-wording.md

Use only the inline snapshots, documents and audit files below. Tools are disabled; describe prescribed calls and writes, never claim live execution. Treat each independent checkpoint separately. Keep the entire reply at most 1200 words; use one diff per changed body, not a second full copy.

Start at entry with `ABC-101, ABC-102 ABC-102, ABC-103`. Accompanying text: "ABC-102: the dashboard here is the admin one" and "Downloads are scheduled nightly." Only ABC-101's snapshot supports nightly scheduling. Tracker mapping: description/state/url. Checkout root /tmp/report-repo; allocate one temporary root. The following three fetched snapshots include all comments and linked summaries. Metadata clean. No overlap search is needed for repair.

ABC-101: title "Preserve report rows". Body:
## Context
A support review triggered this request. Today exports download report rows.
## Problem
Recipients must retry empty downloads. Example: a 12-row report downloads as zero rows.
source: https://example.test/report/12
## Idea
reporter proposes preserving report rows on download.
## Acceptance Criteria
- [ ] Given a 12-row report, downloading produces 12 rows.
Nonconforming extra Problem sentence: "The exporter in src/export.ts spans 418 lines."
ABC-102: title "Speed up dashboard". Context: support review; current dashboard lists reports. Problem: users wait for reports; source https://example.test/report/102. Idea: reporter proposes faster loading. AC: "- [ ] Dashboard becomes faster." Comment: dashboard means admin here. Recovery answer: "No baseline or target exists; keep faster as the criterion."
ABC-103: title "Preserve export results". Body equals ABC-101 without its extra inventory sentence; replace ACs with:
- [ ] Given a 12-row report, downloading produces 12 rows and preserves report order.
- [ ] Given a 12-row report, downloading produces 12 rows.
- [ ] Given a 12-row report, downloading produces a receipt with the report ID.
The first row bundles independently observable count and order; retain nested setup detail (the 12-row report) rather than treating setup as a separate requirement. Source supports all three results.
Each /tmp/audit-run/<ref>/audit.md contains:
Claims: none
Repo-fit: kept
AC-fit: clear
Sibling: none
In-motion: none
Scenario: none (nothing to observe - new capability)

Show the first gate only, after completing internal preparation for all tickets. Then give terse independent continuation checkpoints: (a) decline ABC-101; report ABC-102 stopped; show ABC-103 gate, including removed-row Reporter note; (b) at ABC-103 gate reply "revise the receipt wording"; re-present that same ticket; (c) while ABC-101 is current reply "approve ABC-103"; (d) approve the displayed ABC-103 revision with unchanged re-fetch, prescribe body-then-comment write before advancing, and give final distinct-ref statuses. Show no later draft in the initial gate.

Routing checkpoints: parse `#7 ABC-102 https://example.test/issues/9 #7`; one fetch fails while others succeed; all fetches fail with accompanying free text. State outcomes only. Create checkpoint: clarified ask plus discovered candidate under one temp root; parent owns discovery before scout. Audit applies to added enrichment prose/create-anyway, never unrelated legacy ACs; retain existing alternative menu.
