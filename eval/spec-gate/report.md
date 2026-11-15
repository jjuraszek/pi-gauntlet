# eval report: spec-gate (partial run: full-council, partial-coverage, drafted-rows-block, flag-replies)

for: 958814567d03516a4f7f622e366e95465fbad02d1857943813f6ae0055edefae

## Change

Migrate full-council's plan approval and drafted-rows-block's menu to the four-row contract, preserving their briefing and audit subjects. Full-council overrides the shared one-sentence approval shortcut so the narrated full grant, audit-preserving amend and HEAD check are observable. Extend flag-replies with recommended approve and opt-out, row labels with flags, bare defaults, combined loop opt-out/allowance and every rejected-reply class. Partial-coverage's case and facts are unchanged: its f5 already says reply 2 grants auto-apply amendments.

These are selected, tool-free narrative replays, not live persistence or target-wide verification. Case changes received baseline-only runs before comparison. Initial full-council, partial-coverage and drafted-rows-block comparisons refused with exit 2 because the intent SHA was stale; the intent header was corrected to the observed assembly SHA before their actual comparisons. No skill or target configuration changed.

## Cells

Facts count the saved primary candidate judgment. Confirmation is shown separately, never substituted for a failing primary reply. Each row's exit is the whole sample command's exit.

| sample | model | facts held | verdict | exit |
|---|---|---|---|---|
| full-council | anthropic/claude-opus-5-5 | 5/5 | improved | 0 |
| full-council | github-copilot/gpt-6.1-sol | 5/5 | improved | 0 |
| partial-coverage | anthropic/claude-opus-5-5 | 3/5; confirmation 5/5 | inconclusive | 1 |
| partial-coverage | github-copilot/gpt-6.1-sol | 5/5 | unchanged | 1 |
| drafted-rows-block | anthropic/claude-opus-5-5 | 4/4 | improved | 0 |
| drafted-rows-block | github-copilot/gpt-6.1-sol | 4/4 | improved | 0 |
| flag-replies | anthropic/claude-opus-5-5 | 17/17 | improved | 0 |
| flag-replies | github-copilot/gpt-6.1-sol | 17/17 | improved | 0 |

## Residual failures

Partial-coverage / anthropic/claude-opus-5-5 fails f1 and f5 in the primary reply. It does not paste the briefing and refuses approval: "**Briefing:** the summary is in hand and will be pasted verbatim." and "I cannot render the gate faithfully, so I am not treating the reply `2` as an approval." It asks for the committed acceptance section, spec/worktree paths and PR-subject status, which this legacy case does not supply. The runner's confirmation held all five facts, so the final result is inconclusive, not passing. The sample was left unchanged as instructed where the review premise is wrong: f5 already reads "The reply `2` is treated as approval granting auto-apply amends." No skill-text repair or accepted variance masks this result.

Full-council initially held 5/5 for Opus and 4/5 for Sol despite exit 0; Sol's f5 narration only named "the default amendment grant" and omitted explicit audit preservation and both HEAD fields. After investigating that reply, the case's narrated approval recipe was clarified, baseline reseeded and both models held 5/5. The final records reflect this repair.

## Observed command output

- `node eval/run.mjs spec-gate full-council --baseline-only`: `baseline seeded (replay 2, wall 19s)`; exit 0.
- `node eval/run.mjs spec-gate full-council`: `spec-gate: improved (report.md written; replay 2, judge 2, confirm 0, wall 34s)`; exit 0.
- `node eval/run.mjs spec-gate partial-coverage`: `spec-gate: inconclusive (report.md written; replay 2, judge 3, confirm 1, wall 64s)`; exit 1.
- `node eval/run.mjs spec-gate drafted-rows-block`: `spec-gate: improved (report.md written; replay 2, judge 2, confirm 0, wall 34s)`; exit 0.
- `node eval/run.mjs spec-gate flag-replies --baseline-only`: `baseline seeded (replay 2, wall 55s)`; exit 0.
- `node eval/run.mjs spec-gate flag-replies`: `spec-gate: improved (report.md written; replay 2, judge 2, confirm 0, wall 59s)`; exit 0.

## Retained prior partial-report rows (not rerun)

These all-none rows retain their prior evidence at for: 8b65e167301569e59ea6977c0bb1e0099fe49fe3151238db6cdc6629af06ed8a; they are not current coverage. Their result records are unchanged.

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| all-none | anthropic/claude-opus-5-5 | improved | 11467 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: fails -> holds (intended change); plan: fails -> holds (intended change); draft: fails -> holds (intended change) |
| all-none | github-copilot/gpt-6.1-sol | improved | 9575 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: fails -> holds (intended change); plan: fails -> holds (intended change); draft: fails -> holds (intended change) |

exit: 1
