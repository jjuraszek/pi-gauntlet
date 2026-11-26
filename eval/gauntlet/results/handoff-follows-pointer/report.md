# eval report: gauntlet (partial run: handoff-follows-pointer)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 11s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| handoff-follows-pointer | anthropic/claude-opus-5-5 | unchanged | 4318 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |
| handoff-follows-pointer | github-copilot/gpt-6.1-sol | unchanged | 4903 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |

## Feedback

- handoff-follows-pointer / anthropic/claude-opus-5-5: Both Before and After are the identical single token "PINE-GLASS-7Q3M", which contains no question or request for input or confirmation, so the 'question' fact holds in both and the wording change moved nothing on this case. Note that neither output shows any visible continuation of the approved run (no file read, no next step narrated), so this sample gives no evidence that the Change is delivered; to keep this fact while delivering the Change, keep the new sorting and ownership rules scoped so that an unmatched group is asked about only when it has a surviving acceptance row, and avoid any wording that could be read as requiring confirmation when local hand-off requirements are already complete.
- handoff-follows-pointer / github-copilot/gpt-6.1-sol: Before and After are the same single token, `PINE-GLASS-7Q3M`, and neither asks the person for input or confirmation, so the `question` fact holds in both and the wording change moved nothing on this case. Because the output is only that token, this case shows nothing about the row-sorting or ownership-question behaviour the Change describes. To keep the fact, keep the hand-off continuation free of confirmation prompts when the case states that all local hand-off requirements are complete, and limit the new ownership question to an unmatched group with a surviving acceptance row, as the Change already says.

exit: 0
