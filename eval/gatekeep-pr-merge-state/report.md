# eval report: gatekeep-pr-merge-state (partial run: bound-viewer-green-ci)

for: 445bc24e0d55242b158b86fe9b77085896bb8aebb08191be86d7594f02a2b208

wall: 39s

## Change

Keep merge preconditions, exact-head CI evidence and fresh viewer-relative bypass eligibility unchanged. Render the ordinary merge row as using your admin override when eligible, explain required checks passed in plain prose, and leave raw merge-state and review-decision fields under show evidence. Keep one merge row and no bypass row. The replay wrapper requests three unlabeled report parts rather than field labels or raw accounting.

Recommend row 1 from the current assessment: pending-only CI recommends deliver, an unchanged prerequisite with no useful non-stop row recommends stop, and readiness recommends merge regardless of authorship. Preserve UNKNOWN/check_run/status_context classification and fail-closed eligibility. With unreadable eligibility and successful CI, say required checks passed independently of GitHub's block.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bound-viewer-green-ci | anthropic/claude-opus-5-5 | improved | 18036 | f1: holds -> holds (held); f2: holds -> holds (held); f3: fails -> holds (intended change); f4: fails -> holds (unplanned improvement); f5: holds -> holds (held) |
| bound-viewer-green-ci | github-copilot/gpt-6.1-sol | improved | 18426 | f1: fails -> holds (unplanned improvement); f2: holds -> holds (held); f3: fails -> holds (intended change); f4: fails -> holds (unplanned improvement); f5: holds -> holds (held) |

## Feedback

- bound-viewer-green-ci / anthropic/claude-opus-5-5: After keeps every fact Before kept and gains f3 and f4: stop is now row 1 with the recommendation line pointing at it, the labeled 'PR comments:' line and the raw '(merge_state_status BLOCKED; reviewDecision REVIEW_REQUIRED)' parenthetical are gone, and the CI resolution still names test_unit/build_image as passed on the assessed head with lint inert, no identifiers in prose, and the block explicitly separated from verification. The one soft spot is f2: Before had an explicit 'Not offered: merge (blocked by GitHub)' line, while After only implies the omission through the prose sentence 'GitHub blocks this actor from merging and no local repair applies' and the recommendation paragraph. A careful reader still gets the reason, but to make it unambiguous without reintroducing field labels, add one plain sentence near the menu such as 'Merge is not offered because GitHub reports it blocked for you.' That keeps the three-unlabeled-parts shape, preserves f4/f5, and leaves raw merge-state and review-decision fields under show evidence.
- bound-viewer-green-ci / github-copilot/gpt-6.1-sol: After moved f1, f3, and f4 from fails to holds and kept f2 and f5: it states test_unit and build_image passed on the assessed head in plain prose without leaking run 7001 or head 9c1e4f2, says GitHub blocks this actor's merge without a labeled 'PR comments:' line or a reviewDecision field, and puts stop at row 1 with no wait row, no automatic sync, and no fabricated approve row. Before failed f1 by printing run and commit identifiers in the Evidence line and in the closing prompt, failed f3 by recommending row 3, and failed f4 with the labeled PR comments bullet carrying merge_state_status and reviewDecision fields. The one soft spot in After is f2: the merge row's absence is only implied by prose ('GitHub blocks this actor from merging … merging cannot proceed'), and the sentence pairing it with 'override eligibility could not be established' slightly blurs the stated reason. To keep f2 unambiguous while preserving the unlabeled-report style, add a single line after the menu such as 'Not offered: merge - GitHub reports the merge as blocked.' and keep the eligibility note as a separate clause rather than part of the merge-block reason.

exit: 0
