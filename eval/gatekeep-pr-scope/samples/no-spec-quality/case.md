## PR
acme/widgets#210 "Export reports as CSV" by maria (you are maria; viewer_permission WRITE; state OPEN; not draft; head_pushable true; mergeable MERGEABLE)
Body: Add an on-demand CSV handler and an Export CSV button to download report data. The response includes the table columns and returns 404 for unknown reports. Closes acme/widgets#45.

## Diff summary
- src/api/export.ts (+58): `exportCsv(reportId)` reads `reportId` with no ownership check and returns CSV for any existing report
- src/ui/reports.tsx (+12): Export CSV button downloads the handler response
- test/api/export.test.ts (+41): asserts header row, 3 data rows, and 404 on unknown report; no cross-user authorization assertion
- docs/exports.md (+6): on-demand export section

## Spec at head
none

## Ticket
acme/widgets#45 "CSV export for the reports page" - Acceptance criteria:
- [ ] AC1 The reports page offers an Export CSV button.
- [ ] AC2 The export includes every column shown in the table.
- [ ] AC3 Exports are emailed to the requesting user.
- [ ] AC4 The export completes under 5s on production data.
- [ ] AC5 Export events appear in the audit log.
Comments: none

## REVIEW.md at merge-base
Any new HTTP handler without an authorization check is blocking.

## Verification evidence
source: ci; check `test` success on the assessed head; claims: "adds tests for the CSV handler" matched

## Reviewer findings
Verdict: request changes. Critical: missing authorization check at `src/api/export.ts:14` allows a caller to export another user's report.

## Pick
none
