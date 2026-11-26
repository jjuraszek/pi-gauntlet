# eval report: gauntlet (partial run: post-action-sorted)

for: aa463f94cd7a0a80fa1d97d8cac56c122bf0661a505800f0c050c772ea02f2c5

wall: 34s

## Change

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-sorted | anthropic/claude-opus-5-5 | improved | 6932 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: holds -> holds (held); entry: fails -> holds (unplanned improvement) |
| post-action-sorted | github-copilot/gpt-6.1-sol | improved | 7653 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: fails -> holds (unplanned improvement); entry: fails -> holds (unplanned improvement) |

## Feedback

- post-action-sorted / anthropic/claude-opus-5-5: After moved f1 and f2 by sorting the design's non-file commitments into `## Integration`: the `DEPLOY_TOKEN` step is now its own Integration item with the secret-store line indented beneath it (Before put it in a `**Post-deployment housekeeping.**` paragraph inside Design), and the scan-time note is now an Integration entry (Before omitted it from the spec entirely). f3, f4 and drain were kept: both ticket rows are still copied character-for-character with `in-scope` and the Ticket ABC-204 header, no row is added and no question asked, the release-script changelog requirement stays in Design with a fixture-comparison Tests line, and the drain appears only under Integration. To keep these stable, the wording should continue to say explicitly that a ticket-row section takes no Design-derived rows, that script-produced PR text remains a criterion plus Design and Tests behavior while delivery-note PR text goes to Integration only, and that an existing Integration entry is carried first with added detail nested under it. Two small drifts in After are worth pinning even though they moved no fact here: the Integration section dropped the ticket provenance lead-in that Before had, and the Tests lines paraphrase the ticket rows rather than quoting them, so if either matters, state that Integration keeps a provenance line for carried ticket entries and that Tests lines reuse the row text verbatim. The stray `## Errors and edge cases ...` placeholder was also not requested and could be suppressed by telling the writer to render only the named sections.
- post-action-sorted / github-copilot/gpt-6.1-sol: After moved f1, f2 and drain by rendering a real `## Integration` section: the DEPLOY_TOKEN step is one item with the secret-store line nested beneath it, the scan-time note is an Integration entry with its delivery-note qualifier nested, and the queue pause/drain/resume instructions sit under the carried ticket entry instead of in a Design `Staging preparation` subsection, so Acceptance criteria, Design and Tests no longer require the drain. Before failed these because it folded the drain into Design as an operator imperative, put the secret step in a Design housekeeping paragraph with the secret store merged into the same sentence, and dropped the scan-time note entirely rather than placing it in Integration. f3 and f4 held in both: the two ticket rows are copied verbatim with in-scope dispositions and ABC-204 provenance, no row is added, no scope-cut question is asked, and the changelog-into-PR-body requirement stays in Design with a fixture comparison in Tests. To keep these, retain wording that says externally fulfilled steps go to Integration as separate items with their supplied instructions indented beneath, while script-generated PR text stays a Design behavior with a Tests line. Two minor drifts to watch in After: Design now carries two 'Verify ...' bullets that duplicate Tests, and Tests adds a 'none:' line for the unchanged entry point and error format; neither moves a fact here, but wording that keeps verification in Tests only and avoids none-fallback lines would be safer against sibling facts.

exit: 0
