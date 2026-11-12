# eval report: housekeeping (partial run: pr-card-no-ticket)

for: 0ad959b6322f51ecf51c67c55ca310846cb00ced5efd954b867cb7a92bddfe27

wall: 29s

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replays cover card checkpoints, not live selection or delivery. Keep every unanswered card box empty and mark the recommendation only with its label, so the PR card does not imply a recorded choice. For an overrides-sourced rule, cite both its file and `## housekeeping` in the card's explanation.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-card-no-ticket | anthropic/claude-opus-5-5 | improved | 16035 | two-picks: holds -> holds (held); same-pr-commit: holds -> holds (held); fix-available: holds -> holds (held); selected-only: holds -> holds (held); no-execution: holds -> holds (held); card-prose: fails -> holds (unplanned improvement); marker: holds -> holds (held) |
| pr-card-no-ticket | github-copilot/gpt-6.1-sol | improved | 22046 | two-picks: holds -> holds (held); same-pr-commit: fails -> holds (unplanned improvement); fix-available: holds -> holds (held); selected-only: holds -> holds (held); no-execution: holds -> holds (held); card-prose: fails -> holds (unplanned improvement); marker: fails -> holds (unplanned improvement) |

## Feedback

- pr-card-no-ticket / anthropic/claude-opus-5-5: Nothing regressed: After keeps every fact Before kept, and it additionally satisfies card-prose, which Before failed because its title was the bare check id ("Card 1 of 1: code-unused") and it used labeled fields (Rule, Findings, Verification, Delivery) instead of the three plain-prose sections. After's title carries count, noun, place and predicate, the Fix row now states the one-commit-to-existing-PR-branch promise directly rather than leaving it to a separate Delivery line, the checkboxes are empty with the recommendation carried only by the [recommended] label, and no Ticket pick appears on this PR card. One small tightening to consider: the Fix row and Ignore row use different capitalization styles ("Make one commit..." vs "leave them as they are"); align them, and keep the explicit branch name in the "What happens if you accept" section as you have, since that is what anchors same-pr-commit when the delivery is commit-push rather than a per-class PR.
- pr-card-no-ticket / github-copilot/gpt-6.1-sol: Nothing moved from holds to fails; After keeps every fact Before kept and additionally satisfies same-pr-commit and card-prose, which Before failed because its Fix row only said "Remove both imports" with delivery buried in a separate line that never named the existing PR branch or a single commit, and its title ("Card 1 — Unused imports") lacked a count/place/predicate and the three prose sections. After's Fix row ("Make one commit for this class and push it to the existing PR branch"), the empty `[ ]` boxes with a `[recommended]` label on exactly one pick, and the titled sections deliver the Change cleanly. One wording nit that does not move a fact: "no command that repeats a failing action is attached" is an awkward gloss on "regression command"; plainer would be "this is a read-only check, so no test command is run afterward" — that keeps the everyday-prose requirement without inventing a definition the reader has to decode.

exit: 0
