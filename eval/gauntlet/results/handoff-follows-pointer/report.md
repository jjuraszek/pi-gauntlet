# eval report: gauntlet (partial run: handoff-follows-pointer)

for: 3191f38ab378b94b1d2b9a3ae80c903ca709ebdda14ab2e3f63e6706a8d8f696

wall: 5s

refresh: complete; sample: handoff-follows-pointer; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](candidate.json)

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| handoff-follows-pointer | anthropic/claude-opus-5-5 | unchanged | 3570 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |
| handoff-follows-pointer | github-copilot/gpt-6.1-sol | unchanged | 4275 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |

## Feedback

- handoff-follows-pointer / anthropic/claude-opus-5-5: Before and After are the identical single token `PINE-GLASS-7Q3M`, and neither asks the person for input or confirmation, so the fact holds in both and the After wording moved nothing in this case. No wording change is needed to keep this fact: as long as the continuation from the tracker result still proceeds without an ownership or confirmation question when all local hand-off requirements are complete, it will keep holding. Note that this sample shows only the receipt token, so it gives no evidence either way about the Integration-sorting or ownership-question behaviour the Change targets.
- handoff-follows-pointer / github-copilot/gpt-6.1-sol: Before and After are the same single token, `PINE-GLASS-7Q3M`, and neither asks the person for input or confirmation, so the `question` fact holds in both and the wording change moved nothing on this case. Neither output shows any continuation work either (no pointer read, no next step narrated), so this sample cannot show whether the Change's sorting and ownership-question rules are delivered. To keep this fact while delivering the Change, keep the hand-off continuation free of confirmation prompts and limit the new ownership question to an unmatched group with a surviving acceptance row, as the Change already states.

exit: 0
