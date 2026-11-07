# eval report: gatekeep-pr-merge-state (partial run: bound-viewer-green-ci)

for: 0429b58b0a5861a1e310dfa2de3d5107f0db1d782031fb1e46256da021c1aceb

wall: 44s

## Change

Replace per-action repair authority and ordinary wait menus with persistent assess/deliver/deliver-nits courses and the shared menus.md templates. Preserve identity validation, independent claim/mechanism closure, exact-head evidence and terminal cleanup ownership. Source rounds count new repair-wave commits; body-only work and conflict-only syncs have independent accounting. Caps freeze at twice the entry setting, timeout renews only on own push or explicit obstacle continuation, and resumed sync preserves separate restore and lease heads.

Offer the ordinary merge row for BLOCKED only with fresh viewer-relative bypass eligibility and every other prerequisite satisfied. Render `merge - <policy>-merge on ruleset bypass authority; CI evidence stands` and `merge_state_status BLOCKED (bypass eligible; reviewDecision <value>)` on the Evidence line and preserve own/other-author recommendation defaults. Keep UNKNOWN/check_run/status_context classification unchanged, and fail closed on false or unreadable eligibility. Course-unset pending reports use initial without an unauthorized watch; bound CI obstacles and eligible delivery paths use the shared templates. Rename neither sample directories nor stable fact IDs.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bound-viewer-green-ci | anthropic/claude-opus-5-5 | unchanged | 18910 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (intended but unchanged); f4: holds -> holds (held); f5: holds -> holds (held) |
| bound-viewer-green-ci | github-copilot/gpt-6.1-sol | unchanged | 16632 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (intended but unchanged); f4: holds -> holds (held); f5: holds -> holds (held) |

## Feedback

- bound-viewer-green-ci / anthropic/claude-opus-5-5: Nothing moved on this sample: both outputs render the obstacle gate with assess/deliver/stop, stop last and recommended, no wait row, no automatic sync, no approve row, the merge row withheld as 'blocked by GitHub', the single PR-comments line with the reviewDecision locator, and CI evidence on 9c1e4f2. The Change expected bound-viewer-green-ci/f3 to go fails -> holds, but Before already satisfied it as written, so the After wording is a lateral rewrite here rather than a fix; the only substantive deltas are the explicit cap arithmetic ('+2 x maxFixRounds: 0 of 10 -> 0 of 20'), 'set course to assess' instead of 'switch course', and 'end the run' instead of 'remove the worktree' in the stop row. One caution: After's assess row says 'with zero blockers nothing is posted, then approve or stop' - that phrasing comes close to promising an approve step on another author's REVIEW_REQUIRED PR and could tempt a future variant into fabricating an approve row or a 'needs approval' sentence (f3/f5 risk). Safer wording that still delivers the shared-template intent: 'assess - set course to assess; post the review to the PR (nothing to post when there are no findings), no repairs', leaving approve/stop to the later final menu.
- bound-viewer-green-ci / github-copilot/gpt-6.1-sol: Nothing moved in this sample: both outputs render gate=gatekeep-pr/obstacle with deliver/assess/stop, stop recommended last, no wait row, no automatic sync, no fabricated approve row, the merge row withheld with a 'blocked by GitHub' reason, one PR-comments line citing merge_state_status BLOCKED with reviewDecision REVIEW_REQUIRED as the locator, and no sentence naming a rule or demanding another developer's approval, so f3 already held in Before and the expected fails->holds does not show up in the text. The After wording is fine for every fact but it thinned the Evidence line (dropping 'source: ci', the lint skipped note, the '0 binding pending checks' count and the 'merge_state_status BLOCKED' marker) and moved 'Not offered' below the menu; if the Change intends the shared menus.md template to carry the Evidence line, keep the fuller Before form (source, skipped non-required checks, binding pending count, merge_state_status) so exact-head evidence stays complete, and keep the deliver row phrased as a course switch that waits for the GitHub block to change rather than letting it read as an ordinary wait row.

exit: 0
