# eval report: ship (partial run: normal-menu-skips-push-rules)

for: e8263e2b1f9ade31618e1f4d2129689e183b3dbc29781bbe82e37d661f7b295a

wall: 18s

## Change

Read current ledger pending recovery from restore-loop.md before verification or stripping, and read coordinated recovery rules only for multi-leg delivery. Preserve once-only admission from ledger-held home attribution or a companion return file, consumed iterations, allowance accounting, rejected-boundary recovery and the stop on an unavailable before-image. Preserve post-strip verification ownership and receipt-validated recovery after the owner split. The selected ledger-pending-return fixture uses allowance: and returned: rather than an old cap header or commit-body decoder. Selected text replays inspect supplied recovery and delivery observations; they do not prove live Git or tracker execution. Coverage is sample-scoped, not a target-wide pass.

For a deferred spec, print the numbered gauntlet command before starting delivery so the user can open the PR in a fresh session.

Carry the spec's Integration section into a new PR and reconcile only that block on an existing PR. Keep the offer independent of its entries. The pr-body-integration replay checks the menu, rendered bodies and create command, not live publication. Write the body as data in a scratch file so a literal EOF line survives publication; pass the path to the command. The spec-gate/option-6-handoff replay checks the same transport for draft publication. Apply the shared Integration body rule to an isolated copy failure: report the unsynchronized block and its source once without claiming success, then continue readiness, push reporting or companion reconciliation. Keep push and mandatory Rework failures distinct. The spec-pr-integration-sync-failed replay loads the shared rule and checks the response through readiness after a supplied edit failure; it does not exercise live publication, push reporting or companion reconciliation.

Read the push procedure on identifying a rework subject, before preflight or the menu. The ordinary named-branch menu renders without reading it. The two selected replays check narrated reads, not a live file-read trace.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| normal-menu-skips-push-rules | anthropic/claude-opus-5-5 | unchanged | 5409 | menu: holds -> holds (held); reads: holds -> holds (held) |
| normal-menu-skips-push-rules | github-copilot/gpt-6.1-sol | unchanged | 4338 | menu: holds -> holds (held); reads: holds -> holds (held) |

## Feedback

- normal-menu-skips-push-rules / anthropic/claude-opus-5-5: Neither fact moved. Both outputs render the Step 4 gate marker and the five ordinary choices in the same order (PR, draft PR, squash to main, keep, discard), and both traces reach the menu without reporting a missing rule or reading the rework push procedure. After actually states the intended behavior more explicitly than Before: its Step 1 rework check names `pr-branch-push.md` as not needed because the spec has no `## Rework record`, which matches the Change's rule that the push procedure is read only on identifying a rework subject. One difference worth noting: After reads `spec-pr.md` at Input to check the header, whereas Before skipped it because no `**PR:**` or deferred header was present; this does not affect either fact, but if you want the ordinary path to stay minimal, word the Input step so `spec-pr.md` is read only once a `**PR:**` or `**Engine:** deferred` header is found. Keep the explicit conditional on the rework record ahead of preflight and the menu so the ordinary named-branch menu continues to render without the push procedure.
- normal-menu-skips-push-rules / github-copilot/gpt-6.1-sol: Neither fact moved: both outputs render the Step 4 gate line, the CONFORMS closure, and the five ordinary choices in the required order (PR, draft PR, squash to main, keep, discard), and both traces reach the menu via menu-layout.md, the amendment digest and the named-branch menu procedure without reporting a missing rule or reading the rework push procedure. The After wording's instruction to read the push procedure only on identifying a rework subject is working as intended for this ordinary case; the After trace even notes that the PR route does not apply. To keep it that way, retain the explicit condition that the push procedure is read only once a rework subject (PR header or Rework record) is identified, and keep the statement that the ordinary named-branch menu renders without reading it, so the model does not preemptively load it or flag it as missing.

exit: 0
