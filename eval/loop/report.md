# eval report: loop (selected sample only)

Both models met every candidate fact in [seed-dispositions](results/seed-dispositions/report.md) on the merged instructions. Both kept Integration entries out of the seed and distinguished valid returns from those needing repair. This text replay did not run a worker. No other sample was replayed on the merged instructions. The commit with the earlier partial runs (56eddc77) exists only on this pull request's branch and will not be on main after a squash merge.

## Historical results: recorded before the rebase onto main, not replayed on the merged instructions

On main, both models met every candidate fact in four text replays:

| Sample | What both replies did |
|---|---|
| [tracker-boundary](results/tracker-boundary/report.md) | Repaired rejected returns without a tracker call, including on resume. |
| [tracker-refresh](results/tracker-refresh/report.md) | Kept the single seed call and projected the returned row before retry. |
| [tracker-verify](results/tracker-verify/report.md) | Handled repair, conformance and reopened rows without another ledger list call. |
| [seed-dispositions](results/seed-dispositions/report.md) | Seeded acceptance rows without assigning Integration entries. The linked report is the later merged-instructions replay. |

The PR replays used the assemblies below. Links in the verdict table open the saved candidate for that sample, not a separate recording for each assembly.

| Replay | Assembly |
|---|---|
| Routing | `for: 9d7fc1bb98dfbcf1cc36033c7fb72979c27265533fe21f2637b49671cfed7ac3` |
| Counters | `for: 29f40f01a9232f50e3b94fee2626674432ea1975b439bb534f0b5545f20fe564` |
| Stops | `for: a126e44eb1982d8080d3685095e0474c06efafe6c309653a8e9d8eee0177bc97` |
| Purchase | `for: 647c7c5a8c5ffecae81b893ba7347a37ad1ea906d413b993f57e9c5182e25b4d` |
| Verification | `for: d123b5d0cb49d510d3e037c28764a02edc7810994a12bf95d1e6244600c2a546` |
| Seed and conformance | `for: fe7ceb0ded6181fc7492f17c068dfbb6219e9dc09a8b2ef056e282e1e174444a` |

A single verdict applies to both models. Pairs list `anthropic/claude-opus-5-5` first and `github-copilot/gpt-6.1-sol` second. Verdicts compare the candidate with the baseline; an improvement does not imply that every fact held.

| Sample | Verdict by replay |
|---|---|
| [spent-allowance-moving-or-stalled](results/spent-allowance-moving-or-stalled/candidate.json) | Routing: unchanged / improved. Counters and Stops: improved. |
| [conformance-grant](results/conformance-grant/candidate.json) | Counters: improved. Seed and conformance: improved. |
| [verify-repair-count](results/verify-repair-count/candidate.json) | Counters: inconclusive / improved. Stops and Verification: improved. |
| [stagnation-and-retry](results/stagnation-and-retry/candidate.json) | Counters and Stops: improved. |
| [cap-and-exit-verification](results/cap-and-exit-verification/candidate.json) | Counters: unchanged. Stops: improved. |
| [retired-budgets](results/retired-budgets/candidate.json) | Counters: unchanged / improved. Stops: improved / inconclusive. |
| [scaled-cap-grant](results/scaled-cap-grant/candidate.json) | Counters: improved / inconclusive. Stops: unchanged / inconclusive. |
| [funding](results/funding/candidate.json) | Counters: unchanged. |
| [exit-repair-capability](results/exit-repair-capability/candidate.json) | Counters: inconclusive / unchanged. Stops: improved. |
| [gate-set-failure](results/gate-set-failure/candidate.json) | Counters and Stops: improved. |
| [seed-interrupted-count](results/seed-interrupted-count/candidate.json) | Counters and Stops: improved. |
| [human-stop-counts](results/human-stop-counts/candidate.json) | Stops: improved. |
| [row-budget-actions](results/row-budget-actions/candidate.json) | Stops: improved. |
| [exit-verification-escalates](results/exit-verification-escalates/candidate.json) | Stops: improved. |
| [unnamed-action-asks](results/unnamed-action-asks/candidate.json) | Purchase: improved. Both replies asked before cutting the row and waited for the answer. |
| [seed-dispositions](results/seed-dispositions/candidate.json) | Seed and conformance: unchanged. All four facts held on both models. |
