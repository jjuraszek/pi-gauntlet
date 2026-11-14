# Ledger - loop engine
**Spec:** `doc/specs/2026-11-14-single-commit-message-contract.md`
base: 04389adbc9a13d809c958d34ff2d96f3247f6a19
verification: npm test
checks: commands
iterations: 10
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 7 | timeout -k 30 120 node --test scripts/commit-message-contract.test.mjs; 52 passed, 0 failed including 23 citation sites and isolation docs; narrowed merge-landed-message, fix-row-return-file, hotfix-return-file, hotfix-plain-landing, returned-line-recovery, legacy-ledger-conversion; no model calls after isolation, broad records historical only, parser/count/conversion execution unproven |
| 2 | done | 1 | timeout -k 30 120 node --test scripts/commit-subject-lint.test.mjs; 12 passed, 0 failed; six labels rejected, legacy and reason boundaries checked, repo scan clean; CI success and failure wiring tested in isolation, no model calls |
| 3 | done | 1 | timeout -k 30 120 node --test scripts/loop-home-worker.test.mjs; 3 passed, 0 failed; reused two current home-plain-commit wording replies and ran their isolated Git publication boundaries; no new model calls or workflow replay, row implementation and driver admission outside coverage |
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
row 1 failed | Routed amendment batches, finish landings, minors and digest records through shared wording; three named replays pass, but seven site checks fail. | Reuse the saved amendment and finish replays; wire gatekeep, hotfix, resume reconstruction, conformance and PR-head commit sites next.
row 1 done | All 23 inventoried commit sites cite shared wording; 52 checks pass after six cases were isolated without more model calls. | Reuse scripts/commit-message-contract.test.mjs and the six isolated cases; broad replays are historical, and parser/count execution still needs separate coverage.
row 2 done | Added subject-label lint and CI wiring; 12 isolated checks cover six labels, legacy/reason boundaries and the clean repo. | Reuse scripts/commit-subject-lint.mjs for scans and scripts/commit-subject-lint.test.mjs for fixtures and isolated CI wiring checks.
row 3 done | Verified home commit wording and ledger-held attribution with two current saved replies and isolated Git publication fixtures. | Reuse scripts/loop-home-worker.test.mjs to check this publication boundary without model calls; admission and recovery remain untested.
