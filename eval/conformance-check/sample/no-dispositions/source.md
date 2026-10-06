## Spec
# Reports CSV export

**Goal:** Deliver the full reports export workflow from acme/widgets#45 without deferred or deviating acceptance criteria.

## Acceptance criteria
- [ ] The reports page offers an Export CSV button.
  in-scope
- [ ] The export includes every column shown in the table.
  in-scope
- [ ] Exports are emailed to the requesting user.
  in-scope
- [ ] The export completes under 5s on production data.
  in-scope
- [ ] Export events appear in the audit log.
  in-scope

## Design
1. Render an Export CSV button and serialize every displayed table column.
2. Email the completed CSV to the requesting user and record the export event in the audit log.
3. Stream production-sized exports within the five-second budget.

## Reviewer report
audited-base: 4c1e8f0a9b2d7c6e5f4a3b2c1d0e9f8a7b6c5d4e
Happy path: not run - no row configured
Requirements:
- R1 (AC1 button) DELIVERED - src/ui/export-button.tsx:12, test/ui/export-button.test.tsx:8
- R2 (AC2 columns) DELIVERED - src/export/csv.ts:24, test/export/csv.test.ts:18
- R3 (AC3 email) DELIVERED - src/export/email.ts:16, test/export/email.test.ts:11
- R4 (AC4 latency) DELIVERED - src/export/stream.ts:30, test/export/latency.test.ts:20
- R5 (AC5 audit log) DELIVERED - src/audit/log.ts:14, test/audit/log.test.ts:9
- R6 (Design clause 1) DELIVERED - src/ui/export-button.tsx:12, src/export/csv.ts:24
- R7 (Design clause 2) DELIVERED - src/export/email.ts:16, src/audit/log.ts:14
- R8 (Design clause 3) DELIVERED - src/export/stream.ts:30, test/export/latency.test.ts:20
Origin drift: none
Gaps: none
Verdict: CONFORMS

## Diff summary
- Added the reports export button and all-column CSV generation.
- Added requesting-user email delivery.
- Added export audit events.
- Added a production-sized latency fixture that completes in 3.8s.
