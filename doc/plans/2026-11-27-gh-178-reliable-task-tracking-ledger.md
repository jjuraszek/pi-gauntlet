# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gh-178-reliable-task-tracking.md`
base: 7f1bae1e1b90ead0da5bd18083cb83690c72cdf2
verification: npm test
checks: commands
iterations: 3
allowance: 10
returned: 3 | home | 7b8b1a7625997a3d97b87e0c93a560675286aaf8

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; lone dispatch stored the in_progress row and updated the widget; batched dispatch blocked without a write; 37 passed |
| 2 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; dispatch stored failed and complete before the retry moved the failed row to in_progress; 38 passed |
| 3 | done | 1 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; stop, reload and abort wrote no snapshots after a child returned done; status kept the dispatched row and implement in progress |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; all six explicit actions retained their task lists; 39 passed |
| 9 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; status returned the dispatched row exactly once with its new status and label; 39 passed |
| 10 | done | 0 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; implement and verify both refused completion with row 1 in_progress despite an older empty explicit list |
| 11 | open | 0 | |
| 12 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | A lone dispatch shows the bound ledger's target in progress before the worker starts; a batched dispatch is refused. | Reuse boundLedger, projectLedger and store in plan-tracker.ts for the other redraw points.
row 2 done | Dispatch records the admitted statuses before showing a retried row in progress. | Reuse the retry fixture in plan-tracker.test.ts to check the order of stored lists.
row 8 done | The tracker tests confirm that all six explicit actions still return their original task lists. | Reuse the clear-result assertion in plan-tracker.test.ts when changing explicit actions.
row 9 done | An explicit status call returns the same task list the dispatch stored, with no duplicates or reverted statuses. | Reuse the dispatch test's expected list to compare the stored and explicit results.
row 3 done | A stop, reload or abort keeps the dispatched row in progress until its return is judged, so a status call cannot finish implement from the child's changes. | Use latestPlanSnapshot(branch) in extensions/lib/plan-snapshot.ts to read the newest explicit or automatically stored list.
row 10 done | The phase tracker checks the newest stored list before completing implement or verify and reports each unfinished task by index. | Reuse the phase completion fixture in phase-tracker.test.ts to exercise stored lists against an older explicit result.
