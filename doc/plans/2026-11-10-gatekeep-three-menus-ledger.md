# Ledger - loop engine
**Spec:** `doc/specs/2026-11-10-gatekeep-three-menus.md`
base: 6939fd9ee8b3460f92fc4edb918eefe3f2d0be5c
verification: npm test
checks: commands
iterations: 4
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/gatekeep-comment-reconcile.test.mjs; ran gatekeep-pr/gate-line-first (1 of 3); ran gatekeep-pr/gate-line-first (2 of 3); 74 passed, 0 failed, candidate facts hold for both models |
| 2 | done | 1 | timeout -k 30 30 python3 -c 'assert all(s in __import__("pathlib").Path("skills/gatekeep-pr/reference/menus.md").read_text() for s in ("Recommend deliver for the human\x27s own PR, assess for someone else\x27s", "1. deliver - repair blockers, rebase on main, watch CI, repeat until merge is offered. [recommended]", "gauntlet: gate=gatekeep-pr/initial recommended=1"))'; 3 own-PR default assertions passed; no model actions launched |
| 3 | done | 1 | timeout -k 30 30 node --test scripts/gatekeep-action-recommendation.test.mjs; bound spent: gatekeep-pr/pr-body-false-claim (1 of 3); ran gatekeep-pr/pr-body-false-claim (1 of 3); 2 passed, 0 failed, all nine candidate facts hold for both models |
| 4 | done | 0 | timeout -k 30 30 python3 -c 'assert all(s in __import__("pathlib").Path("skills/gatekeep-pr/reference/menus.md").read_text() for s in ("assess for someone else\x27s when an open blocker needs the author\x27s decision", "a missing requirement, an acceptance-criteria change, or a scope choice", "Move the recommended action to row 1 before numbering every menu", "Choose the recommendation through `## Recommendation`"))'; 4 author-decision recommendation assertions passed; no further model actions launched |
| 5 | open | 0 | |
| 6 | done | 0 | timeout -k 30 30 python3 -c 'assert all(s in __import__("pathlib").Path("skills/gatekeep-pr/reference/menus.md").read_text() for s in ("Offer `accept contract change`, `preserve contract` `[recommended]`, then `stop`", "Move the recommended action to row 1 before numbering every menu", "Append ` recommended=1` to each gate line"))'; 3 preserve-contract row-1 assertions passed; no further model actions launched |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |
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
| 21 | open | 0 | timeout -k 30 20 test ! -f skills/gatekeep-pr/reference/decision-menu.md; exit 1: decision-menu.md still exists; byte bounds not checked |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Put recommendations on row 1; ran gatekeep-pr/gate-line-first (1 of 3); ran gatekeep-pr/gate-line-first (2 of 3). | Reuse menus.md ordering and gate-line-first's saved candidate via scripts/gatekeep-comment-reconcile.test.mjs.
row 2 done | Confirmed own-PR menus recommend deliver on row 1 with a local assertion; no model actions ran. | nothing new to build on
row 3 done | Enabled drafted-repair recommendations; bound spent: gatekeep-pr/pr-body-false-claim (1 of 3); ran gatekeep-pr/pr-body-false-claim (1 of 3). | Reuse menus.md Recommendation and scripts/gatekeep-action-recommendation.test.mjs to check the saved other-author body-repair result.
row 4 done | Confirmed author-only blockers recommend assess on row 1 with four local assertions and no further edits. | nothing new to build on
row 6 done | Confirmed preserve contract is recommended on row 1 with three local assertions and no further edits. | nothing new to build on
