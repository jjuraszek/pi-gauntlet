# eval report: gauntlet (partial run: workflow-stage-drafted-row)

for: c4a998790b00da8a2ddb379fc6330df343e3a0f6b3a3fe3e7dc43cad44ebd062

wall: 27s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-drafted-row | anthropic/claude-opus-5-5 | unchanged | 8569 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| workflow-stage-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5643 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- workflow-stage-drafted-row / anthropic/claude-opus-5-5: No fact moved on this case: both outputs draft exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (missing-id rejection and offending-row naming), keep CI/approval/merge and the full-suite run out of the criteria, ask no cut or scope question, emit no `none` fallback, and retain `npm test` as full verification alongside the focused `test/importer.test.ts` cases. After reaches the same result by a slightly different route: it treats `npm test passes` as a method of proof that belongs in Tests rather than a workflow-stage proof to rewrite, and it adds an Integration-sorting step that correctly concludes the delivery notes are non-commitments and omits the empty section. That new Integration reasoning is the one place to watch: After says the delivery stages "would be `pipeline result` kind entries" before dismissing them, so keep the wording explicit that on the ticketless drafted branch delivery notes produce neither rows nor Integration entries, lest a future sample write an Integration section from delivery notes. Also note After rendered Tests as `Full verification passes - `npm test`` instead of the approved `Full verification: `npm test`.` line; it still satisfies f4, but wording that says the approved Tests lines carry over verbatim would keep it stable, as would retaining the rule that a suite-run proof sketch keeps its committed outcome as the row.
- workflow-stage-drafted-row / github-copilot/gpt-6.1-sol: No fact moved: After still drafts exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (missing-id rejection named as the behavior, not `npm test`; offending-row naming by position), has no stage-only row for CI, PR approval, merge or a suite run, asks no cut or scope question, emits no `none` fallback, and keeps `npm test` as full verification plus focused missing-id and offending-row cases in `test/importer.test.ts`. The one drift worth guarding is in `## Tests`: After rewrote the approved section rather than carrying it, splitting the focused bullet into two, moving `Full verification: npm test` to the end, and adding an `importRows` entry-point case that the approved Tests section did not contain. f4 still holds because the command and both focused cases remain, but a wording that says to carry the approved `## Tests` section verbatim when no Design commitment changes, and to add test lines only for a commitment not already covered, would keep this stable while still delivering the ticket-row sorting and grouped-constraint change.

exit: 0
