# eval report: gatekeep-pr-merge-state (partial run: bypass-eligible-green-ci, bypass-eligible-check-pending)

for: 0429b58b0a5861a1e310dfa2de3d5107f0db1d782031fb1e46256da021c1aceb

wall: 75s

## Change

Replace per-action repair authority and ordinary wait menus with persistent assess/deliver/deliver-nits courses and the shared menus.md templates. Preserve identity validation, independent claim/mechanism closure, exact-head evidence and terminal cleanup ownership. Source rounds count new repair-wave commits; body-only work and conflict-only syncs have independent accounting. Caps freeze at twice the entry setting, timeout renews only on own push or explicit obstacle continuation, and resumed sync preserves separate restore and lease heads.

Offer the ordinary merge row for BLOCKED only with fresh viewer-relative bypass eligibility and every other prerequisite satisfied. Render `merge - <policy>-merge on ruleset bypass authority; CI evidence stands` and `merge_state_status BLOCKED (bypass eligible; reviewDecision <value>)` on the Evidence line and preserve own/other-author recommendation defaults. Keep UNKNOWN/check_run/status_context classification unchanged, and fail closed on false or unreadable eligibility. Course-unset pending reports use initial without an unauthorized watch; bound CI obstacles and eligible delivery paths use the shared templates. Rename neither sample directories nor stable fact IDs.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bypass-eligible-green-ci | anthropic/claude-opus-5-5 | improved | 12235 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: holds -> holds (held) |
| bypass-eligible-green-ci | github-copilot/gpt-6.1-sol | improved | 14351 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: holds -> holds (held) |
| bypass-eligible-check-pending | anthropic/claude-opus-5-5 | unchanged | 11223 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held) |
| bypass-eligible-check-pending | github-copilot/gpt-6.1-sol | regressed | 12505 | f1: holds -> fails (regression); f2: fails -> holds (unplanned improvement); f3: fails -> holds (unplanned improvement); f4: holds -> holds (held); f5: fails -> holds (unplanned improvement) |

## Feedback

- bypass-eligible-green-ci / anthropic/claude-opus-5-5: After moved f1-f4 from fails to holds exactly as intended: the report is now rendered as final with the ordinary `merge - squash-merge on ruleset bypass authority; CI evidence stands` row recommended, approve is withheld as the author's own PR with stop last, the Evidence line carries `merge_state_status BLOCKED (bypass eligible; reviewDecision REVIEW_REQUIRED)` alongside the exact-head run 701 test success, and the old `merge waits` PR-comments line and `Not offered: merge` are gone. f5 held in both: neither output performs a merge, requests additional approval, cites a specific blocking rule, names an admin identity, or asserts live non-admin proof - 'ruleset bypass authority' names the authority basis without naming a rule, and 'bypass eligible' stays viewer-relative. Keep the current wording; the only caution is to keep the Evidence line's bypass clause phrased as eligibility rather than drifting toward 'admin merge' or a named ruleset, which would put f5 at risk.
- bypass-eligible-green-ci / github-copilot/gpt-6.1-sol: After delivers the Change cleanly: the report moves from the obstacle gate to final, row 1 is the exact ordinary `merge - squash-merge on ruleset bypass authority; CI evidence stands` wording with merge recommended for the author's own PR, approve is withheld via `Not offered: approve (own PR)`, stop sits last, the Evidence line carries `merge_state_status BLOCKED (bypass eligible; reviewDecision REVIEW_REQUIRED)`, and the exact-head CI record (run 701, test success on abc1234) survives without the Before `merge waits` PR-comments line or `Not offered: merge`. f5 is preserved on both sides: After performs no merge, demands no approval, and names neither a specific blocking rule, an admin identity, nor live non-admin proof - `ruleset bypass authority` is a generic authority label, not a rule name. No fact that Before kept was lost, so the wording needs no correction; if anything, keep the `(own PR)` reason on the withheld approve row and the generic `ruleset bypass authority` phrasing exactly as is so future edits do not drift into naming a rule or an admin actor.
- bypass-eligible-check-pending / anthropic/claude-opus-5-5: No fact moved on this sample: both outputs render the initial template with course unset, resolve the verdict to e2e pending on the assessed head, omit the merge row with the exact `Not offered: ... merge (e2e pending)` line, make no bypass or ruleset-authority claim anywhere, and offer assess/deliver/stop with deliver recommended and no watch, verification, or merge executed before a numeric pick. Two small regressions in precision worth noting for the After wording: the deliver row dropped the explicit head oid (`watch e2e on abc1234` became `watch e2e until it settles`), which weakens the exact-head evidence contract the Change says to preserve, and it also dropped `rebase on main if needed`, which hid the merge-base-sync authority that a numeric deliver grants. Keeping `deliver - watch e2e on abc1234, repair anything it turns up, rebase on main if needed, repeat until merge is offered` would retain the exact-head binding and sync authorization while still using the shared initial template; the added blank line after the gauntlet header is harmless but inconsistent with Before and should be checked against menus.md.
- bypass-eligible-check-pending / github-copilot/gpt-6.1-sol: After correctly switches to the initial template, drops the GitHub-blocked withhold in favor of `Not offered: merge (e2e pending)`, keeps bypass out of the rendering, and recommends deliver for the own PR with no pre-selection watch — but it lost the Evidence line entirely, so the pending resolution is no longer tied to the assessed head abc1234 (the Verdict only says 'verification evidence is pending'). Before carried `Evidence: pending (e2e binding; head abc1234)` and the Change paragraph says exact-head evidence is preserved, so the initial template in menus.md should still render an explicit `Evidence: pending (e2e binding; head <sha>)` line (and have `show evidence` echo it) rather than folding evidence into the Verdict; everything else in After can stay as is.

exit: 1

## Selected runs

Only the two named bypass samples were replayed on this assembly; this is not target-wide coverage.

```text
node eval/run.mjs gatekeep-pr-merge-state bypass-eligible-green-ci
gatekeep-pr-merge-state: improved (report.md written; replay 2, judge 2, confirm 0, wall 27s)
```

```text
node eval/run.mjs gatekeep-pr-merge-state bypass-eligible-check-pending
gatekeep-pr-merge-state: regressed (report.md written; replay 2, judge 3, confirm 1, wall 48s)
```
