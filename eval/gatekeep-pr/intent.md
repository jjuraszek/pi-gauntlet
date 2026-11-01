for: 618d95f63eedc6e6a38b3d7c92e1da31eab7cd104fa52135672b0ef7793ed824

## Change
Render one reason-bearing prior-review fallback line above Blockers or Verdict when the selected review commit is not an ancestor or ancestry cannot be checked. Preserve whole-diff review on both harnesses, the first stderr line for check failures, and no baseline fetch or retry. Add prior-review-force-push with exit 1, missing-object exit 128, and null-commit checkpoints; preserve baseline selection and ordinary blocker integration.

## Expected to move
- prior-review-force-push/p1: fails -> holds - Preserve the selected submitted REST review despite a missing commit.
- prior-review-force-push/p2: fails -> holds - Record force-push ancestry failure from exit 1.
- prior-review-force-push/p3: fails -> holds - Carry the first stderr line from exit 128.
- prior-review-force-push/p4: fails -> holds - Keep a null-commit review and its missing-commit reason without inventing a SHA.
- prior-review-force-push/p8: fails -> holds - Render the force-push whole-diff fallback above Blockers.
- prior-review-force-push/p9: fails -> holds - Render the unreadable-baseline whole-diff fallback above Blockers.
- prior-review-force-push/p10: fails -> holds - Render the null-commit whole-diff fallback above Verdict.
