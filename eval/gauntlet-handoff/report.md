# gauntlet-handoff eval report

for: a34caf993ea20dd022504a69aa0f33f2eb1ff3f825d0f14fc145e10b787950c4

## Scope

Selected ticket #158 handoff-production regressions. Both samples ran baseline-only and comparison against `09c9f4e1`, including the `multi-repo` assembly with its moved owner file. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected.

Model columns show runner verdict and candidate facts held/total. The sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| ledger-task-list | unchanged; 4/4 | unchanged; 4/4 |
| multi-repo | unchanged; 4/4 | unchanged; 4/4 |

## Reproduction

Run `EVAL_CONCURRENCY=2 node eval/run.mjs gauntlet-handoff <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above.
