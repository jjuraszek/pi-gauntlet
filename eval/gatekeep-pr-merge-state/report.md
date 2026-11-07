# eval report: gatekeep-pr-merge-state (partial run: bypass-eligible-green-ci, bypass-eligible-check-pending)

for: 0429b58b0a5861a1e310dfa2de3d5107f0db1d782031fb1e46256da021c1aceb

wall: 12s

refresh: complete; sample: bypass-eligible-check-pending; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](results/bypass-eligible-check-pending/candidate.json)

## Change

Replace per-action repair authority and ordinary wait menus with persistent assess/deliver/deliver-nits courses and the shared menus.md templates. Preserve identity validation, independent claim/mechanism closure, exact-head evidence and terminal cleanup ownership. Source rounds count new repair-wave commits; body-only work and conflict-only syncs have independent accounting. Caps freeze at twice the entry setting, timeout renews only on own push or explicit obstacle continuation, and resumed sync preserves separate restore and lease heads.

Offer the ordinary merge row for BLOCKED only with fresh viewer-relative bypass eligibility and every other prerequisite satisfied. Render `merge - <policy>-merge on ruleset bypass authority; CI evidence stands` and `merge_state_status BLOCKED (bypass eligible; reviewDecision <value>)` on the Evidence line and preserve own/other-author recommendation defaults. Keep UNKNOWN/check_run/status_context classification unchanged, and fail closed on false or unreadable eligibility. Course-unset pending reports use initial without an unauthorized watch; bound CI obstacles and eligible delivery paths use the shared templates. Rename neither sample directories nor stable fact IDs.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bypass-eligible-green-ci | anthropic/claude-opus-5-5 | improved | 12235 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: holds -> holds (held) |
| bypass-eligible-green-ci | github-copilot/gpt-6.1-sol | improved | 14351 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: holds -> holds (held) |
| bypass-eligible-check-pending | anthropic/claude-opus-5-5 | unchanged | 11922 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held) |
| bypass-eligible-check-pending | github-copilot/gpt-6.1-sol | improved | 11954 | f1: fails -> holds (unplanned improvement); f2: fails -> holds (unplanned improvement); f3: fails -> holds (unplanned improvement); f4: holds -> holds (held); f5: fails -> holds (unplanned improvement) |

## Feedback

- bypass-eligible-check-pending / anthropic/claude-opus-5-5: No fact moved on this sample: both outputs render the initial template with course unset, name e2e pending in the verdict, omit the merge row with `Not offered: merge (e2e pending)`, make no bypass claim, offer assess/deliver/stop with deliver recommended, and perform no watch or merge before a numeric pick. After's only material edits are dropping the head SHA and the `rebase on main if needed` clause from the deliver row and adding `on the assessed head` to the verdict, all of which stay within the facts. If you want the After wording to remain robust across the wider change, keep the deliver row explicit that the watch binds to the assessed head (e.g. `watch e2e on the assessed head until it settles`) so the exact-head evidence ownership from the Change stays visible even when the SHA is not repeated, and continue to keep bypass eligibility out of the pending-check initial render as both versions do.
- bypass-eligible-check-pending / github-copilot/gpt-6.1-sol: After moves f1, f2, f3, and f5 from fails to holds while keeping f4: it renders the initial template (gate=gatekeep-pr/initial) instead of Before's BLOCKED obstacle template, names e2e pending in the verdict without a separate Evidence: line, prints `Not offered: merge (e2e pending)` rather than `blocked by GitHub`, keeps the `show evidence` hint, recommends deliver for the author's own PR, and makes no bypass claim anywhere despite bypass_eligible true. The only thing to watch is the deliver row's wording ('rebase on main, watch CI') — it currently reads as a description of what the course will do after numeric selection, which is fine; keep it phrased that way (e.g. 'set course to deliver: sync on main and watch CI until merge is offered') so it cannot be read as a watch performed before the pick, and keep the `(e2e pending)` reason and the absence of any bypass annotation on pending-check initial reports so f3 and f4 continue to hold.

exit: 0

## Selected runs

Coverage is limited to the two named bypass samples on the final assembly, not the whole target. The green-ci cells above retain the final-assembly replay committed in 5197376; that sample was not rerun. Only the pending sample's judgments were refreshed after clarifying f1's initial-template rendering. Pending e2e still binds on the assessed head; no skill or intent changed. All saved primary replies and both baseline records remain unchanged. The wall time above covers only this refresh.

Retained green-ci replay:

```text
node eval/run.mjs gatekeep-pr-merge-state bypass-eligible-green-ci
gatekeep-pr-merge-state: improved (report.md written; replay 2, judge 2, confirm 0, wall 27s)
```

Judgment-only refresh:

```text
node eval/run.mjs gatekeep-pr-merge-state bypass-eligible-check-pending --refresh-judgments
gatekeep-pr-merge-state: unchanged (report.md written; refresh bypass-eligible-check-pending [anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol]; replay 0, judge 2, confirm 0, wall 12s)
```
