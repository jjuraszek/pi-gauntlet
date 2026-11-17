# gauntlet-resume eval report

for: 744c342bd45985d3b8442ec1ee0394cfe41af4b3959fa4369f7b475ebb1af16b

## Change

Resume accepts only current-format briefs and ledgers. The entry point routes to stage and engine owners; coordinated rules load only for multi-leg runs. Old ledgers stop without conversion or mutation. Implement-stage and verify-stage restoration preserve their distinct phase sequences, recovery evidence and task statuses.

## Sample-scoped coverage

This is not a target-wide pass. Every listed sample ran with `EVAL_CONCURRENCY=2`, `--base 09c9f4e1`, and a separate shared clone passed through `--root`: baseline-only first, then the full run. At most four samples ran concurrently; their result directories were copied back without competing report writes. No judgment-only refresh was needed because no cell ended inconclusive. The runner automatically performed confirmation replays for regressions.

| Sample | Baseline exit | Full-run exit | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|---|---|
| loop-ledger-brief | 0 | 0 | unchanged | unchanged |
| pending-owner-stops | 0 | 0 | unchanged | unchanged |
| clean-pass-unchanged | 0 | 0 | unchanged | unchanged |
| ledger-tracker-recovery | 0 | 0 | improved | unchanged |
| returned-line-recovery | 0 | 0 | unchanged | unchanged |
| ledger-tracker-verify | 0 | 1 | error: confirmation exceeded word cap | regressed |
| baseline-upgrade-preserves-statuses | 0 | 0 | unchanged | unchanged |
| legs-ok | 0 | 1 | unchanged | regressed |
| legs-receipt | 0 | 0 | unchanged | improved |
| old-ledger-stops | 0 | 0 | improved | improved |
| current-brainstorm-brief | 0 | 0 | unchanged | unchanged |
| current-plan-brief | 0 | 0 | unchanged | unchanged |

Every expected fact holds on the candidate for the ten samples whose full runs exited 0. `ledger-tracker-verify` and `legs-ok` do not satisfy the acceptance condition.

## Stop evidence

- `results/legs-ok/candidate.json`, gpt-6.1-sol, `drift`: confirmed holds -> fails. The candidate announces informational drift but stops after `plan_check` instead of finishing restoration and dispatch. Confirmation: "I cannot narrate its exact arguments or a result-dependent continuation without inventing them."
- `results/ledger-tracker-verify/candidate.json`, gpt-6.1-sol: confirmed holds -> fails for `labels` and `ambiguous-home-history`; `mixed-verify` and `verification-pending` fail before and after. The candidate says: "No phase calls, `plan_check`, `init`, refresh, ledger changes, or fresh-review dispatch occur." It rejects F's observed mixed task order because pending G3 precedes failed Conformance review. K omits the producer's verbatim status-copy statement. J's interrupted branch omits the full repair state.
- The same sample's opus initial judgment reports `mixed-verify` holds -> fails and `ambiguous-home-history` fails -> fails. Confirmation returned 1841 words against the 1800-word cap, so its final verdict is error, with judgment currency keys cleared. It is not accepted evidence.

New samples stopped being scheduled as soon as the `legs-ok` regression was recorded; already-running samples finished. No skill, agent, expected fact or word cap was changed to obtain a pass.

## Remaining selected coverage

Not started: `current-ship-brief`, `legs-membership`, `legs-wrong-primary`, `legs-home-mismatch`, `legs-missing`, `legs-wrong-repo`. Existing records for these samples remain stale after the bundle changes. The other targets' reports enumerate the selected handoff, finishing and loop samples not started. Design 9's complete fourteen-sample requirement and the complete C3/C4 refresh remain unmet. C5-C7 remain unselected.

C1/C2 read-trace evidence remains in `tool-traces/single-leg.md` and `tool-traces/coordinated.md`; text replays do not replace those traces. Repair the observed restoration failures before resuming the selected sample runs, then regenerate this report from the resulting sample-scoped records.
