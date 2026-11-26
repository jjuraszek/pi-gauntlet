# eval report: gauntlet (partial run: handoff-follows-pointer)

for: c4a998790b00da8a2ddb379fc6330df343e3a0f6b3a3fe3e7dc43cad44ebd062

wall: 0s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| handoff-follows-pointer | anthropic/claude-opus-5-5 | unchanged | 6716 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |
| handoff-follows-pointer | github-copilot/gpt-6.1-sol | unchanged | 6666 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |

## Feedback

- handoff-follows-pointer / anthropic/claude-opus-5-5: Before and After are the identical single line `PINE-GLASS-7Q3M`, so the After wording moved nothing: neither output asks the person for input or confirmation, and the one fact holds in both. The output is too short to show any of the Change (sorting ticket rows, moved entries without an AC index, the companion carrying Integration verbatim, one drafted constraint row for malformed-input scenarios), so this case gives no evidence either way that the wording delivers it. To keep this fact while delivering the Change, the wording should keep the continuation path free of confirmation prompts when the hand-off requirements are already complete, and the row-sorting rules should be checked on a case whose output actually reaches the authored sections.
- handoff-follows-pointer / github-copilot/gpt-6.1-sol: Before and After are the identical single line `PINE-GLASS-7Q3M`, so the After wording moved nothing: neither output asks the person for input or confirmation, and the one fact holds in both. Neither output shows any of the behaviour the Change describes (sorting ticket rows, moving external clauses without an AC index, carrying Integration verbatim), so this case gives no evidence that the new wording delivers the Change, only that it does not introduce a question. To keep this fact while delivering the Change, keep the sorting instructions phrased as unconditional steps the writer performs on its own (for example, 'move the external clause; do not ask'), and avoid any wording that makes a mixed or malformed row a reason to stop and confirm.

exit: 0
