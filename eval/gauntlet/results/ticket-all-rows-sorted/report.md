# eval report: gauntlet (partial run: ticket-all-rows-sorted)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 7s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ticket-all-rows-sorted | anthropic/claude-opus-5-5 | improved | 5930 | drafted: fails -> holds (unplanned improvement); provenance: fails -> holds (unplanned improvement); moved: fails -> holds (unplanned improvement) |
| ticket-all-rows-sorted | github-copilot/gpt-6.1-sol | improved | 4463 | drafted: fails -> holds (unplanned improvement); provenance: fails -> holds (unplanned improvement); moved: fails -> holds (unplanned improvement) |

## Feedback

- ticket-all-rows-sorted / anthropic/claude-opus-5-5: After satisfies the fact: its Acceptance criteria section holds one unchecked, in-scope drafted row stating that the importer fails with a message naming the missing column, uses the 'Drafted from the design, ticket #58 has no acceptance criteria' header instead of a rows-verbatim header, and moves 'the operator runs the cutover' to Integration with a person-step marker and no ownership or cut question. Before fails because it kept the cutover row verbatim under a 'rows verbatim' header and explicitly held the diagnostic out of the section. The wording that moved the fact is the rule that when all ticket rows move to Integration, acceptance rows are drafted from the design without a question or stop; keep that sentence explicit. To hold steady, also keep the wording that the drafted row states the user-observable outcome (naming the missing required header/column) and that fixture proof belongs in Tests rather than the row. One small risk: After's row says 'missing column' while the design speaks of a required header; pinning the drafted row to the design's own noun (names the missing required header) would make the fact more robust across runs. Also note After says it stopped 'before the self-review, the critique pass', although the case states the self-review read is already in context; this does not affect the fact but the stop wording could be tightened to 'before the approval summary or any file or tracker write'.
- ticket-all-rows-sorted / github-copilot/gpt-6.1-sol: After moves the fact: the Acceptance criteria section now holds one unchecked in-scope row drafted from the design (the importer names the missing required header, with `id` as the example), the cutover row has left the section for Integration marked as a person step, and the verbatim-ticket-rows header is gone; Before instead kept the cutover row under a 'rows verbatim' header and drafted nothing. The wording that delivered this is the rule that when all ticket rows move to Integration, acceptance rows are drafted from the design without an ownership question or stop; keep that explicit. One thing to tighten: After's lead-in says 'ticket #58 has no acceptance criteria', which is inaccurate since the ticket had one row that moved to Integration; wording such as 'Drafted from the design; all ticket #58 rows moved to Integration' would keep the fact while stating provenance correctly, and the lead-in should stay clear of any phrasing that reads as a ticket-rows-verbatim header.

exit: 0
