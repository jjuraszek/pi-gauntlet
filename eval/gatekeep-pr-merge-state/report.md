# eval report: gatekeep-pr-merge-state (partial run: bypass-eligible-blocked)

for: be9907dbc46b886ce97f0dd9bc35b98dd39c7584796403712a9e24c9dbc3f5cd

wall: 18s

## Change

Keep merge preconditions, exact-head CI evidence and fresh viewer-relative bypass eligibility unchanged. Render the ordinary merge row as using your admin override when eligible, explain required checks passed in plain prose, and leave raw merge-state and review-decision fields under show evidence. Keep one merge row and no bypass row. The replay wrapper requests three unlabeled report parts rather than field labels or raw accounting.

Recommend row 1 from the current assessment: pending-only CI recommends deliver, an unchanged prerequisite with no useful non-stop row recommends stop, and readiness recommends merge regardless of authorship. Preserve UNKNOWN/check_run/status_context classification and fail-closed eligibility. With unreadable eligibility and successful CI, say required checks passed independently of GitHub's block.

## Coverage and authority

Coverage is sample-scoped, not a target-wide pass. These four samples run at the final skill text: bound-viewer-green-ci, bypass-eligible-blocked, bypass-eligible-check-pending and bypass-eligible-green-ci. Every current must-hold cell in those four samples holds on both models. bound-viewer-green-ci and the eligible green/pending cases are assembly-bound; the blocked case exercises edited override wording and receives a D5 expectation correction that keeps raw head/run/check identifiers behind show evidence.

Preserved earlier-revision results: exempt-viewer-status-pending, flip-after-update-branch, live-checkrun-pending, same-head-flip and unknown-after-repoll. Their recorded skillSha identifies the revision that produced each result; they do not establish final-text coverage.

The caller excludes the two base-existing unchanged-mechanics failures in gatekeep-pr without a spec amendment. This target keeps its saved results; none of its current must-hold cells requires another run.

D8 baseline limitation: the frozen baseline uses the working-tree skillFiles list, with menus.md and without decision-menu.md. It does not establish the original 11-template flow. Judge candidate facts absolutely, not from improved or unchanged comparison direction. Mechanical preservation rests on the migrated deterministic assertions and selected candidate facts. Live non-admin override eligibility remains unverified; no live PR or target-wide sweep runs.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bypass-eligible-blocked | anthropic/claude-opus-5-5 | improved | 18049 | f1: fails -> holds (unplanned improvement); f2: holds -> holds (held); f3: fails -> holds (unplanned improvement); f4: fails -> holds (unplanned improvement); f5: holds -> holds (held) |
| bypass-eligible-blocked | github-copilot/gpt-6.1-sol | improved | 15133 | f1: fails -> holds (unplanned improvement); f2: holds -> holds (held); f3: fails -> holds (unplanned improvement); f4: fails -> holds (unplanned improvement); f5: holds -> holds (held) |

## Feedback

- bypass-eligible-blocked / anthropic/claude-opus-5-5: After keeps every fact Before kept and fixes the three Before failed: the merge row now reads "squash-merge using your admin override" with no separate bypass row (f1); Snapshot B recommends merge on row 1 while retaining approve and leaving stop last (f3); and the CI result is stated in plain prose ("the required test check passed on this exact head") with run 701, abc1234, and the raw merge_state_status/reviewDecision fields pushed behind show evidence instead of the inline Evidence line (f4). No merge is performed, no extra approval is demanded, and "GitHub requires an admin override" plus "your account is eligible" avoids naming a rule or claiming live non-admin proof (f5). Two small consistency points worth tightening: the gauntlet header is rendered as a plain line before "Snapshot A" but as backticked code after "Snapshot B", so the wrapper should fix one placement and formatting for both parts; and "required test check" edges toward naming the check identifier inline, so consider "the required checks passed in CI on this exact head" to match the fact wording literally while keeping the identifier behind show evidence.
- bypass-eligible-blocked / github-copilot/gpt-6.1-sol: After moves f1, f3 and f4 from fails to holds without breaking f2 or f5: both merge rows now read "squash-merge using your admin override" with no separate bypass/admin row, Snapshot B now recommends merge at row 1 while keeping approve and a trailing stop, and the reports say "required checks passed in CI" in prose while pushing head/run/check identifiers and merge_state_status/reviewDecision behind show evidence. Before failed f1 by phrasing the row as "ruleset bypass authority", f3 by recommending approve for the non-author, and f4 by inlining abc1234, run 701, BLOCKED and REVIEW_REQUIRED. One wording caution for After: "eligible to use it with your write access" / "maintainer access" ties the override to the permission level rather than to the fresh viewer-relative bypass field; a safer phrasing that keeps every fact is "you are eligible to use that override on this PR" (dropping the permission tie), which avoids implying a repository-level rule or non-admin proof while still delivering the Change.

exit: 0
