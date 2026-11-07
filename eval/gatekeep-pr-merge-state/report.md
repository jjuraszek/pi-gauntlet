# eval report: gatekeep-pr-merge-state (partial run: bypass-eligible-green-ci)

for: 346057d43f5ebcc2b501de1e448e278ba85c47f2dd518b5de01e8363b9c42aee

wall: 35s

## Change

Replace per-action repair authority and ordinary wait menus with persistent assess/deliver/deliver-nits courses and the shared menus.md templates. Preserve identity validation, independent claim/mechanism closure, exact-head evidence and terminal cleanup ownership. Source rounds count new repair-wave commits; body-only work and conflict-only syncs have independent accounting. Caps freeze at twice the entry setting, timeout renews only on own push or explicit obstacle continuation, and resumed sync preserves separate restore and lease heads.

Offer the ordinary merge row for BLOCKED only with fresh viewer-relative bypass eligibility and every other prerequisite satisfied. Render `merge - <policy>-merge on ruleset bypass authority; CI evidence stands` and `merge_state_status BLOCKED (bypass eligible; reviewDecision <value>)` on the Evidence line and preserve own/other-author recommendation defaults. Keep UNKNOWN/check_run/status_context classification unchanged, and fail closed on false or unreadable eligibility. Course-unset pending reports use initial without an unauthorized watch; bound CI obstacles and eligible delivery paths use the shared templates. Rename neither sample directories nor stable fact IDs.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bypass-eligible-green-ci | anthropic/claude-opus-5-5 | improved | 13043 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: holds -> holds (held) |
| bypass-eligible-green-ci | github-copilot/gpt-6.1-sol | improved | 15506 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: holds -> holds (held) |

## Feedback

- bypass-eligible-green-ci / anthropic/claude-opus-5-5: After moves f1-f4 to holding exactly as intended: the gate is final, row 1 is the verbatim ordinary `merge - squash-merge on ruleset bypass authority; CI evidence stands` with merge recommended for the author, approve is kept off the menu as `Not offered: approve (own PR)`, stop is last, and the Evidence line carries `merge_state_status BLOCKED (bypass eligible; reviewDecision REVIEW_REQUIRED)` alongside the exact-head run 701 / abc1234 evidence with no merge-waits comments line and no `Not offered: merge`. f5 is preserved from Before: nothing is merged, no approval is demanded, no specific blocking rule, admin login, or live non-admin proof is named (the phrase "ruleset bypass authority" describes the authority class, not a rule). Nothing regressed; keep the Evidence-line wording and the fixed merge-row template as-is, and avoid any future tightening that would turn "ruleset bypass authority" into a named rule or admin identity.
- bypass-eligible-green-ci / github-copilot/gpt-6.1-sol: After moved f1–f4 from fails to holds exactly as intended: the gate is now final, row 1 is the ordinary `merge - squash-merge on ruleset bypass authority; CI evidence stands` with no separate bypass row, merge is recommended for the own PR with approve kept out of the menu and stop last, the Evidence line carries `merge_state_status BLOCKED (bypass eligible; reviewDecision REVIEW_REQUIRED)`, and the exact-head CI evidence (test success on abc1234, run 701) survives without the old `merge waits` PR-comments line or `Not offered: merge`. f5 is preserved: no merge is performed, no extra approval is demanded, and the text names no blocking rule, admin identity, or live non-admin proof — `ruleset bypass authority` is the mandated generic phrasing, not a named rule. Two small wording notes that did not move any fact: the Evidence phrasing drifted from `0 binding pending checks` to `binding-pending count 0`, and the trailing `Not offered: approve (own PR).` line is acceptable but, if the shared menus.md template already drops approve silently for own PRs, consider omitting that line so the final report stays minimal and does not read as hinting at an approval requirement.

exit: 0
