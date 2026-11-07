# eval report: gatekeep-pr-merge-state (partial run: bound-viewer-green-ci)

for: 346057d43f5ebcc2b501de1e448e278ba85c47f2dd518b5de01e8363b9c42aee

wall: 48s

## Change

Replace per-action repair authority and ordinary wait menus with persistent assess/deliver/deliver-nits courses and the shared menus.md templates. Preserve identity validation, independent claim/mechanism closure, exact-head evidence and terminal cleanup ownership. Source rounds count new repair-wave commits; body-only work and conflict-only syncs have independent accounting. Caps freeze at twice the entry setting, timeout renews only on own push or explicit obstacle continuation, and resumed sync preserves separate restore and lease heads.

Offer the ordinary merge row for BLOCKED only with fresh viewer-relative bypass eligibility and every other prerequisite satisfied. Render `merge - <policy>-merge on ruleset bypass authority; CI evidence stands` and `merge_state_status BLOCKED (bypass eligible; reviewDecision <value>)` on the Evidence line and preserve own/other-author recommendation defaults. Keep UNKNOWN/check_run/status_context classification unchanged, and fail closed on false or unreadable eligibility. Course-unset pending reports use initial without an unauthorized watch; bound CI obstacles and eligible delivery paths use the shared templates. Rename neither sample directories nor stable fact IDs.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bound-viewer-green-ci | anthropic/claude-opus-5-5 | unchanged | 20392 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (intended but unchanged); f4: holds -> holds (held); f5: holds -> holds (held) |
| bound-viewer-green-ci | github-copilot/gpt-6.1-sol | unchanged | 20500 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (intended but unchanged); f4: holds -> holds (held); f5: holds -> holds (held) |

## Feedback

- bound-viewer-green-ci / anthropic/claude-opus-5-5: After keeps every fact Before kept: the CI evidence line, the BLOCKED withhold line with the reviewDecision locator, the merge not-offered reason, the obstacle gate with stop recommended last, no wait row, no automatic sync, and no fabricated approve row. The additions that deliver the Change are the explicit `Obstacle:` paragraph naming `bypass_eligible` unreadable (fail-closed) and the `Not offered: ... approve (no approve row at a BLOCKED obstacle)` note, both of which stay inside the facts. Two wordings are worth tightening so they cannot be misread: the deliver row's 'retries the merge checks once GitHub's BLOCKED state changes' reads close to an ordinary wait row - prefer 'set course to deliver; continuation only on explicit obstacle continuation, no round charged' - and the assess row's 'then approve or stop' hints at an approve path at a BLOCKED obstacle; dropping 'approve or' keeps the row a pure post-the-review action. Also consider moving the Section B resolution block outside the rendered report so the report body matches the shared template exactly.
- bound-viewer-green-ci / github-copilot/gpt-6.1-sol: After keeps every fact Before kept: the Evidence line still resolves to CI with test_unit and build_image green on 9c1e4f2, merge is still listed under Not offered with 'blocked by GitHub', the PR comments line still carries the reviewDecision locator, the obstacle menu still ends with stop recommended and has no wait/approve/sync row, and no sentence names a rule or demands another approver. Note that Before already satisfied f3 as written (deliver/assess/stop, stop last and recommended, no wait or approve row), so the listed fails->holds move for bound-viewer-green-ci/f3 is not visible in this pair; if the intent was to distinguish an obstacle rendering from an ordinary wait menu, the differentiating signal would need to appear in the text (e.g. an explicit obstacle label on the deliver row or a template marker). Two wording shifts worth watching: After drops the 'source: ci' tag and the 'merge_state_status BLOCKED' suffix from the Evidence line — harmless here, but the Change requires 'merge_state_status BLOCKED (bypass eligible; reviewDecision <value>)' on the Evidence line in the eligible sample, so consider keeping the merge_state_status token on Evidence uniformly (e.g. 'Evidence: CI (run 7001, test_unit and build_image green on 9c1e4f2; merge_state_status BLOCKED)') rather than only in the eligible branch. Also, 'retry after the blocked merge prerequisite changes' is fine for f5 but edges toward naming a prerequisite; 'retry after GitHub's BLOCKED state changes' from Before is the safer phrasing.

exit: 0
