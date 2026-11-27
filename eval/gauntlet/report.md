# eval report: gauntlet (selected samples only)

Both models met every candidate fact in the ten selected samples on the merged instructions. Eight passed on the first replay and two on the second. No other samples ran. The commit with the earlier partial runs (56eddc77) exists only on this pull request's branch and will not be on main after a squash merge.

| Sample | Outcome |
|---|---|
| [handoff-follows-pointer](results/handoff-follows-pointer/report.md) | All facts held on both models. |
| [ordinary-request-no-run](results/ordinary-request-no-run/report.md) | All facts held on both models. |
| [drafted-row-scenarios](results/drafted-row-scenarios/report.md) | All facts held on both models. |
| [legs-integration-sorted](results/legs-integration-sorted/report.md) | All facts held on both models. |
| [post-action-sorted](results/post-action-sorted/report.md) | On the first merged replay, anthropic/claude-opus-5-5 missed f1 by folding the secret-store instruction into its parent entry; the confirmation kept it indented, and both models held every fact on the second replay. |
| [pr-body-drafted-row](results/pr-body-drafted-row/report.md) | All facts held on both models. |
| [ticket-all-rows-sorted](results/ticket-all-rows-sorted/report.md) | All facts held on both models. |
| [tree-wide-drafted-row](results/tree-wide-drafted-row/report.md) | All facts held on both models. |
| [workflow-stage-drafted-row](results/workflow-stage-drafted-row/report.md) | On the first merged replay, github-copilot/gpt-6.1-sol stopped before drafting Acceptance criteria and Tests (f1, f2, f4); the confirmation held those facts, and both models held every fact on the second replay. |
| [workflow-stage-ticket-row](results/workflow-stage-ticket-row/report.md) | All facts held on both models. |

## Earlier assemblies recorded before the rebase onto main (not the linked current records)

The PR replayed the same eight samples on each assembly listed below: `drafted-row-scenarios`, `legs-integration-sorted`, `post-action-sorted`, `pr-body-drafted-row`, `ticket-all-rows-sorted`, `tree-wide-drafted-row`, `workflow-stage-drafted-row`, and `workflow-stage-ticket-row`. Both models were `unchanged` in each comparison.

- Commit-message and spec-gate edits: `for: 05bab395986c718f0c362b52caf5b6644968fccaa88289c990a660a374105f73`
- Commit-body wording change: `for: 0a563e4e1121e8747039fa6a2eaf2e9293f1e4058da5c24132a66c3d54105440`
