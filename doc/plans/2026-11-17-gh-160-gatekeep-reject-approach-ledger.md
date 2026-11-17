# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-160-gatekeep-reject-approach.md`
base: bae599d7e7dd4f864cb8f8a23ab11221f54717da
verification: npm test
checks: commands
iterations: 5
allowance: 10
returned: 5 | home | 89ac14d1ccb21806a9387165c8da766c01043f38

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/gatekeep-reject.test.mjs; 4 passed, 0 failed; 22 model facts hold across approach-conflict-report and approach-local-instance; partial coverage, saved replays only |
| 2 | done | 1 | timeout -k 30 60 node --test scripts/gatekeep-reject.test.mjs; 6 passed, 0 failed; 16 model facts hold in approach-conflict-report after the role-first wording repair; partial coverage, one baseline and two selected candidate runs |
| 3 | done | 1 | timeout -k 30 90 node --test scripts/gatekeep-reject.test.mjs; 8 passed; eval reject-row-first-menu 8/8 facts across 2 models; eval approach-conflict-report 16/16 facts across 2 models |
| 4 | cut | 0 | deviates: an approach conflict the developer does not reject is a blocker - assess posts it and a delivery course repairs it, so it withholds merge until repaired or overruled by the developer |
| 5 | done | 1 | timeout -k 30 90 node --test scripts/gatekeep-reject.test.mjs; 10 passed, 0 failed; reject-not-after-pick 10/10 facts and two assembly refreshes 24/24 facts; partial coverage, saved replays only |
| 6 | cut | 0 | deviates: the request replaces the immediate post with a previewed note, then post and close on the last menu |
| 7 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: define approach grounds and validate first-report conflicts
row 1 done | Added six approach grounds, validated the reviewer appendix, and reported conflicts with base evidence or smaller alternatives. | Reuse scripts/gatekeep-reject.test.mjs and the two approach eval fixtures when adding rejection notes and menus.
row 2 done | Added a saved, checked rejection note with three headed sections under 180 words to the first report. | Reuse reject.md's Draft note procedure and the extended approach-conflict-report fixture for menu previews and frozen-byte posting.
row 3 done | Added reject to first initial and obstacle menus with conflict-only recommendations and ordinary ground-6 defaults. | Reuse menus.md's reject predicate and reject-row-first-menu fixtures when wiring picks and later-menu withdrawal.
row 5 done | Persisted rejection withdrawal before work and on back, and kept repair-push reviews on carried blocker closures. | Reuse post-selection-loop.md's Pick lifecycle and reject-not-after-pick fixtures for later-menu and repair-push checks.
