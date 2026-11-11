# Ledger - loop engine
**Spec:** `doc/specs/2026-11-11-gh-140-plan-check-delete-entries.md`
base: 196d5abb0ac05f8336839944fed72c5ae2e928bb
verification: npm test
checks: commands
iterations: 1
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |
| 2 | open | 0 | |
| 3 | open | 0 | timeout -k 30 120 node --test extensions/lib/plan-check.test.ts; 204 passed, 1 failed; Modify after Delete is still existence-checked: expected a paths-exist finding for fixture-shared.ts, got none |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |
| 11 | open | 0 | |
| 12 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 3: reuse the parameterized missing-Modify test to keep scanning after Delete
