# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gh-109-loop-gate-set-driver-holds.md`
base: 2a946c1c088c59bbc990c2dacb1bef2cb89a3b14
verification: npm test
iterations: 8
cap: 33

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 2 | node eval/run.mjs loop-implementer command-first-evidence --base 2a946c1c088c59bbc990c2dacb1bef2cb89a3b14; exit 0, all four facts hold on both models; one replay and one judgment refreshed, other cell reused; persona and sample unchanged |
| 2 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 12 tests pass after RED; eight focused loop-implementation eval samples pass on both models, 44 candidate facts hold; full-target eval deferred to row 8 |
| 3 | done | 1 | node --test scripts/finish-verification.test.mjs; 53 tests pass after RED; four focused finish eval samples pass on both models with 32 candidate facts holding; instruction bytes/lines: finish 48353/499, set 4504/32, legs 12426/76, brief 27124/290 |
| 4 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 12 tests pass, existing repair implementation unchanged; exit-verification-escalates and cap-and-exit-verification focused evals pass with current cached replies, six candidate facts hold; once-per-flow command/log handoff, unchanged rows and bounded human tail verified |
| 5 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 14 tests pass after three RED failures; driver-holds, leg-resume and loop-ledger-brief focused evals pass on both models with 28 candidate facts holding; full-target evals remain for row 8 |
| 6 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 15 tests pass with existing skill implementation unchanged; gate-set-failure, repairs-rerun-gate-set-only and loop-ledger focused evals pass with 34 candidate facts holding; session log reuse, redirected repair rerun and 20-line stop excerpt verified |
| 7 | open | 0 | rg -n -i 'gate set' doc/implement-engines.md; exit 1; engine documentation still describes the full ledger command |
| 8 | open | 0 | test -f eval/loop-implementation/samples/gate-set-verify-step-1/case.md; exit 1; required gate-set verify sample absent, model evals not run |

## Decisions
row 0 done | seeded 8 rows, closed 0 on baseline | row 1
row 1 failed | Implemented command-first evidence, selector safety and row-scoped TDD; one eval replay hit a provider refusal. | Keep the persona and tests; retry command-first-evidence when the provider accepts it.
row 1 done | The unchanged command-first-evidence sample now passes with all four facts holding on both models. | Keep the persona and tests; take row 2 next and leave full-target eval completion to row 8.
row 2 done | Defined checkout-owned gate sets across driver, coordinated and conformance checks; 12 tests and eight focused evals pass. | Take row 3 for finish ownership; preserve old ledger headers and leave full-target eval runs to row 8.
row 3 done | Finish now uses checkout-owned gate sets, logged reruns and pre-strip ledger recovery; 53 tests and four focused evals pass. | Take row 4 for repair log handoff; do not redo finish extraction, and leave full-target evals to row 8.
row 4 done | Existing repair preserves rows and once-per-flow escalation with command/log handoff and bounded human tail; 12 tests and two cached focused evals pass. | Take row 5 for driver holds; preserve the repair implementation and leave full-target evals to row 8.
row 5 done | Driver holds capture grants and leg paths outside the loop, and resume delegates gate execution; 14 tests and three focused evals pass. | Take row 6 for log limits and leave full-target evals to row 8.
row 6 done | Verified session-scoped gate logs and 20-line human-stop excerpts without changing skills; 15 contract tests and three focused evals pass. | Take row 7 for docs; preserve the log implementation and leave full-target eval runs to row 8.
