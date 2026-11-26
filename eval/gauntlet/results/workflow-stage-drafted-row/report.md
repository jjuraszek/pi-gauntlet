# eval report: gauntlet (partial run: workflow-stage-drafted-row)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 24s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-drafted-row | anthropic/claude-opus-5-5 | unchanged | 5274 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| workflow-stage-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5117 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- workflow-stage-drafted-row / anthropic/claude-opus-5-5: Nothing moved on this case: both outputs draft exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (missing-id rejection and offending-row naming), rewrite the `npm test passes` sketch to the behavior's own observable rather than a suite run, give CI/approval/merge no row, ask no cut or scope question, emit no none fallback, and keep `npm test` as full verification plus the two focused `test/importer.test.ts` cases in Tests. The After wording adds an explicit Integration check that correctly concludes the section is empty and omitted, which is harmless here. To keep this stable, retain the wording that a workflow-stage proof sketch attached to a committed behavior is rewritten to that behavior's observable (not dropped or cut), that delivery stages from notes yield neither rows nor Integration entries when there is no ticket, and that the full-suite command stays in Tests; avoid letting the new Integration-sorting language suggest that drafted design rows could be moved or questioned on the ticketless branch.
- workflow-stage-drafted-row / github-copilot/gpt-6.1-sol: Nothing moved on this case: both outputs render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` naming missing-id rejection and offending-row naming, keep CI, PR approval, merge and the full-suite run out of the criteria, ask no cut or scope question, emit no none fallback, and retain `npm test` plus the focused `test/importer.test.ts` cases in Tests. After's second row copies the Design commitment verbatim where Before paraphrased it with position; either satisfies the fact. To keep this stable while delivering the Change, keep the wording that treats a suite-run proof sketch as evidence attached to its behavior (replace the sketch, keep the row), and keep the ticket-row sorting and Integration rules scoped to cases that actually have ticket rows so they do not prompt an ownership question or a moved-row list on the ticketless drafted branch.

exit: 0
