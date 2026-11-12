# Ledger - loop engine
**Spec:** `doc/specs/2026-11-11-loop-interrupted-recovery-exit.md`
base: 9dc95a5b124c06eb70dac4a7b4ec4c758970fa85
verification: npm test
checks: commands
iterations: 1
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |
| 2 | open | 0 | timeout -k 30 10 node -e 'require("node:assert/strict").doesNotMatch(require("node:fs").readFileSync("skills/loop-implementation/reference/interrupted-recovery.md", "utf8"), /Establish exclusive checkout provenance/, "AC 2: interrupted recovery must not demand checkout ownership proof")'; exit 1: recovery step 1 still demands exclusive checkout provenance |
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

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
