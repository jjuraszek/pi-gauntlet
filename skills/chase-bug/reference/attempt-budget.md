# Hotfix attempt budget

## Seed

Before each `target: seed` dispatch, count the `repair seed` lines in the ledger's `## Decisions`. Dispatch only while the count is below `allowance:`. Never escalate a seed.

On a retryable seed miss in step 4:

1. Append `repair seed | seed miss: <concrete miss> | iteration <consumed>` to `## Decisions`. Use the bumped `iterations:` value. Leave row 1 `| 1 | open | 0 | |`.
2. Clear `pending:` and delete the return file through step 4's deletion recipe. Keep any missed commit on the hotfix branch; start the next dispatch from its tip without resetting.
3. Count the lines again. At the allowance, abort pre-land without a dispatch. Otherwise repeat the full step 4 dispatch with `target: seed`, `previous decision: none`, and `seed miss: <concrete miss>` appended to the original seed hint.
