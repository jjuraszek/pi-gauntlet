# Ledger - loop engine
**Spec:** `doc/specs/2026-11-13-housekeeping-gauntlet-workflow-gaps.md`
base: 08cd3d462bbc9c4a270c837a5294f4c81f7f764d
verification: npm test
checks: commands
iterations: 1
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 60 node --test eval/housekeeping/spec-card-delete-keep.test.mjs; 0 passed, 3 failed; AC 1 fails because Selection has no specs partition; conformance read only, no live selection |
| 2 | open | 0 | timeout -k 30 60 node --test eval/housekeeping/spec-card-delete-keep.test.mjs; 0 passed, 3 failed; AC 2 fails because Selection does not skip plan-dir candidates; conformance read only, no live selection |
| 3 | open | 0 | timeout -k 30 60 node --test eval/housekeeping/spec-card-delete-keep.test.mjs; 0 passed, 3 failed; AC 3 fails because Selection has no no-tool directory fallback; conformance read only, no harness replay |
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

## Decisions

row 0 done | seeded 3 rows, closed 0 on baseline | row 1: separate spec candidates from content checks
