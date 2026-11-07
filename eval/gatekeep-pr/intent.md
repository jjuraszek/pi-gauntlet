for: d30b57aa60e343123261fc97b9dd03e8d162f304bccf9166b13ca316af2c13d4

## Change
Emit plain per-PR settlement rows with assessed full heads, terminal outcomes and only observed ticket refs after cleanup and follow-ons finish. Retain retired PR rows until final set settlement and keep intermediate retirement nonterminal. Run only per-ref-settlement for this edit and preserve historical results; this is sample-scoped coverage, not a target-wide pass.

Move gatekeep-pr's pi file-finding fix wave to loop-implementer companion rows with a persisted ledger and derived spec. Admit successful and ordinary failed commits with selective evidence, charge attempts without double-counting a source-changing round, preserve partial work and retry guidance, reopen carried findings and partially resolved nit batches without resetting attempts, and bound retries through row exhaustion and escalation. Keep prior-review delta accounting, description compare-and-swap updates, and the independent Claude Code helper path intact. The samples selected for this PR's loop-engine edit are loop-worker, nit-batch-row, prior-review-delta, reviewer-row-reopen, row-exhaustion, blockers-bare-fix, and description-not-a-row. This attribution and intent correction rejudges only prior-review-delta's stored outputs; it changes no skill or persona behavior. The evidence is sample-scoped narration, not a target-wide pass or live admission/push verification.

## Expected to move
- per-ref-settlement/terminal: fails -> holds - Both baseline replies start done despite the stopped roster item.
- per-ref-settlement/merged: fails -> holds - Baselines omit the assessed head or render the PR row as a bullet rather than a plain parseable line.
- per-ref-settlement/stopped: fails -> holds - Baselines omit the assessed head or the exact stuck reason on the plain outcome row.
