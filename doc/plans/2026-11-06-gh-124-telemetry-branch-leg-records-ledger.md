# Ledger - loop engine
**Spec:** `doc/specs/2026-11-06-gh-124-telemetry-branch-leg-records.md`
base: d04aa00576eaaf802b8cdde8d8ab1917d0118f68
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node --test src/bins/gauntlet-telemetry-seal-branch.test.mjs; 2 passed; 0 failed; PR and squash preserve feature HEAD and index while publishing orphan records |
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
| 13 | open | 0 | |
| 14 | open | 0 | |
| 15 | open | 0 | |
| 16 | open | 0 | |
| 17 | open | 0 | |
| 18 | open | 0 | |
| 19 | open | 0 | |
| 20 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1 using src/bins/gauntlet-telemetry-seal-branch.test.mjs beside its bin-test siblings
row 1 done | Sealing publishes common-dir records to an orphan telemetry branch without changing feature HEAD, index, or the squash-delivered tree. | Reuse extensions/lib/telemetry-branch.ts for common-dir lookup and plumbing-based record publication; extend its sync helper for retries.
