bundle-: skills/shape-ticket/reference/repo-audit.md
bundle+: skills/shape-ticket/reference/ticket-wording.md

Workflow stage: ### 8 - Confirmation gate.
All writes are simulated; use no tools. Create mode in synthetic acme/records. Gather, overlap check, metadata audit, deterministic checks and roast are complete; no other edits or findings. No metadata changes, comments, relations or split. No UI artifact or measurement is missing; the behavioral AC is pre-prod verifiable.

Ask: Support reviews import outcomes and sees "import run 42 finished with zero rows". The reporter supplies https://errors.example.test/issues/4242.
Title: Show empty import outcomes
Complete proposed body:
## Context
Support reviews import outcomes in the run list.
## Problem
An import reports completion without imported rows, leaving support unable to tell whether any records were saved. For example, "import run 42 finished with zero rows".
## Idea
The reporter proposes showing the imported row count with the completion result.
## Acceptance Criteria
- [ ] Given an import with zero accepted rows, when support reads its completion result, the result states that zero rows were imported.

Present the confirmation gate and stop for consent.
