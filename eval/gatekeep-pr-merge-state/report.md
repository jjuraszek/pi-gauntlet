# eval report: gatekeep-pr-merge-state (partial run: bound-viewer-green-ci)

for: ff15330a8f6fa8871004885209e64434a402c5a782de29c18ccad108f680b8fc

wall: 46s

## Change

Keep merge preconditions, exact-head CI evidence and fresh viewer-relative bypass eligibility unchanged. Render the ordinary merge row as using your admin override when eligible, explain required checks passed in plain prose, and leave raw merge-state and review-decision fields under show evidence. Keep one merge row and no bypass row. The replay wrapper requests three unlabeled report parts rather than field labels or raw accounting.

Recommend row 1 from the current assessment: pending-only CI recommends deliver, an unchanged prerequisite with no useful non-stop row recommends stop, and readiness recommends merge regardless of authorship. Preserve UNKNOWN/check_run/status_context classification and fail-closed eligibility. With unreadable eligibility and successful CI, say required checks passed independently of GitHub's block.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bound-viewer-green-ci | anthropic/claude-opus-5-5 | improved | 18228 | f1: holds -> holds (held); f2: holds -> holds (held); f3: fails -> holds (intended change); f4: fails -> holds (unplanned improvement); f5: holds -> holds (held) |
| bound-viewer-green-ci | github-copilot/gpt-6.1-sol | improved | 18640 | f1: fails -> holds (unplanned improvement); f2: holds -> holds (held); f3: fails -> holds (intended change); f4: fails -> holds (unplanned improvement); f5: holds -> holds (held) |

## Feedback

- bound-viewer-green-ci / anthropic/claude-opus-5-5: After moves f3 and f4 to holds without losing anything Before kept: stop is now row 1 with recommended=1 under the obstacle gate, the labeled 'PR comments:' line and the raw '(merge_state_status BLOCKED; reviewDecision REVIEW_REQUIRED)' parenthetical are gone, and the block is stated in plain prose ('GitHub blocks you from merging this PR and no local repair applies') while identifiers stay behind show evidence. CI resolution is still explicit (test_unit and build_image passed on the current head, lint skipped and inert, no local run, verification independent of the block), merge remains not offered with the GitHub-blocked reason, and no sentence names a rule or says another developer must approve. One small tightening: the prose says the block twice ('Nothing in the code blocks merging, but GitHub blocks you...' and later 'Merge is not offered because GitHub blocks this actor...'); keeping just the second as the merge-row reason and letting the first stand as the obstacle statement would read cleaner, but neither repetition moves a fact.
- bound-viewer-green-ci / github-copilot/gpt-6.1-sol: After improves on Before without regressing anything: it moves stop to row 1 as recommended (f3), drops the labeled 'PR comments:' line and the raw merge_state_status/reviewDecision fields from prose (f4), and keeps run 7001 / head 9c1e4f2 out of the report body and out of the 'show evidence' prompt line (f1), while still stating in plain prose that GitHub blocks this actor's merge and that merge is not offered for that reason (f2), and never attributing the block to a specific rule or to a missing approval (f5). The only wording worth tightening is the volunteered aside 'your requested-reviewer status cannot be determined from the supplied snapshot', which is not part of the digest and edges toward speculating about the block's cause; replacing it with the simpler 'you are not the author' keeps f5 safely intact. Otherwise the After template is the one to keep: three unlabeled prose parts, override eligibility stated as unreadable, required checks described as passed independently of the block, and identifiers reserved for show evidence.

exit: 0
