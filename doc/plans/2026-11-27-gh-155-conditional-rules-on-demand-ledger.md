# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gh-155-conditional-rules-on-demand.md`
base: 9492eb56fef6128ef079ecec20422b0592264273
verification: npm test
checks: commands
iterations: 5
allowance: 10
returned: 5 | home | 530821b490fb3f5da5ca1e1ea5003c12602117d4
pending: verify | home | da254f9244f0fbb7b9a369aded4000eec068937d

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/finish-verification.test.mjs; 46 passed; only the two rework triggers load the extracted rules |
| 2 | done | 0 | timeout -k 30 60 node --test scripts/finish-verification.test.mjs; 46 passed; rework preflight precedes the push gate and its question and reply rows are preserved |
| 3 | done | 1 | timeout -k 30 60 node --test scripts/loop-dirty-tree-stop.test.mjs; 6 passed; ordinary dispatch skips the extracted stop procedure |
| 4 | done | 0 | timeout -k 30 60 node --test scripts/loop-engine-contract.test.mjs scripts/implement-amendment.test.mjs; 64 passed; stop and amendment sites load the procedure while automatic recovery skips it |
| 5 | done | 1 | timeout -k 30 60 node --test scripts/implement-failure-paths.test.mjs; 7 passed; ordinary waves keep the observation rules and omit all four conditional procedures |
| 6 | done | 0 | timeout -k 30 60 node --test scripts/implement-failure-paths.test.mjs; 8 passed; trigger sites route before action and lookup precedes the decision ladder |
| 7 | done | 0 | timeout -k 30 60 node --test scripts/loop-engine-contract.test.mjs scripts/implement-failure-paths.test.mjs; 62 passed; all five kept rules remain in the ordinary drivers |
| 8 | done | 0 | timeout -k 30 60 node --test scripts/implement-failure-paths.test.mjs; 9 passed; gate owners and procedure links point to their current files |
| 9 | done | 0 | timeout -k 30 60 node --test scripts/finish-verification.test.mjs scripts/loop-dirty-tree-stop.test.mjs scripts/loop-engine-contract.test.mjs scripts/implement-failure-paths.test.mjs scripts/wave-review.test.mjs scripts/loop-worker-history.test.mjs scripts/loop-home-resume.test.mjs scripts/loop-home-admission.test.mjs scripts/commit-message-contract.test.mjs scripts/implement-amendment.test.mjs scripts/loop-unreachable-cut.test.mjs scripts/loop-verification-repair.test.mjs; 231 passed; rework, human-stop and chain-recovery assertions read their new owners |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Ordinary ship menus no longer load the rework push rules. | Reuse ship/pr-branch-push.md at rework preflight and when the user selects the push row.
row 2 done | Rework subjects load the push rules before preflight and retain the close-or-leave-open gate for eligible members. | Use the pr-list-push-and-close fixture to check the narrated read order and gate.
row 3 done | Ordinary loop dispatch skips the stop and amendment rules and no longer reads separate driver-holds or stagnation files. | Reuse implement/loop/human-stop.md for human stops and ledger amendments.
row 4 done | Loop stops and ledger amendments load the procedure before acting, while interrupted returns use only the recovery procedure. | Use the human-stop-counts fixture to check read order at stops and interrupted returns.
row 5 done | Clean waves no longer load recovery, escalation or rebuild procedures, and prerequisites now live in the wave driver. | Use chain-recovery.md and escalation.md for triggered paths and the clean-wave-skips-failure-rules fixture for the ordinary path.
row 6 done | Wave failures, resumes, ladder decisions, escalations, hard stops and rebuilds now enter their procedures before acting. | Use the chain-stop-blocked and third-attempt-escalated fixtures to check read order and lookup-only routing.
row 7 done | Verified that ordinary loop and wave runs retain all five rules they need outside conditional procedures. | nothing new to build on
row 8 done | Updated the compaction, funded-round and decision-ladder links and checked the gate owners for moved rules. | Use the gate and procedure references test to detect retired paths and anchors.
row 9 done | Verified that the finish, loop and wave tests still check the moved rules in their new files. | nothing new to build on
amended | 1 item(s) | Pinned eval samples
