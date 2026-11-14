# Ledger - loop engine
**Spec:** `doc/specs/2026-11-14-single-commit-message-contract.md`
base: 04389adbc9a13d809c958d34ff2d96f3247f6a19
verification: npm test
checks: commands
iterations: 6
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | failed | 5 | timeout -k 30 120 node --test scripts/commit-message-contract.test.mjs; 26 passed, 10 failed; 10 gatekeep/hotfix/resume/finish/conformance/worktree sites lack shared wording citations; model evals home-plain-commit, companion-return-file and returned-line-admission pass on 2 models |
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
row 1 failed | Routed spec, consent, housekeeping, ignore and citation-repair wording through the reference; four replays pass, but 15 site checks fail. | Reuse scripts/commit-message-contract.test.mjs and four saved replays; next wire loop inputs/attribution, amendment batches and the remaining commit sites.
row 1 escalated | implModel round | allowed attempts 10
row 1 failed | Wired shared loop wording, ledger-held attribution, companion return files and repair decisions; 10 commit-site checks still fail. | Reuse the loop interfaces and fixtures; finish amendment batches and the 10 remaining commit sites instead of reworking the loop.
