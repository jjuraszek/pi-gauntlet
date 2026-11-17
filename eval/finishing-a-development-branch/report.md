# finishing-a-development-branch eval report

for: a0884ca933d96ad47df4de3cc79e567ff17754b66eef8bf8c283a3e228fcc652

## Scope

Selected ticket #158 finishing-recovery samples with moved owner files. Both samples ran baseline-only and comparison against `09c9f4e1`. `reference/commit-message.md` is no longer incorrectly declared new: that file exists at the baseline. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected.

Model columns show runner verdict and candidate facts held/total in its recorded judgment. An `unchanged` or `improved` verdict is not a claim that every expected fact holds. Sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| ledger-pending-return | unchanged; 6/6 | unchanged; 4/6 |
| ledger-post-strip | unchanged; 5/5 | unchanged; 5/5 |

## Findings

- No fact that holds in the baseline arm fails in the candidate arm in either recorded judgment.
- `ledger-pending-return` assembles `skills/gauntlet-resume/reference/restore-loop.md`, which gained one sentence for `gauntlet-resume` `ledger-tracker-verify` ("On `interrupted`, first validate the entire `<pre-dispatch HEAD>..HEAD` range, never just its last commit."), so its candidate arm reran against the existing baseline. `ledger-post-strip` drops that file with `bundle-`; its record is unchanged.
- `ledger-pending-return`, gpt-6.1-sol, `once`: the fact asks for the refresh "by absolute ledger path exactly once". Both assemblies carry the same call, `plan_tracker({ action: "refresh", path: <absolute ledger path> })` exactly once for the restore; the candidate sentence differs only by the removed migration and post-migration validation clauses. The first candidate reply on the current text was `inconclusive` (the primary reply named the single refresh without the path; the confirmation replay held the fact); the one rerun holds it.
- `ledger-pending-return`, gpt-6.1-sol, `admission` and `rejection`: both fail in both arms. Neither reply derives the return-file path from the companion checkout's own git dir, and both write "interrupted-boundary evidence" instead of `iteration 3: interrupted - 2 commits`. This predates the change. Opus holds 6/6 in both arms.
- `ledger-post-strip`: both models hold 5/5. `reference/verification-set.md` and `reference/legs.md`, which own its rules, are in both assemblies and differ from `09c9f4e1` only by one link target.

## Reproduction

Run `EVAL_CONCURRENCY=2 node eval/run.mjs finishing-a-development-branch <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above. `ledger-pending-return` used one rerun of the gpt-6.1-sol candidate cell on the current input.
