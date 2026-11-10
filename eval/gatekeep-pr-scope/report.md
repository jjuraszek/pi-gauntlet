# eval report: gatekeep-pr-scope (selected samples only)

for: fe9d31172f809b24b640b19c789ecbb3f73fcab90513802d07ec5d4854cf5ead

## Coverage

Only the two named samples ran, once each, with `node eval/run.mjs gatekeep-pr-scope <sample>`. This is not a target-wide pass. Model cells are anthropic/claude-opus-5-5 and github-copilot/gpt-6.1-sol, in that order. Full feedback and outputs remain in the linked candidate artifacts and sibling baselines.

| Sample | Opus holds | Sol holds | CLI result | Total invocation budget used |
|---|---|---|---|---|
| [mixed-coverage](results/mixed-coverage/candidate.json) | 4/5 | 5/5 | unchanged | 1 of 3 |
| [post-merge-menu](results/post-merge-menu/candidate.json) | 6/6 | 6/6 | improved | 1 of 3 |

## Limits and follow-up

The post-merge-menu facts cover row-1 combination selection, a single settlement, no post-pick menu and retained unpicked commands. The mixed-coverage Opus cell still fails f1: its opening uses four sentences instead of two and invents a deviation rationale. Do not call mixed-coverage an all-facts pass. Other migrated expectations, including cleanup-null-issue, have no fresh replay coverage. No bundle lines changed and no baseline-only action ran.
