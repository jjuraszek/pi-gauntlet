bundle+: skills/check-delivery/SKILL.md

## PR
acme/widgets#210 "Export reports as CSV" by maria (you are maria; viewer_permission WRITE; state OPEN; not draft; head_pushable true; mergeable MERGEABLE)
Body: Add CSV export infrastructure and the reports-page button. The button remains disabled until the mailer in acme/widgets#46 ships; email and audit events are deferred there.
Spec: doc/specs/2026-09-30-csv-export.md

## Diff summary
- doc/specs/2026-09-30-csv-export.md (added)
- src/api/export.ts (+58): `exportCsv(reportId)` handler, pages capped at 100 rows with a 4s deadline; returns 404 for unknown reports
- src/ui/reports.tsx (+12): Export CSV button renders disabled until the mailer ships, then downloads the handler response
- test/ui/reports.test.tsx (+16): asserts the disabled button before mailer readiness and enabled button afterward
- test/api/export.test.ts (+41): asserts header row, 3 data rows, all table columns, paging cap, deadline, and 404 on unknown report
- docs/exports.md (+6): export availability section

## Spec at head
# CSV export for reports

**Goal:** Prepare CSV export while keeping its button disabled until mail delivery is ready.

## Problem
Readers currently copy report cells by hand to share data. The mailer is not ready, so the export button must wait for that dependency while the CSV mechanism lands.

## Acceptance criteria
- [ ] AC1 The reports page offers an Export CSV button.
  in-scope
- [ ] AC2 The export includes every column shown in the table.
  in-scope
- [ ] AC3 Exports are emailed to the requesting user.
  deferred: acme/widgets#46
- [ ] AC4 The export completes under 5s on production data.
  in-scope
- [ ] AC5 Export events appear in the audit log.
  deferred: acme/widgets#46

## Design
1. Add an Export CSV button that downloads the response from `exportCsv(reportId)` when enabled.
2. Serialize every table column in table order with a header row and escaped CSV cells; return 404 for unknown reports.
3. Enforce AC4 with pages capped at 100 rows and a 4s deadline, tested with a controlled clock; this is the paging-bound mechanism, not a production benchmark claim.
4. The export button is enabled only after the mailer in acme/widgets#46 ships; until then it renders disabled.
5. Deliver email transport and audit events separately in acme/widgets#46.

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

## After the gate
Then answer as /skill:check-delivery Stage 3 would for acme/widgets#45 once this PR is merged: no `## Delivery` block is configured, no ticket comment explains any row, acme/widgets#46 is still open. Render the per-AC verdict table; the expected verdict for AC3 and AC5 is `unexplained gap`.
