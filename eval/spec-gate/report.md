# eval report: spec-gate (partial run: recommended-row)

for: 5a983260e5121c799f7db9f5629a6b3f8580b6367da11adcb23f196e0a2d5c90

wall: 23s

## Change

Render the ordinary spec-approval menu as four fixed, one-sentence rows: plan engine, loop engine, council explanation, and draft PR. Keep the briefing, audit counts, scope cuts, and drafted acceptance rows unchanged. Store the granting sentence outside the menu so removing the separate grant choice does not erase it.

Run only `recommended-row` for this menu-shape change against base `855e872a42f9cac7a795704f3e0b383b182950ab`. Its supplied context and engine observations form the fixture for recommendation coverage; the current assertions cover row shape and briefing preservation, not recommendation selection or reply routing. Update `full-council/f4` to the four-row shape without claiming a fresh run of that sample. Preserve other sample results as partial, stale coverage until their selected reruns.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| recommended-row | anthropic/claude-opus-5-5 | improved | 5718 | rows: fails -> holds (intended change); sentences: fails -> holds (intended change); briefing: holds -> holds (held); drafted: holds -> holds (held) |
| recommended-row | github-copilot/gpt-6.1-sol | improved | 5513 | rows: fails -> holds (intended change); sentences: fails -> holds (intended change); briefing: holds -> holds (held); drafted: holds -> holds (held) |

## Feedback

- recommended-row / anthropic/claude-opus-5-5: The After wording replaced the six-choice menu with exactly four numbered rows labelled plan engine, loop engine, council explanation, and draft PR, each a single sentence with no experimental tag and no separate auto-apply-amends choice, which moves rows and sentences from fails to holds as intended. The briefing is still reproduced verbatim ahead of the commit line and menu, and the drafted acceptance row with its in-scope disposition still sits under the 'Drafted acceptance criteria (approval ratifies):' heading before the menu, so nothing Before kept was lost. Two leftovers are worth tidying to keep the four-row shape coherent: the trailing modifier line still says 'Add "; allowance N" to 4 or 5', which refers to a row 5 that no longer exists and to row 4, which is now the draft PR rather than a loop-engine row (the allowance modifier should point at row 2, and the fix-rounds modifier at row 1 only if it does not apply to the loop engine); and the added 'Pick one:' lead-in and backticks around the spec path are harmless but are deviations from the Before template that you should keep only if intended. Keep the briefing, scope cuts, council counts and drafted block byte-for-byte as they are now.
- recommended-row / github-copilot/gpt-6.1-sol: The After wording moved both targeted facts: replacing the six-choice template with four rows labelled plan engine, loop engine, council explanation, and draft PR (in that order, numbered 1-4) satisfies `rows`, and each row is now a single sentence with no '(experimental)' tag and no separate auto-apply-amends choice, satisfying `sentences`. The briefing is still reproduced verbatim ahead of the commit line and menu, and the drafted acceptance row with its `in-scope` disposition still sits under 'Drafted acceptance criteria (approval ratifies):' before the menu, so nothing Before kept was lost. One leftover to fix, though it does not flip any fact here: the trailing modifier line still says 'Add "; allowance N" to 4 or 5' and '"; fund N fix rounds" to 1 or 2', which are stale references to the old six-row numbering (there is no row 5, row 4 is now the draft PR, and row 2 is now the loop engine rather than a waves grant). Reword that line to point at the new rows (fix rounds on 1, allowance on 2) so the menu is self-consistent, and keep the modifiers and the 'Configured per-row allowance' line outside the numbered rows as you have done so each row stays one sentence.

exit: 0
