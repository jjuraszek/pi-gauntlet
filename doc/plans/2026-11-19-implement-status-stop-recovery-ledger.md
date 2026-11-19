# Ledger - loop engine
**Spec:** `doc/specs/2026-11-19-implement-status-stop-recovery.md`
base: d562d1bed1682c55cad6749ac51b144871ebbd4e
verification: npm test
checks: commands
iterations: 2
allowance: 10
returned: 1 | home | 719c6dd5604a520ee25c28ea1aaa66523c8e98a0

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | failed | 1 | timeout -k 30 60 node --test --test-reporter=spec scripts/phase-tracker-host.test.mjs; Pi 1.5.2 control: task moved, summary, one boundary restart, foreign request, gauntlet: question was final; with the required idle guard: idle=false and pending=false at the summary, zero restarts, then the foreign request and final question; 1 passed, 1 failed |
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
amended | 1 item(s) | Test pre-settlement delivery
row 1 failed | Pi 1.5.2 ran the control restart before the foreign marked question, but the required idle guard suppressed it because the run was still active at the boundary. | Reconcile condition 8 and AC 6 with pre-settlement delivery before wiring it; keep the host control and marked-stop assertion, not a queued fallback.
amended | 1 item(s) | Yield to pending work
