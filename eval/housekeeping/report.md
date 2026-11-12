# eval report: housekeeping (partial run: pr-card-no-ticket)

for: 6b0dd2600ab5f0adf5c13bede90d78051579d935fc9eb3bcf9abd3095516a068

wall: 57s

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replay covers the directory card checkpoint, not live selection or delivery.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-card-no-ticket | anthropic/claude-opus-5-5 | regressed | 19145 | two-picks: holds -> holds (held); same-pr-commit: holds -> holds (held); fix-available: holds -> holds (held); selected-only: holds -> holds (held); no-execution: holds -> fails (regression); marker: holds -> holds (held) |
| pr-card-no-ticket | github-copilot/gpt-6.1-sol | improved | 17153 | two-picks: holds -> holds (held); same-pr-commit: fails -> holds (unplanned improvement); fix-available: holds -> holds (held); selected-only: holds -> holds (held); no-execution: holds -> holds (held); marker: fails -> holds (unplanned improvement) |

## Feedback

- pr-card-no-ticket / anthropic/claude-opus-5-5: After keeps the two-choice list, the one-commit-to-the-existing-PR-branch promise, the recommended Fix without a regression command, and findings limited to the two selected imports, but it pre-checks the Fix option (`1. [x] Fix`) while the run state says no pick has been recorded; a careful reader sees a checkbox list with one box ticked and concludes the card has already been answered, which breaks the 'unanswered card' requirement even though no execution is claimed. Use plain numbered rows with the `[recommended]` tag only (as Before did), or use empty boxes for both options, so the recommendation is a label rather than a recorded answer. Two smaller drifts worth tightening: 'This pull request adds 2 imports' overstates the run state (the lines are in changed ranges, not necessarily added by the PR), so say 'two imports in lines this pull request changed'; and 'Those two import lines are deleted' under 'What happens if you accept' is fine as a conditional but reads safer as 'would be deleted' to keep the card clearly pre-execution.
- pr-card-no-ticket / github-copilot/gpt-6.1-sol: After keeps every fact Before kept and additionally repairs same-pr-commit: Before's Fix row only said "Remove both imports" with a detached "Delivery is commit-and-push" note that never named the target branch or promised a single commit, whereas After's Fix row states "Make one commit for this class and push it to the existing PR branch" and the acceptance section repeats it. Two cautions in After: the pre-ticked "[x] Fix" marker could be read by some readers as a recorded pick, so a plain "(recommended)" tag without a checked box would make the unanswered state unambiguous; and Before's lettered A)/B) options only loosely satisfy "numbered", so After's switch to 1./2. is a genuine improvement worth keeping. Also consider restating "Nothing has been changed yet" explicitly, as Before did, to lock in no-execution.

exit: 1
