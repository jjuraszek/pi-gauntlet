# Ledger - loop engine
**Spec:** `doc/specs/2026-11-19-implement-status-stop-recovery.md`
base: d562d1bed1682c55cad6749ac51b144871ebbd4e
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | 452f7bda31ce4824d4881cf444cb7a92230d0490

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=spec extensions/phase-tracker.test.ts; 250 passed, 1 failed: only the foreign handler requested a turn; Pi 1.5.2 probe with both sends saw idle=true and pending=0, then started implement-continue after gauntlet: question; delivery needs a Design decision |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: return delivery to the user before implementation; Pi 1.5.2 started the queued restart after the marked stop.
