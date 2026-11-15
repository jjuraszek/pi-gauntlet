# eval report: spec-gate (partial run: recommended-row)

for: 958814567d03516a4f7f622e366e95465fbad02d1857943813f6ae0055edefae

wall: 20s

## Change

Refresh only spec-gate/recommended-row for Design 7: align the single-outcome reading to 12.0 and the PR-subject reading to 31.0, add independent 26.0 and 31.0 draft-PR recommendations, and render the full zero-row council gate at 12.0 with rows 1, 3, 4 and no allowance bullet. Preserve all twelve existing fact IDs, the 25.0/25.1 boundary, zero-row context precedence, first bundled qualifying row, and observation-facet checks. Seed this changed case's baseline first, then compare this sample only against the unchanged candidate skill text. This tool-free replay measures rendered text, not live persistence; retain prior partial-report evidence without rerunning other samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| recommended-row | anthropic/claude-opus-5-5 | improved | 17478 | unbundled: fails -> holds (intended change); bundled: fails -> holds (intended change); recommendation: fails -> holds (intended change); zero-rows: fails -> holds (intended change); engine-only: fails -> holds (intended change); context: fails -> holds (intended change); rows: fails -> holds (intended change); sentences: fails -> fails (intended but unchanged); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: fails -> holds (intended change); defaults: fails -> holds (intended change) |
| recommended-row | github-copilot/gpt-6.1-sol | improved | 20010 | unbundled: fails -> holds (intended change); bundled: fails -> holds (intended change); recommendation: fails -> holds (intended change); zero-rows: fails -> holds (intended change); engine-only: fails -> holds (intended change); context: fails -> holds (intended change); rows: fails -> holds (intended change); sentences: fails -> holds (intended change); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: fails -> holds (intended change); defaults: fails -> holds (intended change) |

## Selected repair evidence

Only `recommended-row` ran for this repair; the candidate skill text is unchanged. All twelve existing fact IDs remain. Both baselines hold 2/12 facts. The final candidate judgments hold 11/12 for anthropic/claude-opus-5-5 and 12/12 for github-copilot/gpt-6.1-sol. This is partial coverage, not an all-facts or target-wide pass.

Observed commands and output (all exit 0):

- `timeout -k 30 600 node eval/run.mjs spec-gate recommended-row --baseline-only`: `baseline seeded (replay 2, wall 26s)`.
- `timeout -k 30 600 node eval/run.mjs spec-gate recommended-row`: `spec-gate: improved (report.md written; replay 2, judge 2, confirm 0, wall 54s)`.
- The same selected command after strengthening `engine-only` to require row 2 specifically at 12.0: `spec-gate: improved (report.md written; replay 0, judge 2, confirm 0, wall 20s)`. This reused both arms' stored replies; no additional replay was purchased. The final records carry the strengthened facts' hash.

Residual concern: the final Opus `sentences` judgment rejects the standalone `Pick one:` line. Design 1's authoritative template explicitly requires that line, and both saved replies follow it. The initial judgment held this unchanged fact on the same reply; the final judgment fails it. Preserve the final failing judgment rather than weakening the existing fact or editing the measured skill. Reviewer adjudication is required; the runner's `improved` exit 0 does not mean every fact holds. All newly strengthened Design 7 facts hold on both models, including the 12.0 row-2 recommendation, 26.0/31.0 row-4 recommendations, PR-subject withholding, and full zero-row council render without allowance.

## Retained prior partial-report evidence (not rerun)

These rows preserve the preceding report's evidence, not coverage of this repair; their result records are unchanged. The all-none rows retain their prior evidence at `for: 8b65e167301569e59ea6977c0bb1e0099fe49fe3151238db6cdc6629af06ed8a`; other rows were reported at the current bundle SHA.

| sample | model | baseline -> candidate facts held | verdict | prior sample exit |
|---|---|---|---|---|
| flag-replies | anthropic/claude-opus-5-5 | 2/18 -> 18/18 | improved | 0 |
| flag-replies | github-copilot/gpt-6.1-sol | 2/18 -> 18/18 | improved | 0 |
| full-council | anthropic/claude-opus-5-5 | candidate 5/5 | improved | 0 |
| full-council | github-copilot/gpt-6.1-sol | candidate 5/5 | improved | 0 |
| partial-coverage | anthropic/claude-opus-5-5 | candidate 3/5; confirmation 5/5 | inconclusive | 1 |
| partial-coverage | github-copilot/gpt-6.1-sol | candidate 5/5 | unchanged | 1 |
| drafted-rows-block | anthropic/claude-opus-5-5 | candidate 4/4 | improved | 0 |
| drafted-rows-block | github-copilot/gpt-6.1-sol | candidate 4/4 | improved | 0 |
| all-none | anthropic/claude-opus-5-5 | 4/7 -> 7/7 | improved | 0 |
| all-none | github-copilot/gpt-6.1-sol | 4/7 -> 7/7 | improved | 0 |

Prior residual failure, not rerun: partial-coverage / anthropic/claude-opus-5-5 failed f1 and f5 in its primary reply. It did not paste the briefing and refused approval: "**Briefing:** the summary is in hand and will be pasted verbatim." and "I cannot render the gate faithfully, so I am not treating the reply `2` as an approval." It asked for the committed acceptance section, spec/worktree paths and PR-subject status absent from that legacy case. Confirmation held all five facts, so that prior result remains inconclusive, not passing. This repair changes neither that sample nor its records and makes no target-wide pass claim.

## Feedback

- recommended-row / anthropic/claude-opus-5-5: Before rendered the old six-row menu with no recommended= marker, tag or Recommended line, and refused the recommendation checks because menu-layout.md was missing, so only briefing and drafted held there; After keeps both and moves nine of the other ten facts through the four-row contract. The fact that did not move is sentences: Before fails it on the '(experimental)' label and separate auto-apply rows, and After removes both but 'Pick one:' sits on its own line before row 1 without a numbered row of its own, in both the initial gate and the zero-low gate. What moved the rest is the four fixed labels, flag bullets under rows 1 and 2 with parenthesised defaults (allowance 7 from the gate's own loopEngine result), a single [recommended] tag matching the marker, and the strict above-25 rule applied to 25.1, 26.0 and 31.0 with the fresh-session instruction. The zero-row gate drops row 2 and its flags, prints the loop-unavailable line, and lets context take priority at 31.0. Three wordings carry facts on a lenient reading and are worth tightening: the bundled reasons join outcomes with a comma and say 'a plan splits it into tasks', where 'returning the receipt and emitting an audit event; a plan splits them into tasks' matches the fact directly; row 4 leans on a semicolon to stay one sentence; and each default sits in a closing parenthetical, which only holds while it remains the last clause of a single sentence. Keep the exact string 'Recommended: 2 - no row bundles more than one outcome.' and the 'Withheld: draft PR - #42 already exists' line unchanged, since those facts match on them literally.
- recommended-row / github-copilot/gpt-6.1-sol: After moved every expected fact from fails to holds and kept the two facts Before already held (the verbatim briefing and the drafted-row block before the menu), so nothing regressed. The moves come from four things in the After wording: the fixed four-row menu (plan engine, loop engine, council explanation, draft PR) with one sentence per row; flag bullets placed under the rows that accept them, each ending in its default, with the gate's resolved allowance of 7; a single [recommended] tag matched by the recommended=N marker and the Recommended line; and explicit recommendation rules (strictly above 25% context selects draft PR with the observed percentage and the fresh-session instruction, zero rows selects plan, the first bundled qualifying row selects plan, otherwise loop with the exact fallback reason). Before had a six-row menu with an experimental label and separate auto-apply rows, and it reported every recommendation as undetermined. Three places are fragile and worth pinning in the wording. First, After now emits a `## Briefing` heading between the marker line and the briefing; say whether that heading is wanted so the verbatim-briefing fact cannot be broken by a stricter reading. Second, the zero-low gate adds an unrequested "Summary discrepancy" line, and the bare-digit reply is echoed as `Taking "1" as option 1`, although the Change reserves that echo for bare `approve`; restrict both explicitly. Third, zero-withheld omits the Withheld line that the withheld case prints; state that the line appears whenever row 4 is withheld so the abbreviated cases stay consistent.

exit: 0
