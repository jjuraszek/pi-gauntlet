# loop-implementation eval report

for: 9e96b8fd0325765ea9c8cbec26fb6133da34a1998fb5c99308ad18d17c20e49c

## Scope

Selected ticket #158 loop-admission and recovery samples against `09c9f4e1`. The driver preserves current-ledger history boundaries, legacy grant history, migrated-row escalation state, the legacy-and-single-member byte contract and dirty-tree restoration wording. Its only differences from `09c9f4e1` are Design 8's four cleanup edits. This is sample-scoped coverage, not a target-wide pass; C5-C7 remain unselected.

## Evidence reuse

Each candidate record below is restored byte-for-byte from `ef3d3387`, before `a77b7b04`. For each sample, the restored instruction assembly is byte-identical to that revision and matches the saved record's `skillSha`. Its `case.md`, `expected.md`, `target.json` and judge-read intent body are also byte-identical. The replay input hash and all five judgment identity hashes match current inputs. The bundle-free intent binding is updated; its judge-read body is unchanged. Existing baseline records are retained. No paid loop-implementation replay is needed.

Model columns show runner verdict and candidate facts held/total in the saved judgment. Records under `results/<sample>/` carry the model replies and judgments.

| Sample | Evidence | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|---|
| returned-line-admission | restored | improved; 7/7 | improved; 7/7 |
| companion-interrupted-recovery | restored | unchanged; 7/7 | unchanged; 7/7 |
| interrupted-child-redispatch | restored | improved; 10/10 | unchanged; 10/10 |
| leg-resume | restored | unchanged; 4/4 | improved; 4/4 |
| verify-repair-count | restored | unchanged; 8/8 | unchanged; 8/8 |

## Findings

Both models hold every candidate fact in all five samples. No fact held in the baseline or in the pre-fix candidate is lost. Improvements outside the intent are reported as observed, not claimed as intended changes. The saved `leg-resume` gpt-6.1-sol reply includes the loop-driver read required by `read-before-recovery-and-dirty-stop`.

The recovery cases bundle the bookkeeping wording owner, `reference/commit-message.md`. `returned-line-admission` drops the loop-restoration reference; the other four retain it. Facts and word caps are unchanged. Deterministic scoped tests separately check the saved admission replies and recovery contracts; text replays do not prove live Git or tracker execution.

## Reproduction

Restore only the five listed `eval/loop-implementation/results/<sample>/candidate.json` files with `git restore --source ef3d3387 --worktree -- <paths>` after checking assembly, fixture and judgment identities. A paid replay, if inputs change, is sample-scoped: `timeout -k 30 600 node eval/run.mjs loop-implementation <sample> --base 09c9f4e1`. Reseed a baseline only when its input changes. Unselected samples are historical evidence, not a current target-wide pass.
