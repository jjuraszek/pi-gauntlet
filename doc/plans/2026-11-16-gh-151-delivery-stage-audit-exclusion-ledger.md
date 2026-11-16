# Ledger - loop engine
**Spec:** `doc/specs/2026-11-16-gh-151-delivery-stage-audit-exclusion.md`
base: 3171d0e124e361836d163217ff976af02c86cf2f
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | 70a0bd1f2c4599df60b4582d7355e724d5f6b4a3

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 66 passed, 1 failed; workflow-stage gate lacks a pull request's title, body, state or review |
| 7 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 6: reuse scripts/brainstorming-contract.test.mjs to widen the ticket gate and drafting rules
