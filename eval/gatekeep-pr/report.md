# eval report: gatekeep-pr (partial run: prior-review-delta)

for: 07f87cc8c9d486acc435d9906ba421f2fdaf53af2955a0f3b685e838cc5eaa00

wall: 124s

## Change

Apply the ancestor step-4 delta boundary to new reviewer findings before severity translation: outside-delta Critical blocks, while outside-delta Moderate and Minor appear only under show evidence, not in Blockers or Nits. Classify by delta hunks rather than path membership. Keep in-delta severity translation, prior-item closure and whole-head contract findings unchanged. Extend prior-review-delta with all three outside-delta severities, in-delta Moderate and Minor, and whole-head doc drift.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| prior-review-delta | anthropic/claude-opus-5-5 | improved | 35942 | d1: holds -> holds (held); d2: holds -> holds (held); d3: holds -> holds (held); d4: holds -> holds (held); d5: fails -> holds (intended change); d6: fails -> holds (intended change); d7: holds -> holds (held); d8: holds -> holds (intended but unchanged); d9: fails -> holds (intended change); d10: fails -> holds (intended change); d11: fails -> holds (intended change); d12: holds -> holds (intended but unchanged); d13: fails -> holds (intended change); d14: holds -> holds (held); d15: holds -> holds (held) |
| prior-review-delta | github-copilot/gpt-6.1-sol | improved | 40644 | d1: holds -> holds (held); d2: holds -> holds (held); d3: holds -> holds (held); d4: holds -> holds (held); d5: fails -> holds (intended change); d6: fails -> holds (intended change); d7: holds -> holds (held); d8: holds -> holds (intended but unchanged); d9: fails -> holds (intended change); d10: fails -> holds (intended change); d11: fails -> holds (intended change); d12: holds -> holds (intended but unchanged); d13: holds -> holds (intended but unchanged); d14: holds -> holds (held); d15: holds -> holds (held) |

## Feedback

- prior-review-delta / anthropic/claude-opus-5-5: After keeps every fact Before kept and fixes the ones Before lost: it now instructs the reviewer to judge R1–R3 first and bound code review to `## Fix delta` with an explicit no-base...head rule on both harnesses (d5), renders the single `Prior review: 1 of 3 items addressed` line directly above Blockers (d6), carries R2 and R3 as blockers with their posted text and locators listed first (d9), records the exact `R3: no closure line - kept open` diagnostic (d10), marks C1 `represented by R3`, discards its reply and drops it from PR comments while C2 stays ordinary (d11), and places the outside-delta Critical after both open prior items (d13). Note that Before already kept the two outside-delta Moderate/Minor findings evidence-only with locators (d12) and already had stable R→P ids with no native duplicates (d8), so those were not actually regressions in this case; the wording that mattered was blocker status from CHANGES_REQUESTED, the explicit closure-count line, the exact R3 diagnostic string, and represented-comment suppression. No regressions observed; keep the current After wording.
- prior-review-delta / github-copilot/gpt-6.1-sol: After regresses nothing and fixes the real gaps: it names the `## Previous review report (re-review trigger)` and `## Fix delta` sections, instructs closure-first review bounded to the delta with an explicit no-substitution rule on both harnesses (d5), renders the exact `Prior review: 1 of 3 items addressed` line directly above Blockers instead of Before's ad-hoc `Addressed items:` line (d6), supplies R1-R3 verbatim with their locators rather than Before's paraphrases (d9), records the literal `R3: no closure line - kept open` diagnostic (d10), and flips C1 to `represented by R3` with its reply discarded and no PR-comments entry, while C2 keeps ordinary triage (d11). Note that d12 already held in Before (the outside-delta Moderate/Minor caller findings were evidence-only with locators there too), so the Change's delta-hunk classification was not the lever for that fact; the wording that actually moved facts was the explicit section labels, the verbatim prior-item text, the fixed closure-diagnostic string, the fixed addressed-count line, and the `represented by R#` comment state. Keep those literal strings and the two-harness task-contract sentence as-is in future iterations; everything else in Before that held (selection, ancestry, union paths, whole-head verification, outside-delta Critical and doc-drift blockers, in-delta severity translation, stable P ids) is preserved in After.

exit: 0
