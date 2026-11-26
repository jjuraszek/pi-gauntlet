# eval report: gauntlet (partial run: workflow-stage-drafted-row)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 7s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-drafted-row | anthropic/claude-opus-5-5 | unchanged | 6124 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| workflow-stage-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5414 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- workflow-stage-drafted-row / anthropic/claude-opus-5-5: No fact moved between Before and After. Both outputs draft exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (missing-id rejection and naming the offending row's position), both rewrite the `npm test passes` sketch to the behavior's own observable instead of making it a row, neither adds a CI, approval, merge, or suite-run row, neither asks a cut or scope question or falls back to `none`, and both keep `npm test` as full verification plus the focused missing-id and offending-row cases in `test/importer.test.ts`. After's new Integration check correctly concludes that delivery stages yield no Integration entry on a ticketless draft and omits the empty section, so the Change's Integration sorting did not leak into drafted rows. To keep this stable, the wording should continue to state explicitly that with no ticket rows, delivery-note stages produce neither acceptance rows nor Integration entries nor a question, and that a suite-run proof sketch is rewritten to the committed behavior while the suite command stays in Tests. Minor note: After reformatted the Tests line to `Full verification - `npm test`` and dropped Before's extra `importRows` entry-point test line; neither affects a fact here, but keeping the approved `Full verification: `npm test`.` phrasing verbatim would be the safer rendering.
- workflow-stage-drafted-row / github-copilot/gpt-6.1-sol: No fact moved between Before and After on this case: both outputs render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` naming missing-id rejection and offending-row naming, keep CI, PR approval, merge and the full-suite run out of the criteria, ask no cut or scope question and emit no `none` fallback, and retain `npm test` plus the focused `test/importer.test.ts` cases in Tests. After's second row is closer to the Design wording (`names the offending row in its error`) than Before's position-based paraphrase, and After explicitly says the `npm test passes` sketch is replaced with the approved observable, which is the behavior these facts guard. To keep this stable while delivering the Change, keep the wording that treats a suite-run sketch as proof attached to a behavior rather than a row of its own, and keep the new Integration-sorting and ownership-question rules scoped to ticket rows so they do not trigger a question or a moved entry on the ticketless drafted path, where delivery notes such as CI green, PR approval and merge should stay out of both the criteria and any question.

exit: 0
