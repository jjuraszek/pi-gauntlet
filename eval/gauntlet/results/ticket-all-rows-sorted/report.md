# eval report: gauntlet (partial run: ticket-all-rows-sorted)

for: c4a998790b00da8a2ddb379fc6330df343e3a0f6b3a3fe3e7dc43cad44ebd062

wall: 11s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ticket-all-rows-sorted | anthropic/claude-opus-5-5 | improved | 5191 | drafted: fails -> holds (unplanned improvement); provenance: fails -> holds (unplanned improvement); moved: fails -> holds (unplanned improvement) |
| ticket-all-rows-sorted | github-copilot/gpt-6.1-sol | improved | 4610 | drafted: fails -> holds (unplanned improvement); provenance: fails -> holds (unplanned improvement); moved: fails -> holds (unplanned improvement) |

## Feedback

- ticket-all-rows-sorted / anthropic/claude-opus-5-5: After moves the fact to holds: because the ticket's only row is a person step, After sorts it out of Acceptance criteria into Integration (marked 'ticket row, not an acceptance criterion: person step') and, with no ticket rows left, drafts the design's observable diagnostic as an unchecked in-scope row under a 'Drafted from the design' header, with no cutover row and no rows-verbatim header. Before instead kept the cutover row verbatim under a 'Ticket #58, checkbox list, rows verbatim' header and explicitly held the importer diagnostic out of the section, so it failed on all three points. Before held nothing on this fact, so there is nothing to preserve; to keep After stable, keep the wording that says a ticket whose rows all move to Integration leaves zero AC rows and therefore takes the drafted-row branch and its header. One wording risk: the header 'ticket #58 has no acceptance criteria' is slightly inaccurate since the ticket had a row that was moved; phrasing such as 'no file-checkable acceptance criteria remain after sorting' would be more precise without changing the result.
- ticket-all-rows-sorted / github-copilot/gpt-6.1-sol: After moved the fact by sorting the ticket's only row (the operator cutover, a person step) out of Acceptance criteria into Integration and replacing the 'rows verbatim' header with a drafted header plus one unchecked in-scope row stating that the importer reports the name of the missing column when a required header is absent; Before instead kept the cutover row verbatim under a ticket-rows-verbatim header and drafted no diagnostic row, so the fact failed there. Nothing Before held was lost. To keep this result stable, keep the wording that says when every ticket row is moved out as externally fulfilled, the writer drafts rows from the design's observable behaviors under a drafted header rather than leaving the section empty or retaining the verbatim header. One thing to consider tightening: the After header says the ticket 'has no acceptance criteria', which is slightly inaccurate since the ticket had one row that was moved; wording such as 'no file-checkable acceptance criteria remain after sorting' would be more precise without affecting the fact.

exit: 0
