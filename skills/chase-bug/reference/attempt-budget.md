# Hotfix attempt budget

## Seed

Before each `target: seed` dispatch, count the `repair seed` lines in the ledger's `## Decisions`. Dispatch only while the count is below `allowance:`. Never escalate a seed.

On a retryable seed miss in step 4:

1. Append `repair seed | seed miss: <concrete miss> | iteration <consumed>` to `## Decisions`. Use the bumped `iterations:` value. Leave row 1 `| 1 | open | 0 | |`.
2. Clear `pending:`. On pi, delete the return file through step 4's deletion recipe. Keep any missed commit on the hotfix branch; start the next attempt from its tip without resetting. Squash delivery keeps its surviving tree changes; PR delivery keeps the commit in branch history.
3. Count the `repair seed` lines again. At the allowance, abort pre-land without another attempt. Include `seed: <count> of <allowance>` in the exhaustion report before tearing down the ledger. Below the allowance, redo the inline seed or repeat the full pi dispatch with `target: seed`, `previous decision: none`, and `seed miss: <concrete miss>` appended to the original seed hint.
