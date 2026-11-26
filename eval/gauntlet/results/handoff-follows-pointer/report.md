# eval report: gauntlet (partial run: handoff-follows-pointer)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 6s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| handoff-follows-pointer | anthropic/claude-opus-5-5 | unchanged | 5920 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |
| handoff-follows-pointer | github-copilot/gpt-6.1-sol | unchanged | 6198 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |

## Feedback

- handoff-follows-pointer / anthropic/claude-opus-5-5: Before and After are the identical single line "PINE-GLASS-7Q3M", so neither asks the person for input or confirmation and the one fact under Facts holds on both sides; nothing in the After wording moved it. The entries in the Expected to move list are not facts for this case, and neither output contains any text that could show them: there is no ticket-row sorting, Integration carry, or ownership decision, only a bare token. To keep this fact while delivering the Change, keep the ownership question and no-member stop limited to groups with surviving acceptance rows, as the Change states, so a run whose hand-off requirements are already complete continues without a prompt. If this case is meant to show the new sorting behaviour, it needs an input that makes the skill produce the authored sections rather than a bare token.
- handoff-follows-pointer / github-copilot/gpt-6.1-sol: Before and After are the identical single token `PINE-GLASS-7Q3M`, so neither asks the person for input or confirmation and the fact holds in both; nothing in the After wording moved it. Note that this output shows none of the Change's behaviors either (no sorting of ticket rows, no Integration carry, no authored sections), so this case gives no evidence that the new wording delivers the Change. To keep the fact while delivering the Change, keep the grouped-row sorting and all-rows-moved-to-Integration paths phrased as unconditional actions with no ownership question, and limit the existing ownership question to groups with surviving acceptance rows, so a hand-off continuation like this one still proceeds without a prompt.

exit: 0
