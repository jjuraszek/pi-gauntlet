# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-153-writing-plans-partition.md`
base: 9eb7f041037d93312a7a976e08a5a447082d9b42
verification: npm test
checks: commands
iterations: 4
allowance: 10
returned: 3 | home | 69b6afc37aefff18fb0414ee661136ea347a215c

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 68 passed, 0 failed; Three selected model replays pass after gate-line-first judgment-only refresh; SKILL.md 10885 bytes, plan-contract.md 40592 bytes, open-questions.md 3238 bytes |
| 2 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 69 passed, 0 failed; child-reads-one-contract, removal-lists-delete, maintenance-after-delete and baseline-fails-on-base pass on both models; 214 plan-check and 9 amendment tests pass, including both recorded removal plans |
| 3 | failed | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 69 passed, 1 failed: cached pr-subject-sync-repair member-first is fails, expected holds; Scratch inventory timed out after 20 s before model replays launched; Retargeted wave and commit checks pass 70 tests |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: move child-only rules into the plan contract
row 1 done | Moved child authoring rules out of the main skill, switched dispatch to four paths, and loaded recovery questions only on demand. | Reuse plan-contract.md for child rules, open-questions.md for parent recovery, and the three selected writing-plans replay records as evidence.
row 2 done | Updated plan-writer to read the full contract on four paths and verified child authoring and maintenance with replays and plan checks. | Reuse child-reads-one-contract and the refreshed removal, maintenance and baseline fixtures for local checks during caller updates.
row 3 failed | Updated amendment and resume callers to four paths and retargeted link, leg and commit guards; the cached PR-sync replay still fails. | Keep caller and guard edits; refresh the three remaining writing-plans samples and use exact scratch paths instead of temp-directory globs.
