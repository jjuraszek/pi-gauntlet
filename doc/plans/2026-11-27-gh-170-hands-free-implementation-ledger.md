# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gh-170-hands-free-implementation.md`
base: a734d890b0228aacb2ab38a18278394bf77d89b1
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | d018d2e2d977c4104c073c998a7c25a69e899853

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 120 node --test scripts/loop-engine-contract.test.mjs; 52 passed, 1 failed; verify still asks for permission to implement a row reopened by an approved amendment |
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
