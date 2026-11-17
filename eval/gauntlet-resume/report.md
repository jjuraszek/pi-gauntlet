# gauntlet-resume eval report

for: cac2fd24472bb56415c0ff6a3027cacec468fb49c0b053ea5485292d06f6dd44

## Scope

Selected ticket #158 regression samples, the three C3 current-stage samples and the five C4 coordinated stops against `09c9f4e1`. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected. Unselected samples are historical evidence, not current passes. The bundle-free intent binding and judge-read intent body are unchanged.

Only three selected samples bundle the restored loop driver. `ledger-tracker-recovery` reuses a byte-identical candidate record from `ef3d3387`; `ledger-tracker-verify` and `loop-ledger-brief` replay on their current fixtures. The other fifteen selected records are retained without replay because their assemblies do not include the changed file. No resume or handoff instruction file, sample, expected fact or word cap changes in this repair.

Model columns show runner verdict and candidate facts held/total in the saved judgment. An inconclusive cell with a failed fact blocks completion even when the runner's confirmation mechanism declines to label it a confirmed regression.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| legs-ok | unchanged; 1/1 | unchanged; 1/1 |
| ledger-tracker-verify | unchanged; 6/6 | unchanged; 6/6 |
| clean-pass-unchanged | unchanged; 3/3 | unchanged; 3/3 |
| pending-owner-stops | unchanged; 4/4 | unchanged; 4/4 |
| loop-ledger-brief | unchanged; 6/6 on a second Opus replay (the first failed `continuation` once) | unchanged; 6/6 |
| ledger-tracker-recovery | improved; 6/6 | unchanged; 6/6 |
| returned-line-recovery | unchanged; 1/1 | unchanged; 1/1 |
| baseline-upgrade-preserves-statuses | unchanged; 3/3 | unchanged; 3/3 |
| legs-receipt | unchanged; 2/2 | unchanged; 2/2 |
| old-ledger-stops | improved; 3/3 | improved; 3/3 |
| current-brainstorm-brief | unchanged; 3/3 | unchanged; 3/3 |
| current-plan-brief | unchanged; 3/3 | unchanged; 3/3 |
| current-ship-brief | unchanged; 3/3 | unchanged; 3/3 |
| legs-membership | unchanged; 1/1 | unchanged; 1/1 |
| legs-wrong-primary | unchanged; 1/1 | unchanged; 1/1 |
| legs-home-mismatch | unchanged; 1/1 | unchanged; 1/1 |
| legs-missing | unchanged; 4/4 | unchanged; 4/4 |
| legs-wrong-repo | unchanged; 1/1 | unchanged; 1/1 |

## Evidence reuse and replay

`ledger-tracker-recovery` is restored byte-for-byte from `ef3d3387`, before `a77b7b04`. Its instruction assembly is byte-identical to that revision and matches its saved `skillSha`; `case.md`, `expected.md`, `target.json` and judge-read intent body are also byte-identical. Current replay input and judgment identity hashes match. Both models hold 6/6; Opus's observed improvement on `rejected-return` is not an intended move.

`ledger-tracker-verify` cannot reuse that revision's record because its case changes in `a77b7b04` to supply the observed cut-row label and ask for the producer. `loop-ledger-brief` also changes its case there to describe exactly one settled `returned:` tuple and no `pending:`. Their expected facts are unchanged. Both current baseline assemblies and replay input hashes match the saved baseline records, so no baseline-only pass is needed. Their candidate comparisons use `timeout -k 30 600 node eval/run.mjs gauntlet-resume <sample> --base 09c9f4e1` separately, never a target-wide sweep.

Actual runner output for `ledger-tracker-verify`, exit 0: `gauntlet-resume: unchanged (report.md written; replay 2, judge 2, confirm 0, wall 106s)`.

Actual runner output for `loop-ledger-brief`, exit 1: `gauntlet-resume: inconclusive (report.md written; replay 2, judge 3, confirm 1, wall 152s)`.

## Blocker

`loop-ledger-brief`, model `anthropic/claude-opus-5-5`, fact `continuation`: the pre-fix candidate and baseline hold it; the new saved candidate judgment fails it. The judge says: "Only the continuation fact moved. After still renders the current rows, the last decision, allowance 4, iterations 5 and attempts 2 of 4, but it hands off to loop-implementation at \"step 9 -> Before each dispatch\" rather than step 5, and it makes the dispatch target conditional: row 1 only if HEAD holds an admitted `row 0 done | seeded ...` decision, otherwise seed. Before continued unconditionally at step 5 with row 1 as the target." A second replay of that one cell, run as `node eval/run.mjs gauntlet-resume loop-ledger-brief --base 09c9f4e1` after removing the saved Opus reply, holds all six facts on both models (`gauntlet-resume: unchanged (replay 1, judge 1, confirm 0)`); the saved record is that second reply, and the first failure is kept here as observed variance.

The runner performs one automatic confirmation and returns inconclusive. The failed fact remains a blocker under the repair contract. The failing record is preserved; no manual retry, assertion weakening or out-of-scope instruction edit is made. All other facts held by the ten affected samples before this repair remain held afterward. Parent review must resolve this blocker before completion.

Tool traces and the fifteen unaffected selected records are retained. Deterministic scoped tests check their bindings separately; text replays do not prove live tool execution.
