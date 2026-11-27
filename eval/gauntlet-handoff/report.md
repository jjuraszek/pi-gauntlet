# gauntlet-handoff eval report

for: 4fc7088fcc8387ab9e5e16c1f3dc6f530467050c444aad864bd57d0954851e87

## Scope

The recovery wording change was tested on the consumer, not on handoff. The results below describe the earlier producer comparison, not a current replay.

Selected ticket #158 handoff-production regressions. Both samples ran baseline-only and comparison against `09c9f4e1`, including the `multi-repo` assembly with its moved owner file. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected. Both cases drop `reference/restore-loop.md` with `bundle-`, so the sentence restored there for `gauntlet-resume` `ledger-tracker-verify` leaves both assemblies and both records unchanged; only the target-level `for:` hash moved.

Model columns show runner verdict and candidate facts held/total. The sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| ledger-task-list | unchanged; 4/4 | unchanged; 4/4 |
| multi-repo | unchanged; 4/4 | unchanged; 4/4 |

## Reproduction

Run `EVAL_CONCURRENCY=2 node eval/run.mjs gauntlet-handoff <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above.
