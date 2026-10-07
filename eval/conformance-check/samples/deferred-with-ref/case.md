## Spec
# Reports CSV export

**Goal:** Let reports users download their table as CSV in acme/widgets#45; email delivery and audit events belong to acme/widgets#46.

## Acceptance criteria
- [ ] The reports page offers an Export CSV button.
  in-scope
- [ ] The export includes every column shown in the table.
  in-scope
- [ ] Exports are emailed to the requesting user.
  deferred: acme/widgets#46
- [ ] The export completes under 5s on production data.
  in-scope
- [ ] Export events appear in the audit log.
  deferred: acme/widgets#46

## Design
1. Render an Export CSV button on the reports page.
2. Serialize all displayed table columns and return a browser download.
3. Stream production-sized exports within the five-second budget.

## Reviewer report
audited-base: 4c1e8f0a9b2d7c6e5f4a3b2c1d0e9f8a7b6c5d4e
Happy path: not run - no row configured
Requirements:
- R1 (AC1 button) DELIVERED - src/ui/export-button.tsx:12, test/ui/export-button.test.tsx:8
- R2 (AC2 columns) DELIVERED - src/export/csv.ts:24, test/export/csv.test.ts:18
- R4 (AC4 latency) DELIVERED - src/export/stream.ts:30, test/export/latency.test.ts:20
- R6 (Design clause 1) DELIVERED - src/ui/export-button.tsx:12
- R7 (Design clause 2) DELIVERED - src/export/csv.ts:24, src/ui/download.ts:9
- R8 (Design clause 3) DELIVERED - src/export/stream.ts:30, test/export/latency.test.ts:20
Origin drift:
- AC3 deferred: acme/widgets#46 - recorded in spec? yes
- AC5 deferred: acme/widgets#46 - recorded in spec? yes
Gaps: none
Verdict: CONFORMS

## Diff summary
- Added the reports export button and browser download handler.
- Added CSV serialization for every displayed column.
- Added streaming and a production-sized latency fixture that completes in 3.8s.
- Email delivery and audit events remain in acme/widgets#46.
