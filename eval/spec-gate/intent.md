for: c3501464611d2876acdfaa860dc267ce20b9369fffd27532c5e9af3c2af284ec

## Change

Tie exactly one rendered recommendation to its first-line marker and trailing reason: tag one row among 1, 2, and 4 at the sentence end, use that same number in recommended=N and Recommended: N - reason, and leave row 3 and flag lines untagged. Keep the four fixed labels, per-engine flags and resolved allowance default.

Run only `recommended-row` against base `855e872a42f9cac7a795704f3e0b383b182950ab`. Extend its facts with recommendation consistency, retaining the four-row, flag, non-default allowance, briefing and drafted-row facts. Context-based selection, bundled-row selection and reply grammar remain outside this partial run. Preserve other sample results without claiming fresh coverage.

## Expected to move
- recommended-row/recommendation: fails -> holds - Tie the single tagged row to the first-line marker and the reason after the rows.
- recommended-row/rows: fails -> holds - Replace the six-choice template with four fixed labels.
- recommended-row/sentences: fails -> holds - Use one sentence per row without experimental or separate grant choices.
- recommended-row/flags: fails -> holds - Put only each engine's flags in separate bullets beneath it.
- recommended-row/defaults: fails -> holds - End flag explanations in their defaults, using the supplied allowance of 7.
- full-council/f4: fails -> holds - Render four one-sentence menu rows with the fixed engine, council, and draft labels.
