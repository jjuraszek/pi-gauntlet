# eval report: gauntlet (partial run: ticket-all-rows-sorted)

for: 7ed4b14c1c62dd2647376b36c81faca71bb3dc34334b58ef1d8128301e26fdb8

wall: 25s

## Change

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ticket-all-rows-sorted | anthropic/claude-opus-5-5 | improved | 5875 | drafted: fails -> holds (unplanned improvement); provenance: fails -> holds (unplanned improvement); moved: fails -> holds (unplanned improvement) |
| ticket-all-rows-sorted | github-copilot/gpt-6.1-sol | improved | 4679 | drafted: fails -> holds (unplanned improvement); provenance: fails -> holds (unplanned improvement); moved: fails -> holds (unplanned improvement) |

## Feedback

- ticket-all-rows-sorted / anthropic/claude-opus-5-5: After moved the fact by replacing the verbatim ticket-rows header and the cutover row with a design-drafted, unchecked, in-scope row stating that the importer names the missing required column, and by moving the operator cutover row into Integration marked as a person step; Before instead kept the cutover row under a 'rows verbatim' header and pushed the diagnostic out to Design and Tests. Before held nothing on this fact, so nothing was lost. To keep the result stable, keep the wording that makes the writer draft the design's observable outcome when every ticket row is externally fulfilled, and keep moved rows out of Acceptance criteria entirely. One thing to watch: the drafted-rows header says ticket #58 'has no acceptance criteria', which is loose since the ticket does have a row that was moved; wording such as 'no file-checkable ticket rows remain; drafted from the design' would be more accurate without reintroducing a verbatim-rows header or a cutover row.
- ticket-all-rows-sorted / github-copilot/gpt-6.1-sol: After moved the fact by replacing the verbatim ticket-rows header and the cutover row with a single unchecked in-scope drafted row stating that the importer names the missing column when a required header is absent, and by relocating the operator cutover step to an Integration entry marked as a person step; Before failed because it kept the ticket-rows-verbatim header and the cutover row and drafted no diagnostic row. Before held nothing on this fact, so there is nothing to preserve from it. One wording risk in After: the lead-in says 'ticket #58 has no acceptance criteria', which is inaccurate since the ticket has one row that was moved to Integration; wording such as 'Drafted from the design; ticket #58's only row is fulfilled outside the files and is listed under Integration' would keep the drafted row and the absence of a cutover row or verbatim header while describing the ticket truthfully.

exit: 0
