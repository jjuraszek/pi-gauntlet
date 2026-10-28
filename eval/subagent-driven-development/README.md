# Subagent-driven development review sources

Check that every plan task uses the N >= 1 wave loop, pre-integration SR reads each task's applied tree, and integrated CR reads staged and unstaged work against the fixed wave base. Repairs use tree-before/tree-after deltas even when the worker commits; acceptance precedes the folded wave commit and tracker completion.

The target loads `## Fix-Loop Rounds` through (excluding) `## When a Subagent Fails` from `skills/subagent-driven-development/SKILL.md` on both arms, plus its implementer and quality-review templates and the requesting-code-review skill/template. Text replays test dispatch decisions; `scripts/wave-review.test.mjs` executes the shipped shell recipes against real Git fixtures, including whole-diff committed-range reviews outside this target.

| Sample | Must hold |
|---|---|
| all-singleton-waves | Three linear code tasks each use nested singleton implementation, SR, integration, scoped tests, initial CR and accepted wave commit before completion; chain treePath or fallback snapshot supplies SR. Plain repairs/escalation and doc-only SR-only waves remain exceptions. |
| chain-wave-dispatch | One initial implementation-to-SR chain, prose SR verdicts, task-only spec-gap repair and snapshot re-review before integrated CR. |
| chain-stop-blocked | Identity-matched artifact recovery, independent stop/error diagnosis, retained sibling snapshot SR and no second chain in the same wave. |
| patch-review-snapshot | Older runtime materializes each task's patch at its base with isolated SR cwd and retains snapshots until terminal reports are saved. |
| snapshot-apply-failure | Failed snapshot setup stops review; never reviews unchanged parent files as implementation. |
| integrated-wave-repair | Singleton integrated repair runs in place with no commit/staging payload instruction; committed new-file repair still yields a repair-only tree delta; SR precedes CR, then folded commit and completion. |
| test-gate-repair | Dirty integrated test-gate repair runs in place, reruns both scoped commands, stages changes and renews affected-task SR before initial CR. |
| singleton-apply-failure | Zero surviving integration patches skip empty gates and commit, retry from unchanged clean base within two attempts, then stop without completion. |

All inputs are synthetic. Run `node eval/run.mjs subagent-driven-development` per `eval/README.md`. The deleted committed-sequential-review sample describes no supported plan-task execution path.

Escalation and funded rounds load `reference/fix-loop.md` on both arms using preparatory baseline `828565b3b2e492005e27ec9ca3d675d51a984de6`. The reply word cap is 1800 for complete amendment aftermath and two funded fix/re-review payloads.

| Sample | Must hold |
|---|---|
| amend-under-grant | recommended; no-question; plan-dispatch; aftermath |
| redraw-under-grant | redraw-stop; no-apply |
| budget-continues | two-rounds; fix-payloads; review-gates; commit-completion |
| budget-exhausted | one-round; spent-line; no-complete |
| stagnant-under-budget | stagnant-stop; spent-line; gate |
| grant-no-budget | original-stop; no-budget; in-progress |
| budget-only-value | menu; funds; gates |
| multi-task-wave-ledger | both-ledgers; reroute; exhausted-owner; no-complete |
| exhausted-on-resume | exhausted; suffix; refund |

## Coordinated-flow coverage

Cover coordinated-flow membership, recorded per-leg contracts, checkout-local rules and dispatch, home-bound handoff/admission, receipt-validated delivery retries and single-member/legacy identity. Synthetic text replays narrate supplied file/tool observations; they do not prove live runtime execution. Preserve existing facts and accepted variance. New cases use per-sample bundle additions for full procedures omitted by legacy slices; legacy cases retain their original bundle selections. Runtime leg/baseline/wave validation remains in extensions/lib/plan-check.test.ts, brief drift in scripts/brief-contract-lint.test.mjs, and seal acceptance in the source and shipped CLI tests. Parent verification must run model comparisons for every affected target and gauntlet-handoff; no model evidence is generated here.

Assembly: target.json owns shared slices; new case.md files declare bundle+ selections without changing legacy cases. New coordinated cases retain the leg grammar. Full skill/procedure additions are limited to scenarios that need them. Each expected.md pins must-hold facts before replay. Run the full target at parent verification, not just new cases.
