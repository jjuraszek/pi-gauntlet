for: 5a983260e5121c799f7db9f5629a6b3f8580b6367da11adcb23f196e0a2d5c90

## Change

Render the ordinary spec-approval menu as four fixed, one-sentence rows: plan engine, loop engine, council explanation, and draft PR. Keep the briefing, audit counts, scope cuts, and drafted acceptance rows unchanged. Store the granting sentence outside the menu so removing the separate grant choice does not erase it.

Run only `recommended-row` for this menu-shape change against base `855e872a42f9cac7a795704f3e0b383b182950ab`. Its supplied context and engine observations form the fixture for recommendation coverage; the current assertions cover row shape and briefing preservation, not recommendation selection or reply routing. Update `full-council/f4` to the four-row shape without claiming a fresh run of that sample. Preserve other sample results as partial, stale coverage until their selected reruns.

## Expected to move
- recommended-row/rows: fails -> holds - Replace the six-choice template with four fixed labels.
- recommended-row/sentences: fails -> holds - Use one sentence per row without experimental or separate grant choices.
- full-council/f4: fails -> holds - Render four one-sentence menu rows with the fixed engine, council, and draft labels.
