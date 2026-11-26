# eval report: gauntlet (partial run: ticket-all-rows-sorted)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 15s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ticket-all-rows-sorted | anthropic/claude-opus-5-5 | improved | 5116 | drafted: fails -> holds (unplanned improvement); provenance: fails -> holds (unplanned improvement); moved: fails -> holds (unplanned improvement) |
| ticket-all-rows-sorted | github-copilot/gpt-6.1-sol | improved | 4197 | drafted: fails -> holds (unplanned improvement); provenance: fails -> holds (unplanned improvement); moved: fails -> holds (unplanned improvement) |

## Feedback

- ticket-all-rows-sorted / anthropic/claude-opus-5-5: The After wording moved `drafted` from fails to holds: once the ticket's only row ("the operator runs the cutover") was sorted to Integration as a person step, the output drafted an unchecked in-scope row from the design ("Importing a file that lacks a required header fails with a message naming the missing column"), used the "ticket #58 has no acceptance criteria" header instead of a rows-verbatim header, and kept the cutover row out of Acceptance criteria. Before failed all three parts: it kept the cutover row verbatim as the only criterion under a "rows verbatim" header and explicitly pushed the importer diagnostic into Design and Tests. Before held nothing here that After lost, so no wording needs restoring. To keep this result stable, keep the instruction that when every ticket row moves to Integration the acceptance rows are drafted from the design without an ownership question or stop, and keep it explicit that the moved row gets no AC index and no disposition, as After showed. One small point to watch: After's closing says it stopped "before the self-review, the critique pass and the approval summary" while the case states the self-review read is already in context; that does not affect this fact, but the wording could say the stop is before the approval summary and any write so the narration matches the requested continuation.
- ticket-all-rows-sorted / github-copilot/gpt-6.1-sol: After moved the fact by sorting the ticket's only row (the operator cutover, a person step) into Integration and then drafting the acceptance row from the design: an unchecked in-scope row stating the importer names the missing required header, with no cutover row and no ticket-rows-verbatim header in the Acceptance criteria section. Before kept the cutover row under a 'rows verbatim' header and drafted nothing, so it failed. Before held nothing here that After lost, so there is nothing to restore. One point to watch: the After header says 'ticket #58 has no acceptance criteria', which is not literally true of the ticket (it had one row, which moved); wording such as 'Drafted from the design; ticket #58's only row moved to Integration' would deliver the same Change without misstating the ticket, and keeping the row to a single observable (the missing column is named) rather than adding the `id` fixture detail would keep it tighter to the design's diagnostic.

exit: 0
