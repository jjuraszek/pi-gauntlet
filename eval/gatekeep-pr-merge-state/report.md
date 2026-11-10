# eval report: gatekeep-pr-merge-state (selected samples only)

for: 784637826a9f7e65d33a037bfef84d54766471bcb764783074c410adad94a7f8

## Coverage

Each named sample ran twice this round with `node eval/run.mjs gatekeep-pr-merge-state <sample>`, serially. These four samples are not a target-wide pass. Model cells are anthropic/claude-opus-5-5 and github-copilot/gpt-6.1-sol, in that order. Full outputs, feedback and confirmations remain in the linked candidate artifacts and sibling baselines.

| Sample | Opus holds | Sol holds | Latest CLI result | Total invocation budget used |
|---|---|---|---|---|
| [bypass-eligible-green-ci](results/bypass-eligible-green-ci/candidate.json) | 5/5 | 5/5 | improved | 2 of 3 |
| [bound-viewer-green-ci](results/bound-viewer-green-ci/candidate.json) | 5/5 | 5/5 | improved | 2 of 3 |
| [flip-after-update-branch](results/flip-after-update-branch/candidate.json) | 5/5 | 5/5 | improved | 2 of 3 |
| [bypass-eligible-check-pending](results/bypass-eligible-check-pending/candidate.json) | 5/5 | 5/5 | improved | 2 of 3 |

## Repairs and limits

The first invocations regressed against stale evidence-display or row-mapping expectations. The repaired facts preserve exact-head CI resolution while keeping raw identifiers inspectable, not mandatory report prose. Flip now starts with deliver on row 1 because the ready sync needs no author decision; pending-only CI explains the running check without inventing an available override row. The second green-ci and bound-viewer invocations reused their current replay outputs and rejudged the migrated facts; their reported replay count was zero. Flip and pending each replayed four cells on the second invocation.

These facts retain ordinary merge preconditions, exact-head evidence, fail-closed eligibility and one merge row with no separate bypass row. No live merge or PR write ran. `bypass-eligible-blocked` remains historical only and was not rerun. Other migrated expectations have no fresh coverage. No bundle lines changed and no baseline-only action ran.
