# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-153-writing-plans-partition.md`
base: 9eb7f041037d93312a7a976e08a5a447082d9b42
verification: npm test
checks: commands
iterations: 7
allowance: 10
returned: 3 | home | 376c6a9432c357fed841843850cf2364a16331af

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 68 passed, 0 failed; Three selected model replays pass after gate-line-first judgment-only refresh; SKILL.md 10885 bytes, plan-contract.md 40592 bytes, open-questions.md 3238 bytes |
| 2 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 69 passed, 0 failed; child-reads-one-contract, removal-lists-delete, maintenance-after-delete and baseline-fails-on-base pass on both models; 214 plan-check and 9 amendment tests pass, including both recorded removal plans |
| 3 | done | 4 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 70 passed, 0 failed; leg-checkout-by-branch reseeded and replayed once after its case asked for every Files kind per path and scoped the reply line to case A: six facts hold on both models, no confirmation; scripts/wave-review.test.mjs 16 passed, 0 failed |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: move child-only rules into the plan contract
row 1 done | Moved child authoring rules out of the main skill, switched dispatch to four paths, and loaded recovery questions only on demand. | Reuse plan-contract.md for child rules, open-questions.md for parent recovery, and the three selected writing-plans replay records as evidence.
row 2 done | Updated plan-writer to read the full contract on four paths and verified child authoring and maintenance with replays and plan checks. | Reuse child-reads-one-contract and the refreshed removal, maintenance and baseline fixtures for local checks during caller updates.
row 3 failed | Updated amendment and resume callers to four paths and retargeted link, leg and commit guards; the cached PR-sync replay still fails. | Keep caller and guard edits; refresh the three remaining writing-plans samples and use exact scratch paths instead of temp-directory globs.
row 3 failed | Removed full-skill bundles and refreshed three replays; both PR samples pass, but leg-checkout-by-branch still fails ownership and home-path facts. | Keep the refreshed PR records; resolve the leg replay's missing test Modify ownership and home plan path before rerunning only that sample.
row 3 failed | Isolated the leg replay to the child role; home paths now hold, but edited-test ownership and the case-C reply still fail. | Keep child-role and PR evidence; amend the word-for-word constraint before clarifying edited-test ownership, and scope replay replies by case.
row 3 escalated | implModel round | allowed attempts 10
row 3 done | Scoped the leg replay case to ask for each path's Files kinds and a per-case reply line, then reseeded and replayed it once; all six facts hold on both models. | Reuse the refreshed leg-checkout-by-branch records and report.md retained-evidence table; the contract still leaves edited-test Modify ownership implicit, as it did before the move.
