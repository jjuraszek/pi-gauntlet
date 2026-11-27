# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gh-178-reliable-task-tracking.md`
base: 7f1bae1e1b90ead0da5bd18083cb83690c72cdf2
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | 09b77dd6fbd40ee3edbd61989ce0397d99eb4661

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; dispatch left row 1 pending in the seed result instead of storing an in_progress snapshot; 36 passed, 1 failed |
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

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
