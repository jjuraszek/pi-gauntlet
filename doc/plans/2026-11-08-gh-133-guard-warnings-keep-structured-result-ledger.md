# Ledger - loop engine
**Spec:** `doc/specs/2026-11-08-gh-133-guard-warnings-keep-structured-result.md`
base: ca5b2913077b01c235fb246e969f8deaa3c8cf9d
verification: npm test
checks: commands
iterations: 1
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/verify-before-ship.test.ts; 19 passed, 6 failed; direct bash loses structuredContent, synthetic write/edit omit the queued warning; no paid or external action launched |
| 2 | open | 0 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/verify-before-ship.test.ts; 19 passed, 6 failed; nested bash changes child content and loses structure, synthetic write/edit never deliver to parent; no paid or external action launched |
| 3 | cut | 0 | deviates: the user chose delivery on the parent result over discard-and-re-fire; the fired flag stays set and the pending entry moves to the parent id (see Design, nested delivery) - the next direct `write` in the same phase receives no second advisory because it was delivered once on the parent |

## Decisions
row 0 done | seeded 2 rows, closed 0 on baseline | row 1
