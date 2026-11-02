# Ledger - loop engine
**Spec:** `doc/specs/2026-11-02-gh-119-escalate-after-row-history.md`
base: bacf67852de740c3f6b2344059134eb6e20c827b
verification: npm test
checks: commands
iterations: 4
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/lib/gauntlet-settings.test.ts extensions/phase-tracker.test.ts; 240 passed; 0 failed; defaults, flooring, warning order, whole-object merge and tool response verified |
| 2 | done | 1 | node --test scripts/loop-engine-contract.test.mjs scripts/brief-contract-lint.test.mjs; 45 passed; 0 failed; threshold capture, clamping, catch-up and restore read verified |
| 3 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 44 passed, 0 failed; allowance-10-escalate-after and spent-row-escalation selected evals improved; 20 of 20 candidate facts hold, partial text-replay coverage |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: implement escalateAfter resolution and extend the tool response check
row 1 done | Added escalateAfter resolution and verified defaults, flooring, warnings, merge behavior and tool output. | Reuse resolveLoopEngine in extensions/lib/gauntlet-settings.ts through gauntlet_setting to capture the escalation threshold.
row 2 done | Captured escalateAfter at entry and restore, and escalation now uses the clamped threshold with catch-up. | Reuse the threshold contract in skills/loop-implementation/SKILL.md and its selected boundary and legacy-cap evals for recovery work.
row 3 done | Generalized escalated recovery to preserve remaining worker attempts and verified spent identity across grants and resume. | Reuse eval/loop-implementation/samples/allowance-10-escalate-after for threshold, held-setting, recovery and grant/resume checks.
