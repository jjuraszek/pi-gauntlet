bundle+: skills/shape-ticket/reference/ac-classes.md

AC definition: /package/skills/shape-ticket/reference/ac-classes.md (bundled above)
Problem statement: The importer needs to reject rows without an id and identify rejected line numbers. Review the proposed spec against the ticket below. The spec and ticket are complete; codebase verification is not requested.

Human input (verbatim; off-limits for over-spec):
```text
Ticket acceptance rows:
- the importer rejects a row without an id
- the cutover steps are posted as a comment on the ticket
- the operator runs the cutover
- the change merges only after the vendor confirms the fix
- the staging queue is empty before the deploy
- after deploy to staging, login succeeds against the real identity provider
- the ticket is moved to In Review
Follow-up ticket rows:
- the status report lists the rejected row's line number
- on staging, the importer rejects an empty name
```

## Proposed spec

## Design
Reject missing ids and empty names. Report each rejected input line number. Test the parser and status report against local inputs with a missing id and an empty name.

## Acceptance criteria
- [ ] the importer rejects a row without an id
  in-scope
- [ ] after deploy to staging, login succeeds against the real identity provider
  in-scope
- [ ] on staging, the importer rejects an empty name
  in-scope

## Integration
- on staging
- the cutover steps are posted as a comment on the ticket
  ticket row, not an acceptance criterion: tracker update
- the operator runs the cutover
  ticket row, not an acceptance criterion: person step
- the change merges only after the vendor confirms the fix
  ticket row, not an acceptance criterion: merge or deploy condition
- the staging queue is empty before the deploy
  ticket row, not an acceptance criterion: environment state
- the ticket is moved to In Review
  ticket row, not an acceptance criterion: tracker update
- the status report lists the rejected row's line number
  ticket row, not an acceptance criterion: environment state
