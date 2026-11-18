# Ledger - loop engine
**Spec:** `doc/specs/2026-11-18-gatekeep-discovery-roster.md`
base: 769b1abc3661fb0313520e093d7d0e128b21a150
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | ccadbd69336f7d18a97184cf4ed442e412e9d3d4

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 60 node --test scripts/gatekeep-comment-reconcile.test.mjs; 76 passed, 1 failed; missing discovery list heading: Open PRs to gate, smallest first: |
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
