## Spec
# Reports CSV export

**Goal:** Deliver reports exports for acme/widgets#45 with a fixed default-column schema rather than the ticket's dynamic column selection.

## Acceptance criteria
- [ ] The reports page offers an Export CSV button.
  in-scope
- [ ] The export includes every column shown in the table.
  deviates: the export includes the 12 visible-by-default columns (Design clause 3)
- [ ] Exports are emailed to the requesting user.
  in-scope
- [ ] The export completes under 5s on production data.
  in-scope
- [ ] Export events appear in the audit log.
  in-scope

## Design
1. Render an Export CSV button that starts a streaming export within five seconds on production data.
2. Email the CSV to the requesting user and record the export in the audit log.
3. Serialize the 12 visible-by-default columns regardless of custom table visibility.

## Reviewer report
audited-base: 4c1e8f0a9b2d7c6e5f4a3b2c1d0e9f8a7b6c5d4e
Happy path: not run - no row configured
Requirements:
- R1 (AC1 button) DELIVERED - src/ui/export-button.tsx:12, test/ui/export-button.test.tsx:8
- R3 (AC3 email) DELIVERED - src/export/email.ts:16, test/export/email.test.ts:11
- R4 (AC4 latency) DELIVERED - src/export/stream.ts:30, test/export/latency.test.ts:20
- R5 (AC5 audit log) DELIVERED - src/audit/log.ts:14, test/audit/log.test.ts:9
- R6 (Design clause 1) DELIVERED - src/ui/export-button.tsx:12, test/export/latency.test.ts:20
- R7 (Design clause 2) DELIVERED - src/export/email.ts:16, src/audit/log.ts:14
- R8 (Design clause 3) DELIVERED - src/export/csv.ts:24, test/export/csv.test.ts:18
Origin drift:
- AC2 deviates: the export includes the 12 visible-by-default columns (Design clause 3) - recorded in spec? yes
Gaps: none
Verdict: CONFORMS

## Diff summary
- Added an export button and streaming CSV generation.
- Fixed the CSV schema to the 12 default columns.
- Added requesting-user email delivery and export audit events.
- Added a production-sized latency fixture that completes in 3.8s.
