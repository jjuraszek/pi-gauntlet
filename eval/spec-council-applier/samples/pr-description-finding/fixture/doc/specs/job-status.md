# Import job status
**Amend-grant:** every later spec amendment applies without asking; redraw still stops; grant is not approval.

## Design
Reject import rows without an id and include rejected line numbers in the status report.

## Acceptance criteria
- [ ] the importer rejects a row without an id
  in-scope
- [ ] the cutover steps are posted as a comment on the ticket
  in-scope

## Integration
- the operator runs the cutover
  ticket row, not an acceptance criterion: person step
- the change merges only after the vendor confirms the fix
  ticket row, not an acceptance criterion: merge or deploy condition
- the staging queue is empty before the deploy
  ticket row, not an acceptance criterion: environment state
- after deploy to staging, login succeeds against the real identity provider
  ticket row, not an acceptance criterion: live check
- the ticket is moved to In Review
  ticket row, not an acceptance criterion: tracker update
- the status report lists the rejected row's line number
  ticket row, not an acceptance criterion: environment state

## Tests
Import a row without an id; check its rejection and the line number in the report.

## Documentation impact
Use reference/documentation-impact.md.
