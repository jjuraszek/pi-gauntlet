for: 79afc0f5c110971d06844fd5471d71317081534b924178ff79c7efe677fbc998

## Change

On reply `3`, read the council audit from the spec commit and print it verbatim, then reuse the rendered four-row gate, including its flag lines, recommendation tag, marker and reason. Reuse the context and settings observations instead of reading them again or recomputing the recommendation. Record no approval or grant and change neither the spec nor its commit.

Update row-3-reply's six-row fact to the four-row contract and add a snapshot-reuse fact. Supply a low-context observation while keeping the existing ticket row, briefing, audit and shared settings result. Run only `spec-gate/row-3-reply` against base `855e872a42f9cac7a795704f3e0b383b182950ab`. This text replay proves rendering and narrated read/no-write behavior, not live git or tracker effects. Preserve all other sample records; the report is partial, not a target-wide pass.

## Expected to move
- row-3-reply/f2: fails -> holds - Re-present the four-row menu with its recommendation and flag lines unchanged.
- row-3-reply/reuse: fails -> holds - Reuse the rendered recommendation without refreshing status or settings.
