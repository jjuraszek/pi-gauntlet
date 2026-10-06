## PR
acme/widgets#210 "Export reports as CSV" by maria (you are maria; viewer_permission WRITE; state OPEN; not draft; head_pushable true; mergeable MERGEABLE)
Body: Add on-demand CSV download with bounded paging. Export the 12 visible-by-default columns rather than all 40 table columns; defer email and audit events to acme/widgets#46.
Spec: doc/specs/2026-09-30-csv-export.md

## Diff summary
- doc/specs/2026-09-30-csv-export.md (added)
- src/api/export.ts (+58): `exportCsv(reportId)` handler, pages capped at 100 rows with a 4s deadline; returns 404 for unknown reports
- src/ui/reports.tsx (+12): Export CSV button downloads the handler response
- src/api/export-columns.ts (+20): selects the 12 columns named in Design clause 3
- test/api/export-columns.test.ts (+26): asserts the exact 12-column header and order, and quoted/escaped cells (commas, quotes, newlines)
- test/api/export.test.ts (+41): asserts header row, 3 data rows, paging cap, deadline, and 404 on unknown report
- docs/exports.md (+6): on-demand export section

## Spec at head
# CSV export for reports

**Goal:** Let report readers download a compact CSV before email delivery ships.

## Problem
Readers currently copy report cells by hand to share data. The table has 40 columns, but its 12 visible-by-default columns contain the fields most readers use.

## Acceptance criteria
- [ ] AC1 The reports page offers an Export CSV button.
  in-scope
- [ ] AC2 The export includes every column shown in the table.
  deviates: the table has 40 columns, so the export includes the 12 visible-by-default columns (Design clause 3)
- [ ] AC3 Exports are emailed to the requesting user.
  deferred: acme/widgets#46
- [ ] AC4 The export completes under 5s on production data.
  in-scope
- [ ] AC5 Export events appear in the audit log.
  deferred: acme/widgets#46

## Design
1. Add an Export CSV button that downloads the response from `exportCsv(reportId)`; return 404 for unknown reports.
2. Cap pages at 100 rows and apply a 4s deadline; test the paging bound and deadline with a controlled clock for AC4.
3. Export exactly these 12 visible-by-default columns in order: report_id, title, owner, status, created_at, updated_at, category, region, amount, currency, item_count, total; test the exact header and escaped cells.
4. Deliver email transport and audit events separately in acme/widgets#46.

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
