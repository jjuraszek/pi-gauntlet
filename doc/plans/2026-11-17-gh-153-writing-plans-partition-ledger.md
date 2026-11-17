# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-153-writing-plans-partition.md`
base: 9eb7f041037d93312a7a976e08a5a447082d9b42
verification: npm test
checks: commands
iterations: 2
allowance: 10
returned: 1 | home | 86b28b9cdd486677fecac1d2517e6a0eaa544e28

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 68 passed, 0 failed; Three selected model replays pass after gate-line-first judgment-only refresh; SKILL.md 10885 bytes, plan-contract.md 40592 bytes, open-questions.md 3238 bytes |
| 2 | open | 0 | |
| 3 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: move child-only rules into the plan contract
row 1 done | Moved child authoring rules out of the main skill, switched dispatch to four paths, and loaded recovery questions only on demand. | Reuse plan-contract.md for child rules, open-questions.md for parent recovery, and the three selected writing-plans replay records as evidence.
