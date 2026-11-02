# Ledger - loop engine
**Spec:** `doc/specs/2026-11-02-gh-119-escalate-after-row-history.md`
base: bacf67852de740c3f6b2344059134eb6e20c827b
verification: npm test
checks: commands
iterations: 7
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/lib/gauntlet-settings.test.ts extensions/phase-tracker.test.ts; 240 passed; 0 failed; defaults, flooring, warning order, whole-object merge and tool response verified |
| 2 | done | 1 | node --test scripts/loop-engine-contract.test.mjs scripts/brief-contract-lint.test.mjs; 45 passed; 0 failed; threshold capture, clamping, catch-up and restore read verified |
| 3 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 44 passed, 0 failed; allowance-10-escalate-after and spent-row-escalation selected evals improved; 20 of 20 candidate facts hold, partial text-replay coverage |
| 4 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 45 passed, 0 failed; child row-history-guidance has all 6 candidate facts holding on one replay model; other replay provider refused twice, partial model coverage only |
| 5 | done | 1 | node eval/run.mjs loop-implementation row-history-guidance --base bacf67852de740c3f6b2344059134eb6e20c827b; 2 replay models improved, 14 candidate fact judgments hold; ordered-history fails on both baseline replays and holds on both candidates; partial text-replay coverage only |
| 6 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 45 passed, 0 failed; 5 selected replay samples: 4 improved, 1 unchanged; 54 candidate fact judgments hold, partial text-replay coverage |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: implement escalateAfter resolution and extend the tool response check
row 1 done | Added escalateAfter resolution and verified defaults, flooring, warnings, merge behavior and tool output. | Reuse resolveLoopEngine in extensions/lib/gauntlet-settings.ts through gauntlet_setting to capture the escalation threshold.
row 2 done | Captured escalateAfter at entry and restore, and escalation now uses the clamped threshold with catch-up. | Reuse the threshold contract in skills/loop-implementation/SKILL.md and its selected boundary and legacy-cap evals for recovery work.
row 3 done | Generalized escalated recovery to preserve remaining worker attempts and verified spent identity across grants and resume. | Reuse eval/loop-implementation/samples/allowance-10-escalate-after for threshold, held-setting, recovery and grant/resume checks.
row 4 done | Added ordered target-history guidance and verified unchanged payload; child replay coverage is partial because one provider refused. | Reuse agents/loop-implementer.md and eval/loop-implementer/samples/row-history-guidance for ordered guidance, polarity and spent-marker checks.
row 5 done | Added the driver history sample; both replay models preserve all seven facts and improve ordered history. | Reuse eval/loop-implementation/samples/row-history-guidance and its saved results for payload, history isolation and spent-marker checks.
row 6 done | Updated threshold docs and regressions; 45 contract checks pass and all five selected replay samples preserve candidate facts. | Reuse doc/configuration.md for settings semantics and eval/loop-implementation/report.md for the five-sample partial regression evidence.
