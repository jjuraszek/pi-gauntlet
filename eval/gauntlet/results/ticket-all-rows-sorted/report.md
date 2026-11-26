# eval report: gauntlet (partial run: ticket-all-rows-sorted)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 11s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ticket-all-rows-sorted | anthropic/claude-opus-5-5 | improved | 4978 | drafted: fails -> holds (unplanned improvement); provenance: fails -> holds (unplanned improvement); moved: fails -> holds (unplanned improvement) |
| ticket-all-rows-sorted | github-copilot/gpt-6.1-sol | improved | 4326 | drafted: fails -> holds (unplanned improvement); provenance: fails -> holds (unplanned improvement); moved: fails -> holds (unplanned improvement) |

## Feedback

- ticket-all-rows-sorted / anthropic/claude-opus-5-5: After moved the fact by sorting the ticket's only row ('the operator runs the cutover') out of Acceptance criteria into Integration as a marked person step, and then drafting the design's observable diagnostic as an unchecked in-scope row under a 'Drafted from the design' header; Before instead kept the cutover row verbatim under a 'rows verbatim' header and explicitly pushed the importer diagnostic out to Design and Tests, so it failed on all three counts. Before held nothing here that After lost, so there is nothing to restore. To keep this result stable, keep the wording that says when every ticket row moves to Integration the acceptance rows are drafted from the design with no ownership question, and that moved entries are carried verbatim with their kind. One thing to tighten: the header 'ticket #58 has no acceptance criteria' is slightly inaccurate, since the ticket had one row that moved; wording such as 'no file-checkable acceptance rows remain after sorting' would say what happened without reintroducing a ticket-rows-verbatim header.
- ticket-all-rows-sorted / github-copilot/gpt-6.1-sol: After moved the fact by sorting the ticket's only row (the operator cutover, a person step) into Integration and then drafting the design's observable diagnostic as an unchecked in-scope row ('the importer reports the name of the missing column'), with no cutover row and no ticket-rows-verbatim header in Acceptance criteria; Before instead kept the cutover row under a 'rows verbatim' header and drafted nothing from the design, so the fact failed there. Before held nothing on this fact, so there is nothing to preserve. One wording risk to tighten: the After lead-in 'ticket #58 has no acceptance criteria' is inaccurate, since the ticket had one row that moved to Integration; wording such as 'Drafted from the design; ticket #58's only row moved to Integration' would deliver the Change without misstating the ticket, while keeping the drafted row, its in-scope mark, and the kind-labelled Integration entry as they are.

exit: 0
