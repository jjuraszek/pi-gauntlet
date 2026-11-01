for: 07f87cc8c9d486acc435d9906ba421f2fdaf53af2955a0f3b685e838cc5eaa00

## Change
Apply the ancestor step-4 delta boundary to new reviewer findings before severity translation: outside-delta Critical blocks, while outside-delta Moderate and Minor appear only under show evidence, not in Blockers or Nits. Classify by delta hunks rather than path membership. Keep in-delta severity translation, prior-item closure and whole-head contract findings unchanged. Extend prior-review-delta with all three outside-delta severities, in-delta Moderate and Minor, and whole-head doc drift.

## Expected to move
- prior-review-delta/d12: fails -> holds - Keep new outside-delta Moderate and Minor findings evidence-only even in a file included in the union path set.
- prior-review-delta/d13: fails -> holds - Retain the outside-delta Critical blocker after the open prior items.
- prior-review-delta/d5: fails -> holds - Preserve the shared bounded review task on both harnesses from the preceding iterations.
- prior-review-delta/d6: fails -> holds - Preserve the explicit-closure addressed count from the preceding iterations.
- prior-review-delta/d8: fails -> holds - Preserve stable R-to-P identities without duplicate native findings.
- prior-review-delta/d9: fails -> holds - Preserve posted blockers and locators despite a fresh Minor rating.
- prior-review-delta/d10: fails -> holds - Preserve the exact missing-closure show-evidence diagnostic.
- prior-review-delta/d11: fails -> holds - Preserve represented inline reply suppression through re-triage.
