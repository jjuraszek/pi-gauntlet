# Ledger - loop engine
**Spec:** `doc/specs/2026-11-13-housekeeping-gauntlet-workflow-gaps.md`
base: 08cd3d462bbc9c4a270c837a5294f4c81f7f764d
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test eval/housekeeping/spec-card-delete-keep.test.mjs; 3 passed, 0 failed; specs partition and content-rule fencing asserted; conformance read only, no live selection |
| 2 | done | 0 | timeout -k 30 60 node --test eval/housekeeping/spec-card-delete-keep.test.mjs; 3 passed, 0 failed; plan-dir candidates skipped before either list; conformance read only, no live selection |
| 3 | done | 0 | timeout -k 30 60 node --test eval/housekeeping/spec-card-delete-keep.test.mjs; 3 passed, 0 failed; no-tool fallback names all four default dirs; conformance read only, no harness replay |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | done | 0 | timeout -k 30 60 node --test eval/housekeeping/spec-card-named-keep.test.mjs; 1 passed, 0 failed; both empty-selection shortcuts and Report require both lists empty; conformance read only, no live selection |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |
| 11 | open | 0 | |
| 12 | open | 0 | |
| 13 | open | 0 | |

## Decisions

row 0 done | seeded 3 rows, closed 0 on baseline | row 1: separate spec candidates from content checks
row 1 done | Separated spec candidates and fenced content rules, helpers, commands and findings away from spec and plan folders. | Reuse housekeeping reference/select.md's files/specs split and reference/check.md's spec-only routing for later cards and checks.
row 2 done | Confirmed plan-dir candidates are skipped before either selected list is populated. | nothing new to build on
row 3 done | Confirmed the no-tool fallback uses doc/specs, docs/specs, doc/plans and docs/plans without new settings. | nothing new to build on
row 7 done | Routed specs-only selections through Check and reserved the empty report for two empty lists. | Extend eval/housekeeping/spec-card-named-keep.test.mjs alongside its AC 7 assertions for later banner and card checks.
