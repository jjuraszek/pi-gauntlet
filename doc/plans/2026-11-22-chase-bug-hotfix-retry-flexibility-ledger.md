# Ledger - loop engine
**Spec:** `doc/specs/2026-11-22-chase-bug-hotfix-retry-flexibility.md`
base: c8c978b00af58e95954159235f04ae558961898c
verification: npm test
checks: commands
iterations: 2
allowance: 10
returned: seed | home | ae16f74424fe4354291b2251eaf360b2568cd0aa

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | failed | 1 | iteration 1: interrupted - dispatch error: github-copilot API error (429): 429 quota exceeded |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | 1
repair row 1 | interrupted - dispatch error: github-copilot API error (429): 429 quota exceeded | iteration 2
