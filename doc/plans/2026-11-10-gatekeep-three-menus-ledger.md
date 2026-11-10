# Ledger - loop engine
**Spec:** `doc/specs/2026-11-10-gatekeep-three-menus.md`
base: 6939fd9ee8b3460f92fc4edb918eefe3f2d0be5c
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/gatekeep-comment-reconcile.test.mjs; ran gatekeep-pr/gate-line-first (1 of 3); ran gatekeep-pr/gate-line-first (2 of 3); 74 passed, 0 failed, candidate facts hold for both models |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |
| 11 | open | 0 | |
| 12 | open | 0 | |
| 13 | open | 0 | |
| 14 | open | 0 | |
| 15 | open | 0 | |
| 16 | open | 0 | |
| 17 | open | 0 | |
| 18 | open | 0 | |
| 19 | open | 0 | |
| 20 | open | 0 | |
| 21 | open | 0 | timeout -k 30 20 test ! -f skills/gatekeep-pr/reference/decision-menu.md; exit 1: decision-menu.md still exists; byte bounds not checked |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Put recommendations on row 1; ran gatekeep-pr/gate-line-first (1 of 3); ran gatekeep-pr/gate-line-first (2 of 3). | Reuse menus.md ordering and gate-line-first's saved candidate via scripts/gatekeep-comment-reconcile.test.mjs.
