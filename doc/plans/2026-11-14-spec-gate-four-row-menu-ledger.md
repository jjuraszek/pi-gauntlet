# Ledger - loop engine
**Spec:** `doc/specs/2026-11-14-spec-gate-four-row-menu.md`
base: 855e872a42f9cac7a795704f3e0b383b182950ab
verification: npm test
checks: commands
iterations: 5
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 59 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 8/8 candidate facts held |
| 2 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 60 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 12/12 candidate facts held |
| 3 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 61 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 14/14 candidate facts held |
| 4 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 62 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 16/16 candidate facts held |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; FAIL five numeric context cases; status ends with ship instead of the required Context percentage line |
| 10 | open | 0 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; FAIL five unavailable context cases; status ends with ship instead of Context: unknown |
| 11 | open | 0 | |
| 12 | open | 0 | |
| 13 | open | 0 | |
| 14 | open | 0 | |
| 15 | open | 0 | |
| 16 | open | 0 | |
| 17 | open | 0 | |
| 18 | open | 0 | |
| 19 | open | 0 | |
| 20 | open | 0 | |
| 21 | open | 0 | |
| 22 | open | 0 | |
| 23 | open | 0 | |
| 24 | open | 0 | |
| 25 | open | 0 | |
| 26 | open | 0 | |

## Decisions
row 0 done | seeded 2 rows, closed 0 on baseline | row 9
row 1 done | Replaced the six-choice template with four fixed, one-sentence rows. | Extend eval/spec-gate/samples/recommended-row for recommendation cases and reuse scripts/brainstorming-contract.test.mjs for row-shape checks.
row 2 done | Added per-engine flag bullets with one-sentence defaults and the resolved loop allowance. | Reuse scripts/brainstorming-contract.test.mjs and eval/spec-gate/samples/recommended-row for flag layout and non-default allowance checks.
row 3 done | Linked one rendered recommendation tag to the first-line marker and trailing reason. | Extend scripts/brainstorming-contract.test.mjs and eval/spec-gate/samples/recommended-row to check recommendation selection.
row 4 done | Recommended row 4 above 25% with the observed percent and fresh-session instruction. | Reuse scripts/brainstorming-contract.test.mjs and eval/spec-gate/samples/recommended-row for threshold and recommendation checks.
