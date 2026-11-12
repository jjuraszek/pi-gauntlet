for: 80b3101046bddff77d082c019042255e72cc23dee994127dc7e3d447f60ed4fd

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replays cover card checkpoints, not live selection or delivery. Keep every unanswered card box empty and mark the recommendation only with its label, so the PR card does not imply a recorded choice. For an overrides-sourced rule, cite both its file and `## housekeeping` in the card's explanation. After a successful pick write while another card is unanswered, acknowledge the class, pick and decisions path before the next card, and state that nothing has executed and the walk is still open.

## Expected to move
- pick-recorded-no-exec/recorded-pick: fails -> holds - Acknowledge the saved pick and its outside-repo decisions path before the next card.
- pick-recorded-no-exec/no-execution: fails -> holds - Distinguish recording a pick from executing it while the walk remains open.
