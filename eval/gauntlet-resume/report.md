# gauntlet-resume eval report

for: 744c342bd45985d3b8442ec1ee0394cfe41af4b3959fa4369f7b475ebb1af16b

## Scope

Selected ticket #158 regression samples, the three C3 current-stage samples and the five C4 coordinated stops. Every listed sample ran baseline-only and comparison against `09c9f4e1`. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected. The four target intent files already describe this change and remain bound to the current bundle-free assembly.

Model columns show the runner verdict and candidate facts held/total in its recorded judgment. An `unchanged` or `improved` verdict is not a claim that every expected fact holds. Sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| legs-ok | unchanged; 1/1 | unchanged; 1/1 |
| ledger-tracker-verify | improved; 5/6 | inconclusive; 3/6 |
| clean-pass-unchanged | unchanged; 3/3 | unchanged; 3/3 |
| pending-owner-stops | unchanged; 4/4 | unchanged; 4/4 |
| loop-ledger-brief | unchanged; 6/6 | unchanged; 6/6 |
| ledger-tracker-recovery | improved; 6/6 | unchanged; 6/6 |
| returned-line-recovery | unchanged; 1/1 | unchanged; 1/1 |
| baseline-upgrade-preserves-statuses | unchanged; 3/3 | unchanged; 3/3 |
| legs-receipt | unchanged; 2/2 | improved; 2/2 |
| old-ledger-stops | improved; 3/3 | improved; 3/3 |
| current-brainstorm-brief | unchanged; 3/3 | unchanged; 3/3 |
| current-plan-brief | unchanged; 3/3 | unchanged; 3/3 |
| current-ship-brief | unchanged; 3/3 | unchanged; 3/3 |
| legs-membership | unchanged; 1/1 | unchanged; 1/1 |
| legs-wrong-primary | unchanged; 1/1 | unchanged; 1/1 |
| legs-home-mismatch | unchanged; 1/1 | unchanged; 1/1 |
| legs-missing | unchanged; 4/4 | unchanged; 4/4 |
| legs-wrong-repo | unchanged; 1/1 | unchanged; 1/1 |

## Findings

- `legs-ok`: the base brief-contract rule, "Announce per-leg HEAD and dirty drift against live trees without stopping; identify each leg", remains in `skills/gauntlet-resume/reference/coordinated.md`. Its case no longer drops `reference/reconstruction.md`, which the route reads. Both models hold `drift` on the repaired assembly.
- `ledger-tracker-verify`: the case includes the driver's `reference/interrupted-recovery.md`, which pending recovery reads. The base rule "copy plan_tracker status verbatim" remains in `reference/brief-contract.md`; settled/interrupted/unknown handling remains in `reference/restore-loop.md`. No instruction file changed.
- `mixed-verify` fails in both arms: the F/F-repair saved list puts pending G3 before failed Conformance review, contradicting the preserved pending-suffix feasibility rule. The expected fact still requires restoration in that observed order. No expected fact was weakened or deleted to resolve this conflict.
- On gpt-6.1-sol, `verification-pending` also fails in both arms. `labels` regresses in the primary judgment, while its successful confirmation disagrees; one `--refresh-judgments` run leaves the verdict inconclusive. The primary reply abbreviates the cut-row refresh instead of printing its full criterion description. `ambiguous-home-history` now holds on both models. The prior Opus word-cap error is absent from the current record.

## Reproduction

Run `EVAL_CONCURRENCY=2 node eval/run.mjs gauntlet-resume <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above. The unresolved verify sample requires a decision about its contradictory saved task order before another paid run; its judgment refresh was already used once on the current input.
