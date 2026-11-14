# Ledger - loop engine
**Spec:** `doc/specs/2026-11-14-spec-gate-four-row-menu.md`
base: 855e872a42f9cac7a795704f3e0b383b182950ab
verification: npm test
checks: commands
iterations: 22
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
| 14 | done | 1 | timeout -k 30 30 node --test scripts/brainstorming-stop-approval.test.mjs; 2 passed; node eval/run.mjs spec-gate flag-replies improved on 2 models, both opt-out facts held; selected opt-out cases only |
| 15 | done | 1 | timeout -k 30 30 node --test scripts/brainstorming-funded-approval.test.mjs; 3 passed, 0 failed; node eval/run.mjs spec-gate flag-replies and brainstorming grant-budget-reply held 10/10 candidate facts on 2 models; selected samples only |
| 16 | done | 1 | timeout -k 30 30 node --test scripts/brainstorming-budget-only-approval.test.mjs; 2 passed, 0 failed; node eval/run.mjs spec-gate flag-replies held 8/8 candidate facts on 2 models; selected sample only |
| 17 | done | 1 | timeout -k 30 30 node --test scripts/brainstorming-allowance-approval.test.mjs; 2 tests passed; loop-allowance held on both models with a literal carrier; flag-replies plan-stop-funded failed on one model |
| 18 | done | 1 | timeout -k 30 30 node --test scripts/brainstorming-rejected-replies.test.mjs; 2 tests passed; node eval/run.mjs spec-gate flag-replies and brainstorming loop-funded-reply hold 34/34 candidate facts on 2 models; selected samples only, accepted carrier controls pass |
| 19 | done | 1 | timeout -k 30 30 node --test scripts/brainstorming-council-reply.test.mjs; 2 tests passed; node eval/run.mjs spec-gate row-3-reply improved on 2 models, 12/12 candidate facts held; selected sample only, audit and gate snapshot preserved |
| 20 | done | 1 | timeout -k 30 30 node --test scripts/brainstorming-draft-publication.test.mjs; 2 tests passed; node eval/run.mjs spec-gate option-6-handoff held 30/30 candidate facts on 2 models; selected sample only, no live publication |
| 21 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-pr-subject-gate.test.mjs; 2 passed; node eval/run.mjs brainstorming pr-subject-gate improved on 2 models with 8/8 candidate facts held; legacy scripts/brainstorming-contract.test.mjs:333-334 still asserts rows 6 and 1/2/3/6 and remains unchanged as a foreign selected test |
| 22 | done | 0 | timeout -k 30 30 node --test scripts/brainstorming-draft-publication.test.mjs; 2 tests passed; both saved zero-row gates render 1, 3, 4 without allowance flags and explain the omitted loop row |
| 23 | done | 1 | timeout -k 30 30 node --test scripts/brainstorming-worker-gate.test.mjs; 2 passed; worker-path replay improved on both models; combined omissions and hidden row 3 verified |
| 24 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-bare-approve.test.mjs; 2 passed, 0 failed; spec-gate/all-none replay: 14/14 candidate facts held on two models |
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
row 14 done | Made --amends-stop persist none with waves on row 1 and loop on row 2 before the verified handoff. | Extend eval/spec-gate/samples/flag-replies for reply cases and reuse scripts/brainstorming-stop-approval.test.mjs for opt-out persistence.
row 15 done | Made 1 --fund-rounds=3 retain the full default grant, including its final period, before appending the funding token. | Extend scripts/brainstorming-funded-approval.test.mjs and the flag-replies and grant-budget-reply samples for funded approval cases.
row 16 done | Made combined plan opt-out and funding flags persist only fund 3 fix rounds, preserving waves and the verified handoff. | Reuse scripts/brainstorming-budget-only-approval.test.mjs and flag-replies/plan-stop-funded for budget-only approval checks.
row 17 done | Kept allowance out of specs and printed the loop-entry carrier; the shared replay misses budget-only narration on one model. | Reuse scripts/brainstorming-allowance-approval.test.mjs and flag-replies/loop-allowance to check literal carrier placement.
row 18 done | Rejected invalid approval replies with one clarifying question and no file or commit changes. | Reuse scripts/brainstorming-rejected-replies.test.mjs and the flag-replies/loop-funded-reply matrices to validate reply routing.
row 19 done | Reply 3 prints the council audit verbatim and reuses the four-row gate without approval or grant. | Reuse scripts/brainstorming-council-reply.test.mjs and row-3-reply fixtures to check audit and gate-snapshot reuse.
row 20 done | Reply 4 publishes a spec-only draft PR with deferred headers and a fresh-session continuation, with create-only retry on row 4. | Reuse scripts/brainstorming-draft-publication.test.mjs and option-6-handoff fixtures for deferred publication, zero-row reachability and retry checks.
row 22 done | Zero-row gates omit loop row 2 and its flags, keep draft row 4 available, and print the loop-unavailable reason. | nothing new to build on
row 21 done | PR-subject gates now withhold draft row 4, keep engine recommendations, and clarify hidden digits or labels without mutation. | Reuse scripts/brainstorming-pr-subject-gate.test.mjs and pr-subject-gate fixtures to check withheld selections and high-context engine fallback.
row 23 done | Gates without a council audit omit row 3 even when zero-row and PR-subject rules also withhold choices. | Reuse scripts/brainstorming-worker-gate.test.mjs and worker-path fixtures to check combined omissions and hidden-row clarification.
row 24 done | Bare approve now echoes the rendered recommendation before following plan, loop, or draft-PR actions. | Reuse scripts/brainstorming-bare-approve.test.mjs and all-none fixtures to check all three recommendation continuations.
