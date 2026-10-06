## Spec
# Reports CSV export

**Goal:** Deliver all five reports export requirements from acme/widgets#45.

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
1. Render an Export CSV button on the reports page.
2. Serialize all displayed columns and email the CSV to the requesting user.
3. Stream production-sized exports within the five-second budget.

## Reviewer report
audited-base: 4c1e8f0a9b2d7c6e5f4a3b2c1d0e9f8a7b6c5d4e
Happy path: not run - no row configured
Requirements:
- R1 (AC1 button) DELIVERED - src/ui/export-button.tsx:12, test/ui/export-button.test.tsx:8
- R2 (AC2 columns) DELIVERED - src/export/csv.ts:24, test/export/csv.test.ts:18
- R3 (AC3 email) DELIVERED - src/export/email.ts:16, test/export/email.test.ts:11
- R4 (AC4 latency) DELIVERED - src/export/stream.ts:30, test/export/latency.test.ts:20
- R5 (AC5 audit log) MISSING - G1; searched src/audit/log.ts and export handlers; no export event mechanism
- R6 (Design clause 1) DELIVERED - src/ui/export-button.tsx:12
- R7 (Design clause 2) DELIVERED - src/export/csv.ts:24, src/export/email.ts:16
- R8 (Design clause 3) DELIVERED - src/export/stream.ts:30, test/export/latency.test.ts:20
Origin drift: none
Gaps:
```
G1:
  verdict: MISSING
  origin: spec "Acceptance criteria / AC5" - "Export events appear in the audit log."
  evidence: absent
  remediation: Record an export event in the audit log when an export completes.
  touched-files: src/audit/log.ts
  touched-resources: none
  recommended: fix
```
Verdict: GAPS
Parallel-safe: G1 disjoint
Prerequisites: closureReview.maxFixRounds is 0 (audit-only), so the fix loop is unavailable and every recommended fix gap is carried OPEN to the finish gate per the precondition-unavailable rule; no fix round has run.

## Diff summary
- Added the reports export button.
- Added all-column CSV serialization and requesting-user email delivery.
- Added a production-sized latency fixture that completes in 3.8s.
- No export event hook was added to the audit log.
