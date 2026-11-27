# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gh-155-conditional-rules-on-demand.md`
base: 9492eb56fef6128ef079ecec20422b0592264273
verification: npm test
checks: commands
iterations: 3
allowance: 10
returned: 3 | home | d3bd108453c72efebe1446ba62ebba47b0c1667f

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/finish-verification.test.mjs; 46 passed; only the two rework triggers load the extracted rules |
| 2 | done | 0 | timeout -k 30 60 node --test scripts/finish-verification.test.mjs; 46 passed; rework preflight precedes the push gate and its question and reply rows are preserved |
| 3 | done | 1 | timeout -k 30 60 node --test scripts/loop-dirty-tree-stop.test.mjs; 6 passed; ordinary dispatch skips the extracted stop procedure |
| 4 | done | 0 | timeout -k 30 60 node --test scripts/loop-engine-contract.test.mjs scripts/implement-amendment.test.mjs; 64 passed; stop and amendment sites load the procedure while automatic recovery skips it |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Ordinary ship menus no longer load the rework push rules. | Reuse ship/pr-branch-push.md at rework preflight and when the user selects the push row.
row 2 done | Rework subjects load the push rules before preflight and retain the close-or-leave-open gate for eligible members. | Use the pr-list-push-and-close fixture to check the narrated read order and gate.
row 3 done | Ordinary loop dispatch skips the stop and amendment rules and no longer reads separate driver-holds or stagnation files. | Reuse implement/loop/human-stop.md for human stops and ledger amendments.
row 4 done | Loop stops and ledger amendments load the procedure before acting, while interrupted returns use only the recovery procedure. | Use the human-stop-counts fixture to check read order at stops and interrupted returns.
