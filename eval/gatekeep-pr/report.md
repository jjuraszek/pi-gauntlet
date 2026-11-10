# eval report: gatekeep-pr (selected samples only)

for: 4e38c882ff6adae6764db4690d2a5719a8d92717a810f092046aaf192124cb45

## Coverage

These are sample-scoped results, not a target-wide pass. Every invocation used `node eval/run.mjs gatekeep-pr <sample>` serially. Model cells are anthropic/claude-opus-5-5 and github-copilot/gpt-6.1-sol, in that order. Counts below are current `after: holds` facts, not an assertion that every fact passed. Full outputs, feedback and confirmations remain in each linked candidate artifact and its sibling baseline.

| Sample | Opus holds | Sol holds | Latest CLI result | Total invocation budget used |
|---|---|---|---|---|
| [action-row-one](results/action-row-one/candidate.json) | 4/4 | 4/4 | improved | 2 of 3 |
| [post-menu-set-reply](results/post-menu-set-reply/candidate.json) | 8/8 | 8/8 | improved | 3 of 3 |
| [batch-post-menu](results/batch-post-menu/candidate.json) | 6/6 | 6/6 | improved | 3 of 3 |
| [batch-cleanup-stop](results/batch-cleanup-stop/candidate.json) | 6/7 | 7/7 | unchanged | 2 of 3 |
| [conflict-free-sync](results/conflict-free-sync/candidate.json) | 5/5 | 4/5 | unchanged | 1 of 3 |
| [prior-review-delta](results/prior-review-delta/candidate.json) | 24/24 | 22/24 | inconclusive, exit 1 | 2 of 3 |
| [role-line-requested](results/role-line-requested/candidate.json) | 4/4 | 4/4 | improved | 1 of 3 |
| [bypass-merge-pick-refused](results/bypass-merge-pick-refused/candidate.json) | 5/5 | 5/5 | improved | 1 of 3 |
| [bypass-merge-pick-revoked](results/bypass-merge-pick-revoked/candidate.json) | 5/5 | 5/5 | improved | 1 of 3 |
| [per-ref-settlement](results/per-ref-settlement/candidate.json) | 4/4 | 4/4 | unchanged | 2 of 3 |
| [reviewer-row-reopen](results/reviewer-row-reopen/candidate.json) | 7/7 | 7/7 | unchanged | 2 of 3 |
| [loop-worker](results/loop-worker/candidate.json) | 10/10 | 10/10 | unchanged | 2 of 3 |
| [nit-batch-row](results/nit-batch-row/candidate.json) | 8/8 | 8/8 | unchanged | 2 of 3 |

## Limits and follow-up

- `batch-cleanup-stop` ran twice this round. The first run regressed on an obsolete cleanup flag. The migrated expectation pins persisted per-step results before the nested release pause. The second run retains one failed Opus fact, c5: the narration omits the pre-pick show-evidence inspection. Do not call this sample an all-facts pass.
- `prior-review-delta` ran twice this round and remains inconclusive. Sol reports missing new-finding locators under d14 and d15; Opus holds all 24 facts. Neither assertion was weakened to hide this disagreement. One invocation remains within the bound; resolve the report-versus-retained-record locator expectation before using it.
- `conflict-free-sync` retains Sol's failed f5: a labeled Verdict line remains. The shared replay still explicitly requests sync/verdict lines. Migrating that wrapper changes protected input hashes, including post-menu-set-reply and batch-post-menu, whose bounds are now spent. This report does not claim that wrapper is migrated.
- `plain-report` was not run. Its saved result remains untouched and proves only its original checks, not the revised D5 report shape. needs: gatekeep-pr/plain-report rerun, bound spent 3 of 3.
- Other migrated samples were not replayed; their saved artifacts are historical, not current coverage. No bundle lines changed and no baseline-only action ran.
