# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-158-resume-handoff-current-shape.md`
base: 2fec03a78deb7343441354d76dd9c625b5a86efc
verification: npm test
checks: commands
iterations: 0
allowance: 10
returned: none

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | cut | 0 | deviates: the request removes backward compatibility, so such a ledger stops instead of converting |

## Decisions
