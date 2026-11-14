for: 26a6a901fc85d52d5543625e7d468b8a5fc1b0a92fb39f1500d00bf572dc599e

## Change

Render engine flags as Markdown bullets beneath their row, with blank lines between row groups and one sentence per flag ending in its default. Plan lists --amends-stop and --fund-rounds=N; loop lists --amends-stop and --allowance=N. Use the resolved loopEngine.maxIterationsPerRow for the allowance default. Keep council and draft PR free of flags.

Run only `recommended-row` against base `855e872a42f9cac7a795704f3e0b383b182950ab`. Extend that fixture with a non-default allowance of 7 to catch a hardcoded 4, retaining its four-row, sentence, briefing, and drafted-row facts. Recommendation selection and reply grammar remain outside this partial run. Preserve other sample results without claiming fresh coverage.

## Expected to move
- recommended-row/rows: fails -> holds - Replace the six-choice template with four fixed labels.
- recommended-row/sentences: fails -> holds - Use one sentence per row without experimental or separate grant choices.
- recommended-row/flags: fails -> holds - Put only each engine's flags in separate bullets beneath it.
- recommended-row/defaults: fails -> holds - End flag explanations in their defaults, using the supplied allowance of 7.
- full-council/f4: fails -> holds - Render four one-sentence menu rows with the fixed engine, council, and draft labels.
