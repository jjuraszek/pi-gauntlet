# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-153-writing-plans-partition.md`
base: 9eb7f041037d93312a7a976e08a5a447082d9b42
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | 1a4c571ea69bd9fd14bc02308c5aa9afb83ecb84

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 67 passed, 1 failed; Child-only authoring headings must not load into the main session: all ten remain in SKILL.md |
| 2 | open | 0 | |
| 3 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: move child-only rules into the plan contract
