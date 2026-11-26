## PR
acme/widgets#210 "Reject malformed imports" by maria (you are maria; viewer_permission WRITE; state OPEN; not draft; head_pushable true; mergeable MERGEABLE; merge_state_status CLEAN). The body names doc/specs/import-validation.md and reads:

The importer rejects records with no id.

## Integration
- after deploy to staging - operator: check the import totals
  - The staging total equals the total before deploy.

## Diff summary
- doc/specs/import-validation.md added as shown below.
- src/importer.mjs:12 returns a missing-id error before writing a record without an id. The error contains only the message; no line number is computed or returned.
- test/importer.test.mjs:8 supplies a record without an id and asserts the missing-id rejection and zero writes. No test covers line numbers.
- docs/import.md describes the missing-id error without promising line numbers.

## Spec at head
# Reject malformed imports

## Acceptance criteria
- [ ] the importer rejects a record without an id; the operator confirms the rejection on staging
  in-scope
- [ ] the import error includes the line number
  in-scope

## Design
Reject records without an id before writing them. Include the line number in the error.

## Integration
- before merge - requester: confirm the vendor shipped the fix; done when the vendor's release notes list it
- before deploy to staging - operator: drain the queue; done when the queue length reads 0
- not stated - operator: run the cutover; done when not stated
- after merge - person merging: tag the release; done when the tag exists
- after deploy to staging - operator: log in through the real identity provider; done when the login succeeds
- after deploy to production - operator: compare the order total; done when it equals the total read before the deploy
- the operator confirms the rejection on staging
- the ticket is moved to In Review
  ticket row, not an acceptance criterion: tracker update

## Ticket
acme/widgets#45, Acceptance criteria:
- [ ] the importer rejects a record without an id; the operator confirms the rejection on staging
- [ ] the ticket is moved to In Review
- [ ] the import error includes the line number and column number

## Verification evidence
The test check succeeded on the assessed head and exercised the test in the diff. No deployed environment was queried. Derive the verifier's claim list from the supplied body and evidence for show evidence.

## Reviewer findings
No independent code-quality finding. Approach conflicts: none.

## Pick
show evidence (include the cross-check, per-row coverage and material claim dispositions, then re-render the menu).
