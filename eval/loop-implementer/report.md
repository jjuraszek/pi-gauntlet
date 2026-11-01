# eval report: loop-implementer (partial run: empty-evidence-row)

for: 6ebd3ec6c50d66b81e550839d5cf690473d7dd7e24b30e24aff8d1797ae6f7ea

wall: 51s

## Change

Treat empty evidence on an unreached row as normal after partial seeding, not as a seed failure. Create the first check before implementing that row and close or fail it with command-first evidence through the ordinary row procedure. Add empty-evidence-row to exercise a later target with no seeded check and a teammate's suggestion to repeat seeding.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| empty-evidence-row | anthropic/claude-opus-5-5 | improved | 19764 | normal-state: fails -> holds (intended change); first-check: holds -> holds (held); bounded-result: holds -> holds (held); ordinary-commit: holds -> holds (held) |
| empty-evidence-row | github-copilot/gpt-6.1-sol | improved | 24418 | normal-state: fails -> holds (intended change); first-check: holds -> holds (held); bounded-result: holds -> holds (held); ordinary-commit: fails -> holds (unplanned improvement) |

## Feedback

- empty-evidence-row / anthropic/claude-opus-5-5: After moved normal-state to holds without losing anything: step 3 explicitly states that the seed contract permits seeding a subset of rows, that the row 0 decision records a valid partial seed, and that empty evidence on an unreached row is a normal state whose fix is creating the first check, then keeps row 2 as the target. Before rejected the suggestion only on authorization grounds (a re-seed needs human-authorized recovery of an 'interrupted' seed) and deferred 'any re-seed' to the parent, which still frames the partial seed as something possibly broken rather than normal. All other facts stayed intact in After: spec read first, sibling test read before writing test/state.test.mjs, RED observed before the source edit, same file check rerun, row 2 evidence is command-first with three result lines, rows 1 and 3 and iterations 2 untouched, npm test neither run nor recorded, pending removed, explicit git add of the two files plus ledger, single commit with the exact subject and body lines, porcelain status checked, and a single row 2 decision naming test/state.test.mjs as the reusable artifact. Keep the After wording; if anything, the 'per step 4' reference could cite the rule text directly so the trace does not depend on step numbering.
- empty-evidence-row / github-copilot/gpt-6.1-sol: After moved normal-state to holds by stating outright that "Empty evidence on unreached rows is valid after partial seeding" and that the successful seed and row 1 are preserved, then proceeding to row 2's first check; Before only deferred the repair ("Do not repair the seed during this ordinary iteration") and framed the issue as scope ("does not authorize changing other rows") without ever characterizing the empty cell as normal, so it did not satisfy the fact as written. After also incidentally fixed ordinary-commit: its decision names concrete reusable artifacts (src/state.mjs's state export and test/state.test.mjs), whereas Before's decision only mentioned "a focused state test" without naming a file. first-check and bounded-result were unchanged and hold in both: spec read first, sibling test read before writing test/state.test.mjs, RED observed with actual idle versus expected active before the source edit, same-file rerun passes, row 2 done/attempts 1 with command-first two-line evidence, rows 1 and 3 and iterations 2 preserved, npm test never run. Keep After's wording; the one cosmetic nit is that git add uses the absolute /repo/doc/plans/labels-ledger.md path while the source paths are repo-relative — using doc/plans/labels-ledger.md as Before did would be more consistent without affecting any fact.

exit: 0
