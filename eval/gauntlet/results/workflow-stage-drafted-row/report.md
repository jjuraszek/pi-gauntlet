# eval report: gauntlet (partial run: workflow-stage-drafted-row)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 29s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-drafted-row | anthropic/claude-opus-5-5 | unchanged | 5994 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| workflow-stage-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5408 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- workflow-stage-drafted-row / anthropic/claude-opus-5-5: No fact moved: both outputs draft exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (missing-id rejection and offending-row naming), keep CI/approval/merge and the suite run out of the criteria, ask no cut or scope question with no `none` fallback, and retain `npm test` as full verification alongside the focused missing-id and offending-row cases in `test/importer.test.ts`. After reaches the same result by a slightly different route: it treats `npm test passes` as a run result that stays in Tests while the behavior it proves stays as row 1, and it explicitly omits an empty Integration section, which fits the Change's sorting intent without costing a row. To keep this stable, keep the wording that says a suite-run proof sketch attached to a Design behavior is rewritten to that behavior rather than dropped or cut, that delivery-note stages with no ticket source become neither rows, Tests lines, nor Integration entries, and that an empty Integration section is omitted without a question. One minor drift to watch: After narrates that the Spec Self-Review contents are not available and are not reconstructed; that is harmless here but wording that makes the step 7 read unconditional could turn that into a stop or a question in other samples, so keep the row-production rules sufficient on their own for the ticketless branch.
- workflow-stage-drafted-row / github-copilot/gpt-6.1-sol: No fact moved on this case: After, like Before, drafts exactly two unchecked in-scope rows under 'Drafted from the design, no ticket rows:' (missing-id rejection named as a behavior rather than as npm test, and the offending row identified in the error), has no CI/PR/merge/full-suite row, asks no cut or scope question and emits no none fallback, and keeps `npm test` plus the focused `test/importer.test.ts` cases under Tests. The new grouping and Integration-sorting wording did not leak into this ticketless drafted path. One small thing to watch: After's second row reads 'identifies the offending row by its position in the existing error format', which drops the explicit word 'error' as the thing that names the row and leans on 'error format'; it still reads as the committed behavior, but keeping wording close to the Design's 'names the offending row in its error' would make that row more robust. To keep these facts stable, leave the drafted-from-design path stating that a suite-proof sketch is rewritten as its behavior row, that delivery stages never become rows, and that the ownership question and Integration sorting apply only to ticket rows.

exit: 0
