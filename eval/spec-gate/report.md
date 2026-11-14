# eval report: spec-gate (partial run: recommended-row)

for: 26a6a901fc85d52d5543625e7d468b8a5fc1b0a92fb39f1500d00bf572dc599e

wall: 26s

## Change

Render engine flags as Markdown bullets beneath their row, with blank lines between row groups and one sentence per flag ending in its default. Plan lists --amends-stop and --fund-rounds=N; loop lists --amends-stop and --allowance=N. Use the resolved loopEngine.maxIterationsPerRow for the allowance default. Keep council and draft PR free of flags.

Run only `recommended-row` against base `855e872a42f9cac7a795704f3e0b383b182950ab`. Extend that fixture with a non-default allowance of 7 to catch a hardcoded 4, retaining its four-row, sentence, briefing, and drafted-row facts. Recommendation selection and reply grammar remain outside this partial run. Preserve other sample results without claiming fresh coverage.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| recommended-row | anthropic/claude-opus-5-5 | improved | 11854 | rows: fails -> holds (intended change); sentences: fails -> holds (intended change); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: fails -> holds (intended change); defaults: fails -> holds (intended change) |
| recommended-row | github-copilot/gpt-6.1-sol | improved | 13515 | rows: fails -> holds (intended change); sentences: fails -> holds (intended change); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: fails -> holds (intended change); defaults: fails -> holds (intended change) |

## Feedback

- recommended-row / anthropic/claude-opus-5-5: The After wording moved all four expected facts and kept the two Before already held. It replaces the six-choice menu with four fixed-label rows (plan engine, loop engine, council explanation, draft PR), each one sentence with no experimental label or separate auto-apply choice. Flags sit as separate Markdown bullets under rows 1 and 2 only, with blank lines between row groups, and each bullet is one sentence ending in its default, including the supplied allowance of 7 rather than the shared 4. The briefing and the drafted acceptance row with its in-scope disposition are still reproduced verbatim before the menu. One leftover remains: the trailing line 'Add "; fund N fix rounds" ... to 1 or 2 ... Add "; allowance N" to 4 or 5' is carried over from the old template. It points at rows 4 and 5 (row 5 no longer exists and row 4 is now the draft PR) and offers fix rounds on the loop row, which contradicts the new flag bullets. It fails no listed fact because it sits outside the numbered rows, but it should be deleted or rewritten to point at the --fund-rounds=N and --allowance=N flags. To keep the defaults fact robust, keep each default as the closing parenthetical of a single-sentence bullet, as now, and keep the allowance sourced from the resolved loopEngine.maxIterationsPerRow.
- recommended-row / github-copilot/gpt-6.1-sol: The After wording moved rows, sentences, flags and defaults from fails to holds: it replaces the six-choice template with four fixed labels (plan engine, loop engine, council explanation, draft PR), gives each row one sentence, puts each engine's flags in separate bullets with blank lines between row groups, and ends each bullet in its default, including the resolved allowance of 7 rather than the shared 4. Briefing and drafted held in Before and still hold, so nothing regressed. Three leftovers could put these facts at risk on other runs. First, the footer "Add '; fund N fix rounds' ... to 1 or 2 ... '; allowance N' to 4 or 5" survives from the old template; it names rows 4 and 5 that no longer exist and duplicates the flag bullets in a different grammar, so remove it or rewrite it to point at `--fund-rounds=N` and `--allowance=N` on rows 1 and 2. Second, the reply handling still persists `**Amend-grant:** none` for a bare `1`, while the `--amends-stop` bullet says the default is to apply amendments and list them at the finish gate; make the two agree. Third, the fund-rounds default reads "stop and ask there"; writing "stop and ask after the escalated round" would make it robust without relying on the antecedent. The new "Unresolved rollout confirmation" line and "Pick one:" sit between the council line and the menu without breaking any fact, but state explicitly whether they are wanted so the menu stays fixed at four rows.

exit: 0
