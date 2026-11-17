# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-161-per-gauntlet-temp-space.md`
base: 170b94508654b3e0944554816ec28920f9b4450a
verification: npm test
checks: commands
iterations: 2
allowance: 10
returned: 1 | home | c6965b243a5398b2ad97f4875d106ef63069d19a

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/gate-teardown.test.mjs; 9 passed; separate gate runs and child retirement preserve sibling progress; teardown-own-run-folder model replay: 2 cells improved, 5 facts hold each |
| 2 | open | 0 | |
| 3 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Added owned gate folders and a checked teardown block that preserves sibling progress. | Reuse gate-teardown-shell in post-selection-loop.md and scripts/gate-teardown.test.mjs for the remaining scratch relocation.
