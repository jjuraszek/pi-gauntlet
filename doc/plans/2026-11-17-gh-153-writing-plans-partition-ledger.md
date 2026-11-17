# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-153-writing-plans-partition.md`
base: 9eb7f041037d93312a7a976e08a5a447082d9b42
verification: npm test
checks: commands
iterations: 6
allowance: 10
returned: 3 | home | 451aae793acf12966f87cd165a695f045072eb98

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 68 passed, 0 failed; Three selected model replays pass after gate-line-first judgment-only refresh; SKILL.md 10885 bytes, plan-contract.md 40592 bytes, open-questions.md 3238 bytes |
| 2 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 69 passed, 0 failed; child-reads-one-contract, removal-lists-delete, maintenance-after-delete and baseline-fails-on-base pass on both models; 214 plan-check and 9 amendment tests pass, including both recorded removal plans |
| 3 | failed | 3 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 69 passed, 1 failed: leg-checkout-by-branch path-roots expected holds, got fails; Only leg-checkout-by-branch reseeded and replayed: edited-test Modify absent and primary case-C reply unscoped; Adding an ownership rule requires amending the spec word-for-word constraint |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: move child-only rules into the plan contract
row 1 done | Moved child authoring rules out of the main skill, switched dispatch to four paths, and loaded recovery questions only on demand. | Reuse plan-contract.md for child rules, open-questions.md for parent recovery, and the three selected writing-plans replay records as evidence.
row 2 done | Updated plan-writer to read the full contract on four paths and verified child authoring and maintenance with replays and plan checks. | Reuse child-reads-one-contract and the refreshed removal, maintenance and baseline fixtures for local checks during caller updates.
row 3 failed | Updated amendment and resume callers to four paths and retargeted link, leg and commit guards; the cached PR-sync replay still fails. | Keep caller and guard edits; refresh the three remaining writing-plans samples and use exact scratch paths instead of temp-directory globs.
row 3 failed | Removed full-skill bundles and refreshed three replays; both PR samples pass, but leg-checkout-by-branch still fails ownership and home-path facts. | Keep the refreshed PR records; resolve the leg replay's missing test Modify ownership and home plan path before rerunning only that sample.
row 3 failed | Isolated the leg replay to the child role; home paths now hold, but edited-test ownership and the case-C reply still fail. | Keep child-role and PR evidence; amend the word-for-word constraint before clarifying edited-test ownership, and scope replay replies by case.
row 3 escalated | implModel round | allowed attempts 10
