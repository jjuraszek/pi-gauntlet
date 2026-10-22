bundle+: skills/shape-ticket/reference/ticket-wording.md

Workflow stage: ### 8 - Confirmation gate.
All writes are simulated; use no tools. Create mode in synthetic acme/records. Gather, overlap check, metadata audit, deterministic checks and roast are complete; no other edits or findings. No metadata changes, comments, relations or split. No UI artifact or measurement is missing; the behavioral AC is pre-prod verifiable.

Produce one response with two labeled independent checkpoints.
Ask: The export command returns an empty file although its import run contains 12 accepted rows. Expected: the export contains those 12 rows. No URL, attachment or screenshot was supplied; this is a CLI bug, not a UI claim.
Repro steps:
1. Import 12 synthetic rows.
2. Invoke export for that import run.
3. Count output rows: observed zero; expected 12.
Title: Export accepted import rows
Complete proposed body:
## Context
Operators export accepted import rows for downstream review.
## Problem
Exports omit accepted rows, so operators cannot review the imported records. For example, exporting a run with 12 accepted rows returns an empty file instead of 12 rows.
## Idea
The reporter proposes exporting the accepted rows from the selected run.
## Acceptance Criteria
- [ ] Given a run with 12 accepted rows, when an operator exports the run, the output file contains those 12 rows.

## Checkpoint 1 - Generate the confirmation gate
Present the gate and stop for consent.
## Checkpoint 2 - Continue after a reply
Independent transcript: the assistant already presented the proposed payload above at the confirmation gate with the gathered evidence and outstanding source status. Human reply: yes
Continue the transcript, describing only simulated actions.
