# eval report: gauntlet (partial run: handoff-follows-pointer)

for: eaabe1071ee7efc5abe91e7a7d3fda55c6a29db6a501bec4cf2e2622ccdfac97

wall: 6s

## Change

An ordinary coding request does not enter the gauntlet, even with the entry instructions in context. Select ordinary-request-no-run to check the assistant's proposed actions before its first edit: no phase starts, no worktree is created and no step instructions are loaded. Both revisions require consent; no fact is expected to move. This tool-free sample checks the assistant's routing decision, not a live checkout. For handoff-follows-pointer, the completion reply supplies the next file. A read-only replay resumes with that tool result in history. Only the file provides the receipt; a narrated read cannot pass.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| handoff-follows-pointer | anthropic/claude-opus-5-5 | unchanged | 5486 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |
| handoff-follows-pointer | github-copilot/gpt-6.1-sol | unchanged | 2966 | question: holds -> holds (held); receipt: holds -> holds (intended but unchanged); command: holds -> holds (intended but unchanged) |

## Feedback

- handoff-follows-pointer / anthropic/claude-opus-5-5: Before and After are the identical single line `PINE-GLASS-7Q3M`, so nothing in the After wording moved the one fact under judgment: neither output asks the person for input or confirmation, and `question` holds in both. Each output consists only of that receipt-style token, with no question, menu or request to confirm, so the After wording continues the approved run without a prompt just as Before did. To keep it that way while still delivering the Change, keep the hand-off instruction phrased as a direct continuation (read the file named by the completion reply, then proceed) and avoid adding any wording that invites a consent check at this point, since consent was already given for the approved run.
- handoff-follows-pointer / github-copilot/gpt-6.1-sol: Both outputs are the identical single token "PINE-GLASS-7Q3M" with no question or request for confirmation, so the fact holds in Before and After alike; nothing in the After wording moved it. To keep this fact while delivering the Change, keep the hand-off continuation free of any prompt to the person: the reply should proceed directly from the tracker result (reading the file named by the completion reply) without asking for input or confirmation.

exit: 0
