for: 3dc041183b2feb9a615dfbb4e4ed6ccaa879d50a88bb238297fb777fe939398c

## Change
Integrate ancestor step-4 R-item closure into stable P findings. Drop explicitly resolved prior items; keep open and missing-closure items with their posted text and locators, using the posted review's severity rather than today's reviewer rating. Deduplicate native findings against those identities. Mark the selected review's inline C rows represented by their R items, discard their replies, and preserve that non-replyable state through re-triage. Keep prior-review selection, delta construction and whole-head verification unchanged.

## Expected to move
- prior-review-delta/d8: fails -> holds - Keep stable R-to-P identities without duplicate native findings.
- prior-review-delta/d9: fails -> holds - Preserve posted blockers and locators despite a fresh Minor rating.
- prior-review-delta/d10: fails -> holds - Keep missing-closure items open with the exact show-evidence diagnostic.
- prior-review-delta/d11: fails -> holds - Suppress represented inline replies at initial integration and re-triage without suppressing unrelated comments.
- prior-review-delta/d5: fails -> holds - Preserve the shared bounded review task on both harnesses from the preceding iteration.
- prior-review-delta/d6: fails -> holds - Preserve the explicit-closure addressed count from the preceding iteration.
