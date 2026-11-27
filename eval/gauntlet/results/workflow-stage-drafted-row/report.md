# eval report: gauntlet (partial run: workflow-stage-drafted-row)

for: 26d1c1f3e56ec9aa53ab90ddeed921b06ff3c19296da7ff12b5341e3cd1f9b91

wall: 27s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-drafted-row | anthropic/claude-opus-5-5 | unchanged | 5608 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| workflow-stage-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5078 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- workflow-stage-drafted-row / anthropic/claude-opus-5-5: No fact moved: both outputs render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (missing-id rejection and the error naming the offending row's position), keep `npm test passes` out of the criteria as a proof method rather than a row, exclude CI/approval/merge as delivery stages with no Integration entries, ask no cut or scope question, emit no `none` fallback, and retain `npm test` as full verification plus the focused missing-id and offending-row cases in `test/importer.test.ts`. After's only visible differences are cosmetic (it notes the Spec Self-Review read as required but unsupplied, splits the two sections into separate fenced blocks, and keeps the `Full verification: `npm test`.` line closer to the approved wording). To keep this stable while delivering the Change, keep the wording that says a suite-run proof sketch is rewritten to the behavior's own observable while the command stays in Tests, that delivery stages are neither acceptance rows nor Integration entries when there is no ticket, and that the drafted cut question fires only when an outcome leaves in-scope; make sure the new Integration-sorting and ownership-question rules are scoped explicitly to ticket rows so they do not get applied to ticketless drafted rows.
- workflow-stage-drafted-row / github-copilot/gpt-6.1-sol: Nothing moved on this case: both outputs render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:`, one for rejecting a row without an id and one for naming the offending row in the error, with no CI, PR-approval, merge or suite-run row, no cut or scope question, no `none` fallback, and a `## Tests` section that keeps `npm test` as full verification plus the focused cases in `test/importer.test.ts`. The only differences in After are cosmetic: the second row is reworded to 'identifies the offending row by its position' (still the committed behavior, drawing on the Design's position detail) and the sections are no longer inside a fenced markdown block. To keep these facts stable while delivering the Change, keep the wording that treats a suite-pass proof sketch as proof of the behavior it is attached to rather than its own row, keeps delivery stages out of drafted rows, and drafts one row per Design commitment without an ownership or cut question when no ticket rows exist; if you want less paraphrase drift, tell the writer to state each drafted row in the Design's own wording for the commitment.

exit: 0
