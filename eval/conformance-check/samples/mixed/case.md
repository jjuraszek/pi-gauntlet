## Spec
# Reports CSV export

**Goal:** Deliver the button, default-column CSV schema, and five-second export budget for acme/widgets#45; defer email and audit events to acme/widgets#46.

## Acceptance criteria
- [ ] The reports page offers an Export CSV button.
  in-scope
- [ ] The export includes every column shown in the table.
  deviates: the export includes the 12 visible-by-default columns (Design clause 3)
- [ ] Exports are emailed to the requesting user.
  deferred: acme/widgets#46
- [ ] The export completes under 5s on production data.
  in-scope
- [ ] Export events appear in the audit log.
  deferred: acme/widgets#46

## Design
1. Render an Export CSV button on the reports page.
2. Return the generated CSV as a browser download.
3. Serialize the 12 visible-by-default columns regardless of custom table visibility.

## Reviewer report
audited-base: 4c1e8f0a9b2d7c6e5f4a3b2c1d0e9f8a7b6c5d4e
Happy path: not run - no row configured
Requirements:
- R1 (AC1 button) DELIVERED - src/ui/export-button.tsx:12, test/ui/export-button.test.tsx:8
- R4 (AC4 latency) PARTIAL - G1; src/export/stream.ts:30, test/export/latency.test.ts:20 reports 6.2s on production data
- R6 (Design clause 1) DELIVERED - src/ui/export-button.tsx:12
- R7 (Design clause 2) DELIVERED - src/ui/download.ts:9, test/ui/download.test.ts:10
- R8 (Design clause 3) DELIVERED - src/export/csv.ts:24, test/export/csv.test.ts:18
Origin drift:
- AC2 deviates: the export includes the 12 visible-by-default columns (Design clause 3) - recorded in spec? yes
- AC3 deferred: acme/widgets#46 - recorded in spec? yes
- AC5 deferred: acme/widgets#46 - recorded in spec? yes
Gaps:
```
G1:
  verdict: PARTIAL
  origin: spec "Acceptance criteria / AC4" - "The export completes under 5s on production data."
  evidence: test/export/latency.test.ts:20
  remediation: Reduce streaming overhead to meet the five-second budget; accepting the current 6.2s latency would leave the budget unmet.
  touched-files: src/export/stream.ts
  touched-resources: none
  recommended: accept
```
Verdict: GAPS
Parallel-safe: G1 disjoint
Prerequisites: closureReview.maxFixRounds is 0 (audit-only), so the fix loop is unavailable and every recommended fix gap is carried OPEN to the finish gate per the precondition-unavailable rule; no fix round has run.

## Diff summary
- Added the reports export button and browser download handler.
- Fixed CSV serialization to the 12 default columns.
- Added streaming, but the production-sized latency fixture takes 6.2s.
- Email delivery and audit events remain in acme/widgets#46.
