# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gh-109-loop-gate-set-driver-holds.md`
base: 2a946c1c088c59bbc990c2dacb1bef2cb89a3b14
verification: npm test
iterations: 4
cap: 33

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 2 | node eval/run.mjs loop-implementer command-first-evidence --base 2a946c1c088c59bbc990c2dacb1bef2cb89a3b14; exit 0, all four facts hold on both models; one replay and one judgment refreshed, other cell reused; persona and sample unchanged |
| 2 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 12 tests pass after RED; eight focused loop-implementation eval samples pass on both models, 44 candidate facts hold; full-target eval deferred to row 8 |
| 3 | open | 0 | test -f skills/finishing-a-development-branch/reference/verification-set.md; exit 1; gate-set and skip-rule reference absent |
| 4 | open | 0 | rg -n 'task.*log path' skills/loop-implementation/SKILL.md; exit 1; repair dispatch carries failing output rather than a log path |
| 5 | open | 0 | rg -n '^## Driver holds$' skills/loop-implementation/SKILL.md; exit 1; driver read boundary section absent |
| 6 | open | 0 | rg -n -F 'tail -n 20' skills/loop-implementation/SKILL.md; exit 1; bounded human-stop log excerpt absent |
| 7 | open | 0 | rg -n -i 'gate set' doc/implement-engines.md; exit 1; engine documentation still describes the full ledger command |
| 8 | open | 0 | test -f eval/loop-implementation/samples/gate-set-verify-step-1/case.md; exit 1; required gate-set verify sample absent, model evals not run |

## Decisions
row 0 done | seeded 8 rows, closed 0 on baseline | row 1
row 1 failed | Implemented command-first evidence, selector safety and row-scoped TDD; one eval replay hit a provider refusal. | Keep the persona and tests; retry command-first-evidence when the provider accepts it.
row 1 done | The unchanged command-first-evidence sample now passes with all four facts holding on both models. | Keep the persona and tests; take row 2 next and leave full-target eval completion to row 8.
row 2 done | Defined checkout-owned gate sets across driver, coordinated and conformance checks; 12 tests and eight focused evals pass. | Take row 3 for finish ownership; preserve old ledger headers and leave full-target eval runs to row 8.
