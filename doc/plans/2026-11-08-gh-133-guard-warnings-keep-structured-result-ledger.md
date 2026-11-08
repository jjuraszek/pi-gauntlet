# Ledger - loop engine
**Spec:** `doc/specs/2026-11-08-gh-133-guard-warnings-keep-structured-result.md`
base: ca5b2913077b01c235fb246e969f8deaa3c8cf9d
verification: npm test
checks: commands
iterations: 0
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |
| 2 | open | 0 | |
| 3 | cut | 0 | deviates: the user chose delivery on the parent result over discard-and-re-fire; the fired flag stays set and the pending entry moves to the parent id (see Design, nested delivery) - the next direct `write` in the same phase receives no second advisory because it was delivered once on the parent |

## Decisions
