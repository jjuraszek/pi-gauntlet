# Ledger - loop engine
**Spec:** `doc/specs/2026-11-20-gh-154-shared-ac-class-table.md`
base: 4ae8694131e79e0d0d729a51c8a6ee0932e422ec
verification: npm test
checks: commands
iterations: 2
allowance: 10
returned: 1 | home | 2acf5182d7bfd2e361cc1aa0293b56b4be97cfcc

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 70 passed; both brainstorming read instructions link to the shared class table |
| 2 | done | 0 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 70 passed; shape-ticket/SKILL.md is 47,144 bytes; cmp confirmed the eight moved table lines match 09c9f4e1 byte for byte |
| 3 | open | 0 | |
| 4 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Both brainstorming stage-proof instructions now read the shared class table at first use. | Use skills/shape-ticket/reference/ac-classes.md to assemble the six definitions for either skill's evals.
row 2 done | Replacing the inline table with a read reduced shape-ticket's main file from 48,627 to 47,144 bytes without changing any class row. | Run scripts/brainstorming-contract.test.mjs to check the six class names and all three read pointers.
