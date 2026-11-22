# Ledger - loop engine
**Spec:** `doc/specs/2026-11-22-chase-bug-hotfix-retry-flexibility.md`
base: c8c978b00af58e95954159235f04ae558961898c
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | ae16f74424fe4354291b2251eaf360b2568cd0aa

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 120 node --test scripts/loop-outside-return.test.mjs; 19 passed, 1 failed; hotfix seed admission aborts on a missing return file instead of routing it to seed repair |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | 1
