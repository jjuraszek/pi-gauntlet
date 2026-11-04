for: b85d91f9afdc5590718b8ad859a6214ed229205135ed16ceee1da91947ffc0cd

## Change
Add set-mode parent turns after one fresh parallel delivery-checker child per explicit ticket. Preserve each report and confirmation gate while showing only the current ticket, one marker and one gate per message in supplied order. Keep handoff metadata and child result lines private. The batch-one-gate-per-turn sample covers the first of three REPORT tickets; it does not observe dispatch, fetch, tracker calls, later approvals, recovery, or settlement.

## Expected to move
- batch-one-gate-per-turn/ticket-heading: fails -> holds - Set turns identify the current ticket under its own heading.
- batch-one-gate-per-turn/no-second-ticket: fails -> holds - Sibling reports wait for their own turns.
- batch-one-gate-per-turn/no-third-ticket: fails -> holds - Sibling reports wait for their own turns.
- batch-one-gate-per-turn/report-verbatim: fails -> holds - Display the current child's report without rewriting or combining it.
