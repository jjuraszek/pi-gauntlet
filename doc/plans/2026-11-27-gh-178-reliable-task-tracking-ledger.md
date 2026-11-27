# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gh-178-reliable-task-tracking.md`
base: 7f1bae1e1b90ead0da5bd18083cb83690c72cdf2
verification: npm test
checks: commands
iterations: 7
allowance: 10
returned: 12 | home | a2c93978245df20b7c48526b17f0f96f6d93a723

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; lone dispatch stored the in_progress row and updated the widget; batched dispatch blocked without a write; 37 passed |
| 2 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; dispatch stored failed and complete before the retry moved the failed row to in_progress; 38 passed |
| 3 | done | 1 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; stop, reload and abort wrote no snapshots after a child returned done; status kept the dispatched row and implement in progress |
| 4 | done | 1 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; repair showed the numbered target failed and its rejected extra pending; seed repair left both rows pending; 40 passed |
| 5 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; a stop redrew after parent decisions or a blocked dispatch; abort and unknown judgment kept the prior list; 41 passed |
| 6 | done | 1 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; verify start redrew the admitted ledger and completed implement with no tracker call; empty, failed and unfinished lists refused the transition; 271 passed |
| 7 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; all four activation events reconciled a repair and retained the non-ledger task; a branch without the binding remained empty; 42 passed |
| 8 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; all six explicit actions retained their task lists; 39 passed |
| 9 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; status returned the dispatched row exactly once with its new status and label; 39 passed |
| 10 | done | 0 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; implement and verify both refused completion with row 1 in_progress despite an older empty explicit list |
| 11 | done | 1 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry.test.ts; sealed loop recorded two complete tasks and one skipped without a tracker call after init; one reopen and one implement completion; 165 passed |
| 12 | done | 1 | timeout -k 30 30 node --test scripts/tracker-refresh-instructions.test.mjs; only the seed call remains across skills and personas; nine named model samples replayed with partial coverage |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | A lone dispatch shows the bound ledger's target in progress before the worker starts; a batched dispatch is refused. | Reuse boundLedger, projectLedger and store in plan-tracker.ts for the other redraw points.
row 2 done | Dispatch records the admitted statuses before showing a retried row in progress. | Reuse the retry fixture in plan-tracker.test.ts to check the order of stored lists.
row 8 done | The tracker tests confirm that all six explicit actions still return their original task lists. | Reuse the clear-result assertion in plan-tracker.test.ts when changing explicit actions.
row 9 done | An explicit status call returns the same task list the dispatch stored, with no duplicates or reverted statuses. | Reuse the dispatch test's expected list to compare the stored and explicit results.
row 3 done | A stop, reload or abort keeps the dispatched row in progress until its return is judged, so a status call cannot finish implement from the child's changes. | Use latestPlanSnapshot(branch) in extensions/lib/plan-snapshot.ts to read the newest explicit or automatically stored list.
row 10 done | The phase tracker checks the newest stored list before completing implement or verify and reports each unfinished task by index. | Reuse the phase completion fixture in phase-tracker.test.ts to exercise stored lists against an older explicit result.
row 4 done | A repair stop shows the numbered target as failed without showing the rejected extra, and a rejected seed leaves the list unchanged. | Use settledLedger in plan-tracker.ts to check for a parent decision before reconciling the list.
row 5 done | Human stops show the settled ledger or the ledger after a blocked dispatch; without evidence of judgment the prior list stands. | Use the human-stop cases in plan-tracker.test.ts to distinguish parent decisions from unjudged worker returns.
row 7 done | Session start, switch, fork and tree restore the branch's newest list and reconcile it with a settled ledger without a tracker call. | Use the branch-activation fixture in plan-tracker.test.ts to test replay with ledger and non-ledger tasks together.
row 6 done | Starting verify redraws the admitted ledger and completes implement only when the newest list is nonempty and every task is complete or skipped. | Use the verify-start fixture in phase-tracker.test.ts to exercise both trackers without an explicit list update.
row 11 done | Sealed loop telemetry reports the final task totals at implement completion without a tracker call after the seed. | Reuse the sealed loop fixture in telemetry.test.ts to check stored list transitions, reopen counts and phase event order.
row 12 done | The loop driver seeds the task list once, and neither dispatch, amendment nor restore asks the main session to refresh it. | Run scripts/tracker-refresh-instructions.test.mjs to catch another ledger refresh instruction in skills or personas.
