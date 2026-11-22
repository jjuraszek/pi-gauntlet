# Ledger - loop engine
**Spec:** `doc/specs/2026-11-22-chase-bug-hotfix-retry-flexibility.md`
base: c8c978b00af58e95954159235f04ae558961898c
verification: npm test
checks: commands
iterations: 3
allowance: 10
returned: 1 | home | 6ab282dc0dd1729fcd3eae81aa6bed2c198e19d5

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 2 | timeout -k 30 120 node --test scripts/loop-outside-return.test.mjs; 20 passed; hotfix-return-file and hotfix-seed-file-observation both improved on both replay models |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | 1
repair row 1 | interrupted - dispatch error: github-copilot API error (429): 429 quota exceeded | iteration 2
row 1 done | A missed hotfix seed now records the reason and retries with that hint without spending a row attempt. | Extend skills/chase-bug/reference/attempt-budget.md for later budgets; the eval target already loads it.
