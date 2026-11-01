# eval report: gatekeep-pr (partial run: prior-review-delta)

for: 3836dbd811661045c1688a70ed767a54d27c75f41a216efa08008faddc66b30f

wall: 73s

## Change

Select the viewer's newest submitted, non-dismissed REST review as the baseline for an ancestor step-4 re-review. Supply its numbered body items and joined inline comments to the shared re-review task on both harnesses, with only the review-commit-to-head delta over the union of prior and current PR paths. Count explicit resolved closure lines in one Prior review report line. Preserve whole-head verification and contract judgments and the fix wave's existing pushed-head boundary. This iteration covers baseline selection, task construction and the addressed count; closure integration and nonancestor/same-head report variants have separate ledger rows.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| prior-review-delta | anthropic/claude-opus-5-5 | improved | 21259 | d1: holds -> holds (intended but unchanged); d2: holds -> holds (intended but unchanged); d3: holds -> holds (intended but unchanged); d4: holds -> holds (intended but unchanged); d5: fails -> holds (intended change); d6: fails -> holds (intended change); d7: holds -> holds (held) |
| prior-review-delta | github-copilot/gpt-6.1-sol | improved | 26763 | d1: holds -> holds (intended but unchanged); d2: holds -> holds (intended but unchanged); d3: holds -> holds (intended but unchanged); d4: holds -> holds (intended but unchanged); d5: fails -> holds (intended change); d6: fails -> holds (intended change); d7: holds -> holds (held) |

## Feedback

- prior-review-delta / anthropic/claude-opus-5-5: Before already selected 702/1111…, ran the ancestry check, built the path union with src/legacy-helper.mjs, joined 801 to review 702 while excluding 802, and ran the worker before the reviewer, so d1–d4 and d7 held on both sides. After moved d5 and d6 to holds: the Re-review task now says to judge R1–R3 first, bounds code review to the labeled fix delta, explicitly forbids substituting the base...head patch, and hands the same Re-review text to the Claude Code subagent (Before put closure lines after the native report and gave Claude Code only Section C, the baseline and the closure contract, with no Fix delta or previous report), and the report line is now literally 'Prior review: 1 of 3 items addressed' directly above Blockers, counting only the explicit resolved line (Before used a different 'Previous review: … is addressed (…); 2 remain open below' sentence). Nothing regressed. Two tightening suggestions: state the inline join explicitly as 'numeric pull_request_review_id == 702' rather than 'belongs to review 700' so d4 reads unambiguously, and reconsider the new comment-triage block that drafts replies to the viewer's own comments 801/802 — Before correctly noted they are the viewer's own and drafted nothing, and the Change paragraph did not ask for that behavior.
- prior-review-delta / github-copilot/gpt-6.1-sol: After keeps every fact Before kept and moves d5 and d6: it labels the bounded patch as **Fix delta**, names the shared **Re-review task** contract, orders listed-item closure first, explicitly forbids reviewing against the gathered base-to-head patch, states the identical items and labeled delta are supplied on Claude Code, and renders the single `Prior review: 1 of 3 items addressed` line directly above Blockers (replacing Before's `PR comments:` bullet, which never counted closure lines). Note that d1–d4 already held in Before by its own text (numeric-id tie break, 702 over 701/703/704–706, merge-base ancestry, path union with legacy-helper, R1–R3 with 801 and 802 excluded, per-item closure lines), so the only real deltas were the task labeling/ordering and the report line. Two small wording nits in After worth tightening without affecting any fact: '703 belongs to another viewer' should read 'another reviewer' (the viewer is delta-example), and the join rule could be stated explicitly as 'inline comments joined by numeric pull_request_review_id 702' rather than only 'I attach only inline comment 801', so a reader sees the join key rather than inferring it.

exit: 0
