# eval report: housekeeping (partial run: withheld-fix-ticket)

for: 4eb17cdb0146510585270518720619a722625aa3b0868472d3bd64b81a351a77

wall: 30s

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replays cover card checkpoints, not live selection or delivery. Keep every unanswered card box empty and mark the recommendation only with its label, so the PR card does not imply a recorded choice. For an overrides-sourced rule, cite both its file and `## housekeeping` in the card's explanation. After a successful pick write while another card is unanswered, acknowledge the class, pick and decisions path before the next card, and state that nothing has executed and the walk is still open.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| withheld-fix-ticket | anthropic/claude-opus-5-5 | improved | 14303 | fix-unavailable: fails -> holds (unplanned improvement); ticket-recommended: holds -> holds (held); contract-reason: holds -> holds (held); no-execution: holds -> holds (held); marker: holds -> holds (held) |
| withheld-fix-ticket | github-copilot/gpt-6.1-sol | improved | 13575 | fix-unavailable: fails -> holds (unplanned improvement); ticket-recommended: holds -> holds (held); contract-reason: holds -> holds (held); no-execution: holds -> holds (held); marker: holds -> holds (held) |

## Feedback

- withheld-fix-ticket / anthropic/claude-opus-5-5: After improves on Before: the Fix row now explicitly says unavailable with an everyday reason (apps reading displayName would stop finding it), the three numbered choices keep empty boxes with Ticket marked only by its [recommended] label, the contract reason cites AGENTS.md without leaning on the missing regression command, and the Ticket text states that picking it changes nothing now and the wording is approved before filing. Nothing regressed. Two small wording nits worth tidying: the Ticket and Ignore rows say 'them' although there is a single field, so use 'file one ticket for this rename' and 'leave the field as it is'; and the 'What happens if you accept' heading reads oddly when the first sentence immediately says the fix cannot be made, so a heading like 'What each pick does' would match the body better while keeping every fact intact.
- withheld-fix-ticket / github-copilot/gpt-6.1-sol: After improves on Before by marking Fix unavailable with an everyday reason tied to the public contract, keeping all three boxes empty with Ticket flagged only by its label, and citing AGENTS.md without leaning on the missing regression command. The one thing After weakened is the explicit no-execution statement: Before had a plain 'No changes have been made.' line, whereas After only implies it through 'leave the code unchanged' and 'filing still requires separate exact-text approval'. To keep no-execution unambiguous while delivering the Change, restore a single explicit sentence near the top or bottom of the card such as 'Nothing has been edited, committed, pushed, filed or opened; picks are recorded and executed only after the walk finishes', and keep the rest of After's wording as is.

exit: 0
