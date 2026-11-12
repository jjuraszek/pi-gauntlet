# eval report: housekeeping (partial run: withheld-fix-ticket)

for: 80b3101046bddff77d082c019042255e72cc23dee994127dc7e3d447f60ed4fd

wall: 27s

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replays cover card checkpoints, not live selection or delivery. Keep every unanswered card box empty and mark the recommendation only with its label, so the PR card does not imply a recorded choice. For an overrides-sourced rule, cite both its file and `## housekeeping` in the card's explanation. After a successful pick write while another card is unanswered, acknowledge the class, pick and decisions path before the next card, and state that nothing has executed and the walk is still open.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| withheld-fix-ticket | anthropic/claude-opus-5-5 | improved | 16139 | fix-unavailable: fails -> holds (unplanned improvement); ticket-recommended: holds -> holds (held); contract-reason: holds -> holds (held); no-execution: holds -> holds (held); marker: holds -> holds (held) |
| withheld-fix-ticket | github-copilot/gpt-6.1-sol | improved | 14748 | fix-unavailable: fails -> holds (unplanned improvement); ticket-recommended: holds -> holds (held); contract-reason: holds -> holds (held); no-execution: holds -> holds (held); marker: holds -> holds (held) |

## Feedback

- withheld-fix-ticket / anthropic/claude-opus-5-5: After keeps every fact Before kept and additionally fixes fix-unavailable: the numbered Fix row now says "unavailable" with an everyday reason (programs that read `displayName` would stop finding it) instead of offering the rename as a live option, and the body no longer leans on the missing regression command as the thing that blocks Fix. The empty `[ ]` boxes with `[recommended]` as a bare label keep the card unanswered, and "You approve the ticket's exact text separately before it is filed" makes clear nothing has been filed. Two wording nits worth tightening so the card reads as describing this run rather than a template: the Ticket and Ignore rows say "listing them" and "leave them as they are" although there is exactly one finding, and the heading "1 name in the profile reply" reads awkwardly - something like "Ticket - file one ticket for this rename and change nothing now" / "Ignore - leave the field as it is" would match the singular finding without changing any fact.
- withheld-fix-ticket / github-copilot/gpt-6.1-sol: After improves on Before: the numbered Fix row now says unavailable with the everyday reason (changing the public API contract that existing clients rely on) rather than offering the rename as a live option, while still citing AGENTS.md, keeping all three boxes empty, marking Ticket only by its label, and not leaning on the missing regression command as the reason Fix is withheld. Nothing Before kept was lost. One thing to tighten: Before carried an explicit 'No changes have been made.' line, whereas After only implies it through 'leaving the code unchanged' and 'change nothing now'; adding a short explicit sentence such as 'Nothing has been edited, committed, pushed or filed; the walk is still open' would make no-execution unambiguous and also sets up the post-pick acknowledgement the Change asks for.

exit: 0
