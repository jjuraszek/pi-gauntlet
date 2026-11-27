# eval report: gauntlet (selected samples only)

No replay was run on the merged prompt. Both sets of results below are historical evidence for the prompts they originally compared, not coverage of the merged prompt or a target-wide pass.

## Earlier main replay: #183, after #182

Each linked report covers both replay models. No other samples were run in this replay.

| Sample | Candidate must-holds |
|---|---|
| [drafted-row-scenarios](results/drafted-row-scenarios/report.md) | All must-holds passed. |
| [handoff-follows-pointer](results/handoff-follows-pointer/report.md) | All must-holds passed. |
| [legs-integration-sorted](results/legs-integration-sorted/report.md) | All must-holds passed. |
| [loop-ledger-amend](results/loop-ledger-amend/report.md) | All must-holds passed. |
| [ordinary-request-no-run](results/ordinary-request-no-run/report.md) | All must-holds passed. |
| [post-action-sorted](results/post-action-sorted/report.md) | All must-holds passed. |
| [pr-body-drafted-row](results/pr-body-drafted-row/report.md) | All must-holds passed. |
| [ticket-all-rows-sorted](results/ticket-all-rows-sorted/report.md) | All must-holds passed. |
| [tree-wide-drafted-row](results/tree-wide-drafted-row/report.md) | All must-holds passed. |
| [workflow-stage-drafted-row](results/workflow-stage-drafted-row/report.md) | All must-holds passed. |
| [workflow-stage-ticket-row](results/workflow-stage-ticket-row/report.md) | All must-holds passed. |

## Earlier PR replay: #170

for: 05bab395986c718f0c362b52caf5b6644968fccaa88289c990a660a374105f73

The commit-message and spec-gate edits changed the assembly used by these eight samples. The PR replayed each once: `drafted-row-scenarios`, `legs-integration-sorted`, `post-action-sorted`, `pr-body-drafted-row`, `ticket-all-rows-sorted`, `tree-wide-drafted-row`, `workflow-stage-drafted-row`, and `workflow-stage-ticket-row`. Both models were `unchanged` in each comparison. The [PR's partial report](https://github.com/jjuraszek/pi-gauntlet/blob/e276e9d4793367437da6eb55b361ea65c86d8722/eval/gauntlet/report.md) preserves the `post-action-sorted` cell results and feedback and links to the PR's original records, not the main-side copies retained here. The replay did not execute a live workflow.
