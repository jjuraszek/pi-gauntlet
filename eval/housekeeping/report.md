# eval report: housekeeping (partial run: spec-card-named-keep)

for: c0178fd15dcd179d1673149c6ae71c8125ca05d61ae43ea52a5d9401ad3faed7

wall: 19s

## Change

Separate specs from content checks and skip plan folders. Offer fully superseded specs in one Delete-or-Keep card in every run, with no Ticket choice or hotfix eligibility test. Recommend Keep when a tracked file outside the spec and plan dirs names a spec, otherwise Delete. State the deletion and the run's delivery, disclose outside readers and retain the text in git history. Keep ordinary directory and PR cards unchanged. Selected replays cover card checkpoints, not live selection, banner searches or deletion.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| spec-card-named-keep | anthropic/claude-opus-5-5 | improved | 6318 | two-picks: fails -> holds (unplanned improvement); named-reader: fails -> holds (unplanned improvement); delete-delivery: fails -> holds (unplanned improvement); superseded-reason: holds -> holds (held); history: fails -> holds (unplanned improvement); no-execution: holds -> holds (held); marker: holds -> holds (held) |
| spec-card-named-keep | github-copilot/gpt-6.1-sol | improved | 8967 | two-picks: fails -> holds (unplanned improvement); named-reader: fails -> holds (unplanned improvement); delete-delivery: fails -> holds (unplanned improvement); superseded-reason: holds -> holds (held); history: fails -> holds (unplanned improvement); no-execution: holds -> holds (held); marker: holds -> holds (held) |

## Feedback

- spec-card-named-keep / anthropic/claude-opus-5-5: After satisfies every fact, and no fact that Before held was lost. The moves all come from the new card shape: replacing Fix/Ticket/Ignore with exactly Delete then Keep (empty boxes, Keep alone marked recommended) moved two-picks; the sentences stating that README.md sits outside the spec and plan folders, mentions the spec, and is the reason to keep it moved named-reader (Before named README.md but used it to recommend Ticket, not Keep); the Delete row's wording about removing the listed specs in its own worktree with a pushed PR and unchanged primary tracked files moved delete-delivery (Before had only a Fix row with no Delete choice); and 'Git history keeps the deleted text' moved history. Note the author listed nothing as expected to move, yet four facts flipped from fails to holds, so the expectation list looks out of date rather than the wording being wrong. To keep this stable, retain the explicit banner explanation plus the `reference/base-rules.md` citation, keep the card phrased as future/conditional ('is deleted ... if you accept') so it never reads as executed, and consider restoring Before's mention that the successor spec inside doc/specs also names the file, which After dropped without affecting any listed fact.
- spec-card-named-keep / github-copilot/gpt-6.1-sol: After keeps both facts Before held (superseded-reason and no-execution) and moves four from fails to holds, although the Expected to move list names none. Before showed the generic Fix/Ticket/Ignore card with Ticket recommended, so it failed two-picks, named-reader and delete-delivery, and it never mentioned git history. After's Delete-then-Keep card moves two-picks, and its sentence that README.md sits outside the spec and plan dirs and is the reason to recommend Keep moves named-reader. Its Delete row, which removes the listed spec in its own worktree with its own pushed PR and leaves the primary's tracked files unchanged, moves delete-delivery, and "Git history keeps the deleted text" moves history. No wording change is needed to preserve what Before kept. To hold these gains, keep the explicit banner sentence with the base-rules Specs citation, the README-to-Keep link, the full delivery wording in the Delete row, and the git history sentence. If no movement was truly expected, the Expected to move list should be updated to name these four facts, since all four moves follow directly from the Change.

exit: 0
