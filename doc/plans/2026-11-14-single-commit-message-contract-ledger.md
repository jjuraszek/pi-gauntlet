# Ledger - loop engine
**Spec:** `doc/specs/2026-11-14-single-commit-message-contract.md`
base: 04389adbc9a13d809c958d34ff2d96f3247f6a19
verification: npm test
checks: commands
iterations: 17
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 7 | timeout -k 30 120 node --test scripts/commit-message-contract.test.mjs; 52 passed, 0 failed including 23 citation sites and isolation docs; narrowed merge-landed-message, fix-row-return-file, hotfix-return-file, hotfix-plain-landing, returned-line-recovery, legacy-ledger-conversion; no model calls after isolation, broad records historical only, parser/count/conversion execution unproven |
| 2 | done | 1 | timeout -k 30 120 node --test scripts/commit-subject-lint.test.mjs; 12 passed, 0 failed; six labels rejected, legacy and reason boundaries checked, repo scan clean; CI success and failure wiring tested in isolation, no model calls |
| 3 | done | 1 | timeout -k 30 120 node --test scripts/loop-home-worker.test.mjs; 3 passed, 0 failed; reused two current home-plain-commit wording replies and ran their isolated Git publication boundaries; no new model calls or workflow replay, row implementation and driver admission outside coverage |
| 4 | done | 1 | timeout -k 30 120 node --test scripts/loop-home-admission.test.mjs; 5 passed, 0 failed; two current saved replies cover valid, wrong and retained tuples with one spent attempt; Git read/reset recipes executed in isolation, admission and header validation are model/text coverage, no new model calls |
| 5 | done | 1 | timeout -k 30 120 node --test scripts/loop-outside-return.test.mjs; 20 passed, 0 failed; production transport/parser and saved worker publication; eval/run.mjs gatekeep-pr/fix-row-file-observation, chase-bug/hotfix-seed-file-observation and hotfix-row-return-file passed on both models |
| 6 | done | 1 | timeout -k 30 120 node --test scripts/loop-verification-repair.test.mjs; 19 passed, 0 failed; pinned 12 bookkeeping subjects and repair/amendment decision wiring, refreshed stale verification assertions; text-contract coverage only, no driver execution or model calls |
| 7 | done | 1 | timeout -k 30 120 node --test scripts/loop-repair-counts.test.mjs; 4 passed, 0 failed; ledger-repair-counts: 2 models hold 4 facts each; instruction/model coverage only, no executable counter or end-to-end replay |
| 8 | done | 1 | timeout -k 30 120 node --test scripts/loop-worker-history.test.mjs; 6 passed, 0 failed; Git recipes cover two-worker, progress, repair and companion histories without counting decision-only parents; written hint rule checked, no driver execution or model calls |
| 9 | done | 1 | timeout -k 30 120 node --test scripts/loop-home-resume.test.mjs; 5 passed, 0 failed; Git reads and written rules checked, not executable resume; returned-line-recovery isolated replay passed in 2 model cells |
| 10 | done | 1 | timeout -k 30 120 node --test scripts/loop-legacy-conversion.test.mjs; 9 passed, 0 failed; shipped conversion recipe preserves counts and commits once; isolated legacy-ledger-conversion eval passes both model cells |
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
row 4 done | Confirmed ledger-based home admission using two current saved decision replies, written-contract assertions and isolated Git read/reset recipes. | Reuse scripts/loop-home-admission.test.mjs for local admission checks without model calls; it separates decision evidence from executable Git coverage.
row 5 done | Added checkout-local return transport and fixed gatekeep/hotfix miss handling, external headers and teardown; 20 isolated checks pass. | Reuse skills/loop-implementation/reference/return-file.md and scripts/loop-outside-return.test.mjs for transport recipes, production admission fixtures and saved decision checks.
row 6 done | Pinned 12 bookkeeping subjects and repair/amendment decision wiring; updated stale verification assertions, with 19 checks passing. | Reuse scripts/loop-verification-repair.test.mjs for isolated wording and ledger-decision checks; it does not execute the driver.
row 7 done | Verified ledger-only seed and verification counts in isolated decisions; seed stops at 3 of 3 and pending verification counts once. | Reuse scripts/loop-repair-counts.test.mjs and ledger-repair-counts saved replies for instruction/model checks, not executable driver proof.
row 8 done | Executed ledger-history Git recipes; decision-only commits stay out of worker history, including repaired and companion returns. | Reuse scripts/loop-worker-history.test.mjs for Git boundaries and written hint rules; it does not execute the driver.
row 9 done | Checked ledger-held home resume with real Git reads and an isolated admission decision; executable driver behavior remains unproven. | Reuse scripts/loop-home-resume.test.mjs for written rules, Git boundaries and current returned-line-recovery evidence.
row 10 done | Added a one-commit legacy conversion recipe with preserved repair counts and an idempotent second call. | Reuse scripts/loop-legacy-conversion.test.mjs for the Git recipe and eligibility replay; prior resume eval hashes need refresh.
