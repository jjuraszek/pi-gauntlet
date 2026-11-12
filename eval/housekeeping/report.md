# eval report: housekeeping (partial run: pick-recorded-no-exec)

for: 4eb17cdb0146510585270518720619a722625aa3b0868472d3bd64b81a351a77

wall: 20s

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replays cover card checkpoints, not live selection or delivery. Keep every unanswered card box empty and mark the recommendation only with its label, so the PR card does not imply a recorded choice. For an overrides-sourced rule, cite both its file and `## housekeeping` in the card's explanation. After a successful pick write while another card is unanswered, acknowledge the class, pick and decisions path before the next card, and state that nothing has executed and the walk is still open.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pick-recorded-no-exec | anthropic/claude-opus-5-5 | improved | 11685 | recorded-pick: fails -> holds (intended change); next-card: holds -> holds (held); next-picks: holds -> holds (held); no-execution: fails -> holds (intended change); marker: holds -> holds (held) |
| pick-recorded-no-exec | github-copilot/gpt-6.1-sol | improved | 12628 | recorded-pick: fails -> holds (intended change); next-card: holds -> holds (held); next-picks: fails -> holds (unplanned improvement); no-execution: fails -> holds (intended change); marker: fails -> holds (unplanned improvement) |

## Feedback

- pick-recorded-no-exec / anthropic/claude-opus-5-5: After delivers both intended moves: the opening line names the class, the Fix pick and the full /tmp/housekeeping.fixture-pick/decisions.md path, and 'Nothing has run yet… The walk is still open' separates recording from execution, where Before only said 'Nothing has been edited yet' with no decisions path. Nothing that Before kept regressed: card 2 of 2 is shown once, with empty boxes for Fix, Ticket and Ignore in that order and a single [recommended] label. Two small tightenings would make the acknowledgement more robust: name the finding as well as the class ('code-unused: the unused import in src/widgets/render.ts') so a reader can tie it to card 1, and enumerate the no-execution claim explicitly ('no tracked edit, commit, push, PR, ticket or fix job has run') rather than relying on 'Nothing has run yet' plus only edit and PR as examples.
- pick-recorded-no-exec / github-copilot/gpt-6.1-sol: After delivers the Change: the lead-in records the pick and the decisions path in the supplied run folder, states nothing has executed and the walk is open, then shows only card 2 of 2 with Fix/Ticket/Ignore in order, empty boxes and a single label-only recommendation. Nothing regressed relative to Before (Before already failed recorded-pick and no-execution by omission, and failed next-picks by offering no recommendation at all). Two tightenings would make the held facts less dependent on reader inference: name the class in the acknowledgment ("Recorded Fix for card 1, code-unused (unused import in src/widgets/render.ts:2), in /tmp/.../decisions.md") rather than just "card 1", and spell out the no-execution claim as "no tracked edit, commit, push, PR, ticket or fix job has run" so the enumeration in the fact is matched literally instead of by the blanket "Nothing has executed".

exit: 0
