# finishing-a-development-branch eval report

for: a0884ca933d96ad47df4de3cc79e567ff17754b66eef8bf8c283a3e228fcc652

## Scope

Selected ticket #158 finishing-recovery samples against `09c9f4e1`. Both samples bundle the loop driver with its protected history and legacy-and-single-member clauses restored. The bundle-free intent binding and judge-read intent body are unchanged. Coverage is sample-scoped, not a target-wide pass; C5-C7 remain unselected.

| Sample | Evidence | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|---|
| ledger-pending-return | replayed; exit 0 | improved; 6/6 | unchanged; 6/6 |
| ledger-post-strip | restored from ef3d3387 | unchanged; 5/5 | unchanged; 5/5 |

## Evidence and findings

`ledger-post-strip` uses a candidate record restored byte-for-byte from `ef3d3387`, before `a77b7b04`. Its instruction assembly is byte-identical to that revision and matches its saved `skillSha`; `case.md`, `expected.md`, `target.json` and judge-read intent body are byte-identical too. Its replay input and judgment identity hashes match current inputs. No paid replay is needed for this sample.

`ledger-pending-return` cannot reuse that revision's record: `a77b7b04` changes its case, expected fact and bundle to supply the interrupted-recovery owner. The current fixture and assertions are retained. The candidate comparison ran with `timeout -k 30 600 node eval/run.mjs finishing-a-development-branch ledger-pending-return --base 09c9f4e1`, exit 0. Actual runner output: `finishing-a-development-branch: unchanged (report.md written; replay 2, judge 2, confirm 0, wall 51s)`. The current baseline inputs are unchanged, so the existing baseline record is retained without a baseline-only pass.

Both models hold every candidate fact in both samples. No fact held in the baseline or in the pre-fix candidate is lost. Opus's `once` improvement is observed, not an intended move: the candidate names the absolute ledger refresh path, which the saved baseline does not. No expected fact, word cap or assertion changed in this repair. Text replays inspect supplied recovery and delivery observations; they do not prove live Git or tracker execution.

## Reproduction

Restore only `eval/finishing-a-development-branch/results/ledger-post-strip/candidate.json` from `ef3d3387` after checking its assembly, fixture and judgment identities. Replay only `ledger-pending-return` with the command above if needed. Reseed a baseline only when its input changes. Unselected samples are historical evidence, not a current target-wide pass.
