# Ledger - loop engine
**Spec:** `doc/specs/2026-11-14-single-commit-message-contract.md`
base: 04389adbc9a13d809c958d34ff2d96f3247f6a19
verification: npm test
checks: commands
iterations: 3
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | failed | 2 | timeout -k 30 30 node --test scripts/commit-message-contract.test.mjs; 4 passed, 21 failed: loop worker lacks wording input and 20 sites lack citations; plan/task/wave templates now use the shared recipes; selected model replays plan-commit-wording and wave-commit-wording improved on both models |
| 2 | open | 0 | |
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
| 14 | open | 0 | |
| 15 | open | 0 | |
| 16 | open | 0 | |
| 17 | open | 0 | |
| 18 | open | 0 | |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 1: add the shared reference and check its rules and commit-site citations
row 1 failed | Added the shared wording reference, but the worker still lacks its wording input and commit sites retain local templates. | Reuse commit-message.md; replace commit-site templates and pass wording/ticket inputs, then run the spec's selected evals.
row 1 failed | Replaced plan/task/wave templates with shared wording and validated two selected replays, but 21 commit-site checks still fail. | Keep scripts/commit-message-contract.test.mjs and plan/wave wiring; finish loop wording/ticket inputs and the remaining commit sites.
