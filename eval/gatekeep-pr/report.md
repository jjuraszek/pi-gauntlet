# eval report: gatekeep-pr (partial run: prior-review-force-push)

for: 618d95f63eedc6e6a38b3d7c92e1da31eab7cd104fa52135672b0ef7793ed824

wall: 22s

refresh: complete; sample: prior-review-force-push; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](results/prior-review-force-push/candidate.json)

## Change

Render one reason-bearing prior-review fallback line above Blockers or Verdict when the selected review commit is not an ancestor or ancestry cannot be checked. Preserve whole-diff review on both harnesses, the first stderr line for check failures, and no baseline fetch or retry. Add prior-review-force-push with exit 1, missing-object exit 128, and null-commit checkpoints; preserve baseline selection and ordinary blocker integration.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| prior-review-force-push | anthropic/claude-opus-5-5 | improved | 21209 | p1: holds -> holds (intended but unchanged); p2: fails -> holds (intended change); p3: fails -> holds (intended change); p4: fails -> holds (intended change); p5: holds -> holds (held); p6: holds -> holds (held); p7: holds -> holds (held); p8: fails -> holds (intended change); p9: fails -> holds (intended change); p10: fails -> holds (intended change); p11: holds -> holds (held) |
| prior-review-force-push | github-copilot/gpt-6.1-sol | improved | 19940 | p1: holds -> holds (intended but unchanged); p2: fails -> holds (intended change); p3: fails -> holds (intended change); p4: fails -> holds (intended change); p5: holds -> holds (held); p6: holds -> holds (held); p7: holds -> holds (held); p8: fails -> holds (intended change); p9: fails -> holds (intended change); p10: fails -> holds (intended change); p11: holds -> holds (held) |

## Feedback

- prior-review-force-push / anthropic/claude-opus-5-5: After delivers the Change cleanly: each checkpoint now records the digest delta as `not ancestor (<reason>)` with the intended reason (force push or rebase from exit 1; the first stderr line only from exit 128; review commit is missing for the null commit), and each report renders exactly one `Prior review: baseline … is not an ancestor of the head (…), so the whole diff was reviewed` line directly above Blockers in A and B and above Verdict in C, with no addressed-items count and no manufactured SHA. Before failed p2/p3/p4/p8/p9/p10 because it wrote ad-hoc digest values (`not-ancestor (exit 1)`, `unreadable (exit 128: …)`, `not run (no commit recorded)`) and put the fallback in a free-form `PR comments:` bullet instead of the fixed line. Nothing that Before kept regressed: selection of 702 (excluding 705 and 706), whole-diff `origin/main...2222…` on both pi and Claude Code with no Re-review task, no baseline fetch or retry, verify-before-review on the current head, and Moderate as an ordinary blocker all survive. One small wording note: A step 7's 'The ancestry result for this same pair is still valid' is fine as the scheduled pre-dispatch check, but phrasing it as 'the step-4 pre-dispatch check reuses the same exit-1 outcome for 1111111/2222222' would make it unmistakably not a recovery retry.
- prior-review-force-push / github-copilot/gpt-6.1-sol: After delivers the Change cleanly: each checkpoint now records a `prior_review.delta: not ancestor (...)` value with the intended reason (force push or rebase from exit 1; only the first stderr line from exit 128, explicitly dropping `additional diagnostic details`; `review commit is missing` for the null commit with no git command run), and each report renders exactly one `Prior review: baseline ... so the whole diff was reviewed` line directly above Blockers (A, B) or Verdict (C) with the 7-char or `unknown` baseline and no addressed-items count. Before failed p2–p4 and p8–p10 because it stored `check failed`/`not checked` instead of `not ancestor`, kept both stderr lines in the diagnostic record, and surfaced the fallback as a `PR comments:` bullet rather than the reason-bearing prior-review line. Note p1 already held in Before (702 was selected in all three runs), so it did not actually move. Nothing After does regresses the retained facts: whole-diff boundary on both harnesses, verify-before-review on the current head, no baseline fetch, and the two ancestry checks in A/B are the scheduled provisioning and pre-dispatch boundary checks consuming the supplied outcome, not recovery retries; the Moderate retry-bypass finding stays the single ordinary blocker and C remains mergeable. If anything, keep the C pre-dispatch step phrased as it is ("reconsider ... no git command runs") so readers cannot mistake it for a fabricated-SHA check.

exit: 0
