for: ae2b48ff69322005ead59d244e40df13ea5a5e70744fc0cbc2824deaf83d1e21

## Change
Aggregate pre-push reviewer closure lines once per companion row, reopening a contributor group or nit batch for open or missing ids without charging attempts. Retry the same row with its reopened decision and leave fully resolved rows untouched. Use the counted checkpoint for empty rounds even when failed work moved HEAD. Selected coverage is reviewer-row-reopen only; budgets, runtime admission and lifecycle recovery remain outside this iteration's model evidence. Retain the earlier loop-worker and nit-batch-row records and sample-scoped reports.

## Expected to move
- reviewer-row-reopen/r1: fails -> holds - Aggregate contributor closures into one reopening without charging an attempt.
- reviewer-row-reopen/r2: fails -> holds - Reopen one nit batch for both open and missing closure ids.
- reviewer-row-reopen/r4: fails -> holds - Retry the reopened row using its review decision and existing counters.
- reviewer-row-reopen/r6: fails -> holds - Skip review and push when the round changed no tracked source.
