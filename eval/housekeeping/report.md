# eval report: housekeeping (partial run: directory-three-picks)

for: 6b0dd2600ab5f0adf5c13bede90d78051579d935fc9eb3bcf9abd3095516a068

wall: 27s

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replay covers the directory card checkpoint, not live selection or delivery.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| directory-three-picks | anthropic/claude-opus-5-5 | improved | 14266 | three-picks: holds -> holds (held); own-pr: fails -> holds (unplanned improvement); no-execution: holds -> holds (held); selected-only: holds -> holds (held); marker: holds -> holds (held) |
| directory-three-picks | github-copilot/gpt-6.1-sol | improved | 14872 | three-picks: holds -> holds (held); own-pr: holds -> holds (held); no-execution: holds -> holds (held); selected-only: holds -> holds (held); marker: fails -> holds (unplanned improvement) |

## Feedback

- directory-three-picks / anthropic/claude-opus-5-5: After keeps every fact Before kept and actually improves own-pr: Before only states the per-class pull request in the prose above the choices ("Fixing opens one pull request for this issue type") while its Fix row reads just "remove both imports", whereas After puts "open its own pushed PR against the default branch" directly in the Fix row. The one wording risk in After is the pre-ticked "1. [x] Fix" checkbox: the run state says no pick has been recorded, and a reader could take a checked box as a selection already made or as the walk having advanced, which brushes against no-execution even though the "What happens if you accept" framing and the "Pick one:" prompt keep it an unanswered card. Use plain numbered rows (or "[ ]" on all three) with "[recommended]" as the only marker, keep the explicit own-PR / own-worktree language in the Fix row, and retain the two-finding list with file and line so selected-only stays unambiguous.
- directory-three-picks / github-copilot/gpt-6.1-sol: After keeps all four facts: the three numbered picks appear in order, the Fix row promises its own worktree and its own pushed PR, the findings name only render.ts:2 and format.ts:3, and nothing claims an edit, commit, PR or ticket was made. Two wording risks are worth closing. First, After pre-marks option 1 as `[x]` and adds `recommended=1` and `[recommended]` even though the run state records no pick and no recommendation; a reader could take the checked box as a recorded answer, which would break no-execution on a stricter reading. Leave every box as `[ ]` (or drop the checkboxes and keep plain numbers as Before does) and, if a recommendation is wanted, state it in a sentence rather than a checked control. Second, After dropped Before's explicit line that the expected-state comparison passed and that no source file, index entry or HEAD changed and nothing has been executed; restoring one sentence to that effect under 'What happens if you accept' keeps the walk-before-execution promise visible while retaining the new found/matters/accept structure.

exit: 0
