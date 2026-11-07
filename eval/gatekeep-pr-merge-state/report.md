# eval report: gatekeep-pr-merge-state (partial run: bypass-eligible-check-pending)

for: 346057d43f5ebcc2b501de1e448e278ba85c47f2dd518b5de01e8363b9c42aee

wall: 32s

## Change

Replace per-action repair authority and ordinary wait menus with persistent assess/deliver/deliver-nits courses and the shared menus.md templates. Preserve identity validation, independent claim/mechanism closure, exact-head evidence and terminal cleanup ownership. Source rounds count new repair-wave commits; body-only work and conflict-only syncs have independent accounting. Caps freeze at twice the entry setting, timeout renews only on own push or explicit obstacle continuation, and resumed sync preserves separate restore and lease heads.

Offer the ordinary merge row for BLOCKED only with fresh viewer-relative bypass eligibility and every other prerequisite satisfied. Render `merge - <policy>-merge on ruleset bypass authority; CI evidence stands` and `merge_state_status BLOCKED (bypass eligible; reviewDecision <value>)` on the Evidence line and preserve own/other-author recommendation defaults. Keep UNKNOWN/check_run/status_context classification unchanged, and fail closed on false or unreadable eligibility. Course-unset pending reports use initial without an unauthorized watch; bound CI obstacles and eligible delivery paths use the shared templates. Rename neither sample directories nor stable fact IDs.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bypass-eligible-check-pending | anthropic/claude-opus-5-5 | unchanged | 13457 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held) |
| bypass-eligible-check-pending | github-copilot/gpt-6.1-sol | improved | 16654 | f1: holds -> holds (held); f2: fails -> holds (unplanned improvement); f3: fails -> holds (unplanned improvement); f4: holds -> holds (held); f5: fails -> holds (unplanned improvement) |

## Feedback

- bypass-eligible-check-pending / anthropic/claude-opus-5-5: No fact moved: both outputs render the initial template with course unset, verdict 'not ready - e2e pending' tied to the assessed head, the merge row withheld with 'Not offered: merge (e2e pending)', no bypass annotation anywhere, and assess/deliver/stop with deliver recommended and nothing performed before a numeric pick. Two regressions in After are worth fixing even though no fact catches them here: the assess row now says 'then approve or stop', which is wrong for an own PR (the author cannot approve, and Before correctly said 'then stop, no repairs' and noted that zero blockers means nothing is posted); and the deliver row dropped the exact head ('watch e2e on abc1234') in favor of 'watch CI until e2e settles', which loosens the exact-head evidence binding the Change says to preserve. Suggested wording: '1. assess - post the review to the PR (zero blockers, so nothing is posted); then stop, no repairs.' and '2. deliver - watch e2e on abc1234, repair anything it turns up, sync with main if needed, repeat until merge is offered. [recommended]'. Keep the 'approve or stop' continuation only on other-author menus.
- bypass-eligible-check-pending / github-copilot/gpt-6.1-sol: After delivers the Change on this sample: it switches from the obstacle gate to initial with course unset, drops the "blocked by GitHub" withhold in favor of "Not offered: merge (e2e pending)", recommends deliver for the own PR, and makes no bypass claim anywhere. The one regression risk is the evidence rendering: Before printed an explicit "Evidence: pending (e2e binding; head abc1234)" line and echoed the record after "show evidence", while After only implies pending via the comment and verdict and never names the assessed head abc1234, so f1 holds only by inference. Keep the initial template's Evidence line (e.g. "Evidence: pending (e2e binding; head abc1234)") and the inline record on the show-evidence footer so exact-head evidence stays visible in course-unset pending reports without reintroducing any watch or bypass annotation.

exit: 0
