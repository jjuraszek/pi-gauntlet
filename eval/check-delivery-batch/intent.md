for: b85d91f9afdc5590718b8ad859a6214ed229205135ed16ceee1da91947ffc0cd

## Change
Add set-mode parent turns after one fresh parallel delivery-checker child per explicit ticket. Preserve each report and confirmation gate while showing only the current ticket, one marker and one gate per message in supplied order. Keep handoff metadata and child result lines private. The batch-one-gate-per-turn sample covers the first of three REPORT tickets. batch-decline-isolates checks that declining ticket 12 still presents ticket 15's unchanged report and independent gate. batch-approved-after-decline checks that ticket 15's completed approved write advances to ticket 18's gate with a plain delivered outcome. batch-ac-conflict-row checks the recovery marker, quoted conflicting rows and retry/skip menu without asking for a reading. batch-ac-conflict-reading checks that retry opens a separate question and waits for the typed reading. batch-closing-marker checks the final delivered=2,declined=1 marker and roster-ordered outcomes. These text samples take tool observations as inputs; they do not observe actual dispatch, reading transfer to a retry task, re-fetch, tracker writes, or cleanup.

## Expected to move
- batch-one-gate-per-turn/ticket-heading: fails -> holds - Set turns identify the current ticket under its own heading.
- batch-one-gate-per-turn/no-second-ticket: fails -> holds - Sibling reports wait for their own turns.
- batch-one-gate-per-turn/no-third-ticket: fails -> holds - Sibling reports wait for their own turns.
- batch-one-gate-per-turn/report-verbatim: fails -> holds - Display the current child's report without rewriting or combining it.
