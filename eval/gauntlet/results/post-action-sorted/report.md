# eval report: gauntlet (partial run: post-action-sorted)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 36s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-sorted | anthropic/claude-opus-5-5 | improved | 6156 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: holds -> holds (held); entry: fails -> holds (unplanned improvement) |
| post-action-sorted | github-copilot/gpt-6.1-sol | improved | 10621 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: fails -> holds (unplanned improvement); entry: fails -> holds (unplanned improvement) |

## Feedback

- post-action-sorted / anthropic/claude-opus-5-5: After moved f1 and f2 by routing design-sourced person steps into `## Integration`: the `DEPLOY_TOKEN` step is now its own Integration item with the secret-store line indented beneath it (Before put it in a Design `**Post-deployment housekeeping.**` paragraph, collapsed into one sentence), and the scan-time delivery note is now an Integration entry (Before omitted it from the spec entirely). f3, f4 and drain held in both: the two ticket rows are copied verbatim with `in-scope` and the Ticket ABC-204 header, no row is added and no scope question asked, the release-script changelog behavior stays in Design with a fixture-comparison Tests line, and the queue drain appears only under Integration. To keep these, retain the wording that copies ticket rows character-for-character under the provenance header, that treats script-produced PR text as a behavior kept in Design and Tests, and that keeps pause/drain/resume nested under the carried Integration entry rather than as Design imperatives. Two things to watch: After dropped the `Ticket ABC-204 entries, verbatim:` provenance line over the Integration entries, and its step 2 narration shows the header as a `Ticket <ref>, <heading>` template even though the rendered section fills it in correctly; neither moved a fact here, but stating the filled-in header in narration and keeping source provenance on carried Integration entries would make the result less fragile.
- post-action-sorted / github-copilot/gpt-6.1-sol: After moved f1, f2 and drain by rendering a real `## Integration` section: the ticket's drain entry is carried first and verbatim with the pause/resume instructions nested beneath it, the `DEPLOY_TOKEN` step is a single item with the secret-store line indented under it, and the scan-time note is its own entry. Before instead put the drain procedure in a Design `Staging preparation` subsection, folded the secret step into a Design housekeeping paragraph with the store instruction inlined, and omitted the scan-time note entirely. f3 and f4 are kept in both: the two ticket rows are verbatim with `in-scope` and ABC-204 provenance, no row is added and no scope question asked, and the release-script changelog behaviour stays in Design and in a Tests fixture comparison. One residual risk is After's Design bullet 'The scan-time note is a delivery obligation, not an additional output requirement...'. It is a disclaimer rather than an imperative, so f2 holds, but it keeps a moved item visible in Design and a stricter reader could count it. Wording that says a moved entry is written only under Integration and is not restated or disclaimed in Design, Acceptance criteria or Tests would remove that risk while keeping the verbatim ticket rows and the generated-body behaviour where they are.

exit: 0
