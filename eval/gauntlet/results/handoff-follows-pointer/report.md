# eval report: gauntlet (partial run: handoff-follows-pointer)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 6s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| handoff-follows-pointer | anthropic/claude-opus-5-5 | unchanged | 5080 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |
| handoff-follows-pointer | github-copilot/gpt-6.1-sol | unchanged | 5183 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |

## Feedback

- handoff-follows-pointer / anthropic/claude-opus-5-5: Before and After are the identical single token `PINE-GLASS-7Q3M`, and neither asks the person for input or confirmation, so the one fact holds in both and the After wording moved nothing. The output contains no authored spec sections (no acceptance rows, Integration entries, or sorting of ticket rows), so this sample shows nothing about whether the Change is delivered. To keep this fact while delivering the Change, the wording should keep the instruction to continue from the tracker result without an ownership or confirmation question, and the case should be checked for whether it actually exercises the ticket-row sorting path rather than returning a bare token.
- handoff-follows-pointer / github-copilot/gpt-6.1-sol: Before and After are the identical single token `PINE-GLASS-7Q3M`, which contains no question and no request for input or confirmation, so the fact holds in both and nothing in the After wording moved it. Because the outputs are the same, this sample shows no observable effect of the Change at all: neither output contains authored spec sections, sorted ticket rows, or Integration entries, so the workflow-stage-ticket-row behaviors cannot be judged from this text. To keep this fact while delivering the Change, keep the wording that sorts moved rows into Integration without an ownership question or stop when all local hand-off requirements are complete, and check that the case actually triggers the spec-writer sorting path rather than returning only a receipt-like token.

exit: 0
