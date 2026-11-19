# Ledger - loop engine
**Spec:** `doc/specs/2026-11-19-implement-status-stop-recovery.md`
base: d562d1bed1682c55cad6749ac51b144871ebbd4e
verification: npm test
checks: commands
iterations: 3
allowance: 10
returned: 1 | home | a567a181bf8a0d75eee84ed41d418f125c346572

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 2 | timeout -k 30 60 node --test --test-reporter=spec scripts/phase-tracker-host.test.mjs; control and production on Pi 1.5.2: summary, one boundary continuation, foreign request, final marked question; 4 passed |
| 2 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/phase-tracker.test.ts; visible marker lines vetoed recovery with and without a preamble, thinking and tool-call content did not |
| 3 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/phase-tracker.test.ts; unchanged, empty and unsuccessful snapshots did not restart a reply; after recovery, only fresh movement triggered another request |
| 4 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/phase-tracker.test.ts; all six abnormal stop reasons and an aborted boundary produced no restart; Pi 1.5.2 host check also confirmed abort after stop bypasses the boundary |
| 5 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/phase-tracker.test.ts; same branch produced one request in the parent and none at subagent depth 1 |
| 6 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/phase-tracker.test.ts; pending messages and a prior continuation each suppressed the request; Pi also ran no fallback after another handler declined delivery |
| 7 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/phase-tracker.test.ts; reload and fork matched live decisions after recovery, fresh movement and a marked stop |
| 8 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/phase-tracker.test.ts; label-only retry and status round trip each requested one restart with the terminal-failure warning; unchanged refresh and marked exhaustion requested none |
| 9 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/phase-tracker.test.ts; unchanged handoff tests passed for both messages, prior attempts, idle and abort guards |
| 10 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/phase-tracker.test.ts; neither hook requested a restart for moved tasks in brainstorm, plan, verify or ship |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: return delivery to the user before implementation; Pi 1.5.2 started the queued restart after the marked stop.
amended | 1 item(s) | Test pre-settlement delivery
row 1 failed | Pi 1.5.2 ran the control restart before the foreign marked question, but the required idle guard suppressed it because the run was still active at the boundary. | Reconcile condition 8 and AC 6 with pre-settlement delivery before wiring it; keep the host control and marked-stop assertion, not a queued fallback.
amended | 1 item(s) | Yield to pending work
row 1 done | Pi ran one implementation restart after a task moved and before the competing extension's final marked question. | Reuse the production ordering fixture in scripts/phase-tracker-host.test.mjs and the beforeSettle harness for boundary cases.
row 2 done | The tracker vetoed visible markers on line one and after a preamble but ignored identical text in private blocks. | Reuse decisionOn in extensions/phase-tracker.test.ts to evaluate recovery on a branch.
row 3 done | Replies without task movement stayed stopped after human input, a marked stop and an earlier restart. | Reuse the human and foreignTrigger branch fixtures to exercise boundaries.
row 4 done | All six abnormal stop reasons suppressed recovery, and a real Pi abort after a normal stop skipped the boundary entirely. | Reuse runWave in scripts/phase-tracker-host.test.mjs to inject competing lifecycle handlers on Pi.
row 5 done | A child replaying its parent's eligible history requested no restart. | nothing new to build on
row 6 done | Pending messages or a prior continuation suppressed the request, and declining a boundary delivery did not queue a fallback. | nothing new to build on
row 7 done | Reload and fork reproduced the live decision from the same restart, task movement and marked stop history. | nothing new to build on
row 8 done | Failed-row retries restarted on a changed attempt label or status round trip without claiming that tasks remained. | The taskSnapshot fixture accepts a label for tests of attempt-only changes.
row 9 done | Existing tests passed for both handoff messages and their original eligibility conditions. | nothing new to build on
row 10 done | Moved tasks in brainstorm, plan, verify or ship triggered neither an implementation restart nor a handoff. | nothing new to build on
amended | 1 item(s) | Abort during the pre-settlement boundary
