# eval report: gauntlet (selected samples only)

Eight of the ten selected samples met every candidate fact on both models. Two comparisons were inconclusive: one candidate missed a fact on its first reply but not on confirmation. Their prior recordings remain in place. No other sample was replayed on the merged instructions; the [earlier partial runs](https://github.com/jjuraszek/pi-gauntlet/blob/56eddc7736d8aac817d522650670c2ea5f3ad880/eval/gauntlet/report.md) cover the pre-rebase instructions.

| Sample | Outcome |
|---|---|
| [handoff-follows-pointer](results/handoff-follows-pointer/report.md) | All facts held on both models. |
| [ordinary-request-no-run](results/ordinary-request-no-run/report.md) | All facts held on both models. |
| [drafted-row-scenarios](results/drafted-row-scenarios/report.md) | All facts held on both models. |
| [legs-integration-sorted](results/legs-integration-sorted/report.md) | All facts held on both models. |
| post-action-sorted | Inconclusive: the first Opus reply folded the secret-store instruction into its parent entry instead of keeping it on an indented line (f1). |
| [pr-body-drafted-row](results/pr-body-drafted-row/report.md) | All facts held on both models. |
| [ticket-all-rows-sorted](results/ticket-all-rows-sorted/report.md) | All facts held on both models. |
| [tree-wide-drafted-row](results/tree-wide-drafted-row/report.md) | All facts held on both models. |
| workflow-stage-drafted-row | Inconclusive: the first GPT reply stopped for a self-review read instead of drafting Acceptance criteria and Tests (f1, f2, f4). |
| [workflow-stage-ticket-row](results/workflow-stage-ticket-row/report.md) | All facts held on both models. |
