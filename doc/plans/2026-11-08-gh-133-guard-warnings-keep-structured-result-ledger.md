# Ledger - loop engine
**Spec:** `doc/specs/2026-11-08-gh-133-guard-warnings-keep-structured-result.md`
base: ca5b2913077b01c235fb246e969f8deaa3c8cf9d
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts extensions/verify-before-ship.test.ts extensions/telemetry.test.ts; 340 passed, 0 failed; all four sites preserve structured values, content tails and result metadata; no paid or external action or live smoke launched |
| 2 | done | 0 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts extensions/verify-before-ship.test.ts extensions/telemetry.test.ts; 340 passed, 0 failed; nested children stay clean, parents drain ordered warnings once, fired latches and child bookkeeping remain intact; no paid or external action or live smoke launched |
| 3 | cut | 0 | deviates: the user chose delivery on the parent result over discard-and-re-fire; the fired flag stays set and the pending entry moves to the parent id (see Design, nested delivery) - the next direct `write` in the same phase receives no second advisory because it was delivered once on the parent |

## Decisions
row 0 done | seeded 2 rows, closed 0 on baseline | row 1
row 1 done | Preserved structured results at all four warning sites with sibling regression tests and docs; no paid/external action or live smoke launched. | Reuse extensions/lib/tool-result-warning.ts to drain advisory maps without losing structured results or changing nested child values.
row 2 done | Confirmed nested warnings reach parents once in arrival order while child bookkeeping and fired latches remain intact. | nothing new to build on
