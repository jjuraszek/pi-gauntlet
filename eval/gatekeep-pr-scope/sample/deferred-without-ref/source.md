## PR
acme/widgets#210 "Export reports as CSV" by maria (you are maria; viewer_permission WRITE; state OPEN; not draft; head_pushable true; mergeable MERGEABLE)
Body: Add on-demand CSV export from the reports page. Email delivery is left for a follow-up ticket and audit events are deferred to acme/widgets#46.
Spec: doc/specs/2026-09-30-csv-export.md

## Diff summary
- doc/specs/2026-09-30-csv-export.md (added)
- src/api/export.ts (+58): `exportCsv(reportId)` handler, pages capped at 100 rows with a 4s deadline; returns 404 for unknown reports
- src/ui/reports.tsx (+12): Export CSV button downloads the handler response
- test/api/export.test.ts (+41): asserts header row, 3 data rows, all table columns, paging cap, deadline, and 404 on unknown report
- docs/exports.md (+6): on-demand export section

## Spec at head
# CSV export for reports

**Goal:** Let report readers download the table as CSV without waiting for email delivery.

## Problem
Readers currently copy report cells by hand to share data. Large reports need bounded paging so exports do not hold the request open indefinitely.

## Acceptance criteria
- [ ] AC1 The reports page offers an Export CSV button.
  in-scope
- [ ] AC2 The export includes every column shown in the table.
  in-scope
- [ ] AC3 Exports are emailed to the requesting user.
  deferred: a follow-up ticket for email delivery
- [ ] AC4 The export completes under 5s on production data.
  in-scope
- [ ] AC5 Export events appear in the audit log.
  deferred: acme/widgets#46

## Design
1. Add an Export CSV button that downloads the response from `exportCsv(reportId)`.
2. Serialize every table column in table order with a header row and escaped CSV cells; return 404 for unknown reports.
3. Enforce AC4 with pages capped at 100 rows and a 4s deadline, tested with a controlled clock; this is the paging-bound mechanism, not a production benchmark claim.
4. Deliver email transport in a follow-up ticket and audit events separately in acme/widgets#46.

## Ticket
acme/widgets#45 "CSV export for the reports page" - Acceptance criteria:
- [ ] AC1 The reports page offers an Export CSV button.
- [ ] AC2 The export includes every column shown in the table.
- [ ] AC3 Exports are emailed to the requesting user.
- [ ] AC4 The export completes under 5s on production data.
- [ ] AC5 Export events appear in the audit log.
Comments: none

## Verification evidence
source: ci; check `test` success on the assessed head; claims: "adds tests for the CSV handler" matched

## Reviewer findings
Verdict: approve. Minor: `src/api/export.ts:31` pages with its own loop instead of `lib/page.ts`.

## Pick
none
