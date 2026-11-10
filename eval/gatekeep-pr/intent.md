for: da59b6fec3f5471bab1b76d1733913ccc2c893bce674150c07a27540d8d13c86

## Change

Put the recommended action first in every gatekeep-pr menu, including stop when it is recommended, and emit recommended=1 on the gate line. Preserve availability, numeric authority, and execution mechanics. Keep non-recommended stop last.

Recommend deliver for another author's PR when every blocker has a drafted repair needing no author decision, the head is pushable, and deliver is offered. Distinguish missing requirements, acceptance-criteria changes, and scope choices from drafted code or description repairs. Explain the recommendation above the prompt without granting write authority.

Select only pr-body-false-claim for this increment. Its other-author, description-only blocker exercises the repairable path and retains the decline, readback, local-evidence, and pending-evidence checks. Retain gate-line-first and all other saved results as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification.

## Expected to move

- pr-body-false-claim/recommendation: fails -> holds - A repairable body-only blocker on another author's PR recommends deliver on row 1, with a reason above the prompt and no write before selection.

## Validation boundary

Judge candidate facts absolutely, not only the comparison direction. The runner assembles both arms from the working-tree skillFiles list; removing a file later also removes it from the baseline assembly. No baseline file is removed in this increment.
