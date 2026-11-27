# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gh-155-conditional-rules-on-demand.md`
base: 9492eb56fef6128ef079ecec20422b0592264273
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | 9d610c50cc3b91bedf9e2d6eec16d559ac04b27a

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 60 node --test scripts/finish-verification.test.mjs; 45 passed, 1 failed; rework preflight starts without a read pointer for PR-rework subjects |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
