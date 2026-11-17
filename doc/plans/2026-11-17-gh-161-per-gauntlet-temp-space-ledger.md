# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-161-per-gauntlet-temp-space.md`
base: 170b94508654b3e0944554816ec28920f9b4450a
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | 82e71a7cb25100329a4d1858823a577a3888efb9

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 60 node --test scripts/gate-teardown.test.mjs; 1 failed; missing gate-teardown-shell block |
| 2 | open | 0 | |
| 3 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
