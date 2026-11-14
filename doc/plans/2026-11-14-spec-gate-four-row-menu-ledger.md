# Ledger - loop engine
**Spec:** `doc/specs/2026-11-14-spec-gate-four-row-menu.md`
base: 855e872a42f9cac7a795704f3e0b383b182950ab
verification: npm test
checks: commands
iterations: 12
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 59 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 8/8 candidate facts held |
| 2 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 60 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 12/12 candidate facts held |
| 3 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 61 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 14/14 candidate facts held |
| 4 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 62 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 16/16 candidate facts held |
| 5 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 63 passed; node eval/run.mjs spec-gate recommended-row engine-only held on both models; 17/18 candidate facts held after judgment-only refresh, retained flag-layout judge disagreement |
| 6 | done | 1 | timeout -k 30 120 node --test scripts/brainstorming-contract.test.mjs; 64 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 20/20 candidate facts held; zero-row fallback and high-context precedence held |
| 7 | done | 1 | timeout -k 30 120 node --test scripts/brainstorming-contract.test.mjs; 65 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 22/22 candidate facts held; bundled-row selection, cut exclusions and context precedence held |
| 8 | done | 1 | timeout -k 30 120 node --test scripts/brainstorming-contract.test.mjs; 66 passed; node eval/run.mjs spec-gate recommended-row improved on 2 models, 24/24 candidate facts held; unbundled fallback and single-observation facets held |
| 9 | done | 1 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 248 passed, 0 failed; numeric context cases round up to one decimal and ignore pi percent |
| 10 | done | 0 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 248 passed, 0 failed; five unavailable-context cases return Context: unknown |
| 11 | done | 0 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 250 passed, 0 failed; known and unknown context stay out of details, TUI results and the widget |
| 12 | done | 1 | timeout -k 30 120 node --test scripts/brainstorming-plan-approval.test.mjs; 2 passed; node eval/run.mjs brainstorming engine-waves improved on 2 models, plan-default held on both; selected sample only |
| 13 | done | 1 | timeout -k 30 30 node --test scripts/brainstorming-loop-approval.test.mjs; 2 passed; node eval/run.mjs brainstorming loop-gate proves loop on both models; other sample facts still fail and need migration |
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
row 5 done | Restricted low, unknown, or withheld draft-PR recommendations to rendered engine rows. | Reuse eval/spec-gate/samples/recommended-row's context matrix and scripts/brainstorming-contract.test.mjs for engine-selection checks.
row 6 done | Recommended the plan engine for zero acceptance rows unless context already recommends the draft PR. | Reuse eval/spec-gate/samples/recommended-row's zero-row matrix and scripts/brainstorming-contract.test.mjs for recommendation precedence checks.
row 7 done | Recommended the plan engine for the first bundled in-scope or venue row, quoting its index and separate outcomes. | Reuse eval/spec-gate/samples/recommended-row's bundled cases and scripts/brainstorming-contract.test.mjs for disposition and context precedence checks.
row 8 done | Recommended loop for unbundled acceptance rows with the exact fallback reason. | Reuse eval/spec-gate/samples/recommended-row's unbundled cases and scripts/brainstorming-contract.test.mjs to check single-observation facets and recommendation precedence.
row 9 done | Added the model-visible context percentage to phase_tracker status, rounded up to one decimal. | Reuse extensions/phase-tracker.ts status content and its seeded tests for gate context readings; doc/configuration.md documents the output.
row 10 done | Verified that absent, undefined, null-token and nonpositive-window readings return Context: unknown. | nothing new to build on
row 11 done | Verified that known and unknown context readings leave details, TUI results and the phase widget unchanged. | Reuse the status context UI-isolation cases in extensions/phase-tracker.test.ts to prevent context leakage into tracker details or UI.
row 12 done | Made plain approval 1 persist the default standing grant and waves before the verified commit-to-planning handoff. | Reuse scripts/brainstorming-plan-approval.test.mjs and engine-waves/plan-default to check the header and handoff order.
row 13 done | Made plain approval 2 persist the default grant and loop before the verified handoff, using the settings allowance. | Reuse scripts/brainstorming-loop-approval.test.mjs and loop-gate/loop to check the header and ordered handoff.
