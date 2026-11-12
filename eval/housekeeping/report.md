# eval report: housekeeping (partial run: pr-card-no-ticket)

for: 2c53bcef704c1feaa9cba628146749f12bf450f7b15701fb4b9dd92edbfb2209

wall: 26s

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replays cover card checkpoints, not live selection or delivery. Keep every unanswered card box empty and mark the recommendation only with its label, so the PR card does not imply a recorded choice.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-card-no-ticket | anthropic/claude-opus-5-5 | unchanged | 13075 | two-picks: holds -> holds (held); same-pr-commit: holds -> holds (held); fix-available: holds -> holds (held); selected-only: holds -> holds (held); no-execution: holds -> holds (held); marker: holds -> holds (held) |
| pr-card-no-ticket | github-copilot/gpt-6.1-sol | improved | 19898 | two-picks: holds -> holds (held); same-pr-commit: fails -> holds (unplanned improvement); fix-available: holds -> holds (held); selected-only: holds -> holds (held); no-execution: holds -> holds (held); marker: fails -> holds (unplanned improvement) |

## Feedback

- pr-card-no-ticket / anthropic/claude-opus-5-5: No fact moved. After keeps exactly two numbered picks (Fix, Ignore) with no Ticket entry, puts the one-commit-to-the-existing-PR-branch promise directly in the Fix row, keeps both boxes empty with the recommendation carried only by the [recommended] label, lists only the two unused imports in the changed ranges of src/widgets/render.ts and src/widgets/format.ts, and stays an unanswered card with nothing claimed executed. The one thing After drops versus Before is the explicit verification statement (read-only check, no regression command attached, quoted lines verified, worktree clean and dry-run passed); none of the listed facts depend on it, but if you want the PR card to stay fully self-describing alongside the new directory-walk cards, consider keeping a short 'Verification' line under 'What happens if you accept' so the reader can see why Fix is offered without a regression command. Otherwise the After wording delivers the Change for the PR path without altering any fact.
- pr-card-no-ticket / github-copilot/gpt-6.1-sol: No fact that Before kept was lost in After; After actually gained same-pr-commit, because its Fix row now states explicitly 'Make one commit for this class and push it to the existing PR branch', whereas Before only said 'Delivery is commit-and-push' in the proposed-fix paragraph and the Fix row itself was just 'Remove both imports', so a careful reader could not tell whether that meant one commit on the existing PR branch or something else. Both outputs offer exactly Fix and Ignore with no Ticket (Before uses A)/B) letters rather than numbers, which is a minor wording risk against 'numbered'; After's 1./2. is safer). The one thing to watch in After is the header 'gauntlet: gate=housekeeping/card recommended=1': paired with the empty [ ] boxes it reads as a recommendation rather than a recorded pick, but it is the only place a reader might wonder whether a choice was logged; keeping the recommendation marker solely on the pick label ('Fix [recommended]') and omitting it from the gate line would remove that ambiguity while still delivering the Change's human-only, empty-box, label-only-recommendation card.

exit: 0
