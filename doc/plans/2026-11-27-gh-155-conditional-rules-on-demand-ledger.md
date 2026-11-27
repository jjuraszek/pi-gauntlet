# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gh-155-conditional-rules-on-demand.md`
base: 9492eb56fef6128ef079ecec20422b0592264273
verification: npm test
checks: commands
iterations: 2
allowance: 10
returned: 1 | home | 344fde3edc1f2c3dd0b0259df6868469d1f73783

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/finish-verification.test.mjs; 46 passed; only the two rework triggers load the extracted rules |
| 2 | done | 0 | timeout -k 30 60 node --test scripts/finish-verification.test.mjs; 46 passed; rework preflight precedes the push gate and its question and reply rows are preserved |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Ordinary ship menus no longer load the rework push rules. | Reuse ship/pr-branch-push.md at rework preflight and when the user selects the push row.
row 2 done | Rework subjects load the push rules before preflight and retain the close-or-leave-open gate for eligible members. | Use the pr-list-push-and-close fixture to check the narrated read order and gate.
