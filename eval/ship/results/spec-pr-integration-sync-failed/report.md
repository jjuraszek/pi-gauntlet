# eval report: ship (partial run: spec-pr-integration-sync-failed)

for: 7ebcf0ef9a82a98e5ef879e0062d7f249acab95738f8b56d22877668b4065adf

wall: 16s

## Change

Read current ledger pending recovery from restore-loop.md before verification or stripping, and read coordinated recovery rules only for multi-leg delivery. Preserve once-only admission from ledger-held home attribution or a companion return file, consumed iterations, allowance accounting, rejected-boundary recovery and the stop on an unavailable before-image. Preserve post-strip verification ownership and receipt-validated recovery after the owner split. The selected ledger-pending-return fixture uses allowance: and returned: rather than an old cap header or commit-body decoder. Selected text replays inspect supplied recovery and delivery observations; they do not prove live Git or tracker execution. Coverage is sample-scoped, not a target-wide pass.

For a deferred spec, print the numbered gauntlet command before starting delivery so the user can open the PR in a fresh session.

Carry the spec's Integration section into a new PR and reconcile only that block on an existing PR. Keep the offer independent of its entries. The pr-body-integration replay checks the menu and rendered bodies, not live publication. Apply the shared Integration body rule to an isolated copy failure: report the unsynchronized block and its source once without claiming success, then continue readiness, push reporting or companion reconciliation. Keep push and mandatory Rework failures distinct. The spec-pr-integration-sync-failed replay loads the shared rule and checks the response through readiness after a supplied edit failure; it does not exercise live publication, push reporting or companion reconciliation.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| spec-pr-integration-sync-failed | anthropic/claude-opus-5-5 | improved | 7418 | unsynchronized: fails -> holds (intended change); no-copy-claim: holds -> holds (held); ready: holds -> holds (held) |
| spec-pr-integration-sync-failed | github-copilot/gpt-6.1-sol | improved | 6674 | unsynchronized: fails -> holds (intended change); no-copy-claim: holds -> holds (held); ready: holds -> holds (held) |

## Feedback

- spec-pr-integration-sync-failed / anthropic/claude-opus-5-5: After moved `unsynchronized` by producing a single report line that says PR #42's Integration block is not in sync and names `doc/specs/export.md`, section `## Integration`, as the repair source. Before instead called the edit a misstep, said the body should stay unchanged, and only mentioned in the final message that the section 'was not synced', with the spec path on a separate line and no repair framing. Both outputs avoid claiming the copy landed, and both go straight to `gh pr ready 42 -R acme/widget` without retrying or asking, so nothing Before held was lost. The one risk in After is the follow-up prose ('I'm not claiming the Integration copy landed, and I'm keeping the checkout for repair'), which partly restates the unsynchronized state and could read as a second report. To keep 'once, in one line' robust, the wording should say the single report line is the only mention of the sync failure, and that later narration is limited to the push result and the readiness step.
- spec-pr-integration-sync-failed / github-copilot/gpt-6.1-sol: After moved `unsynchronized` from fails to holds: it now opens with a single line saying PR #42's Integration block is not in sync and pointing to `doc/specs/export.md` → `## Integration` as the repair source. Before only said it would not synchronize the section and never named the spec file or section as the source. Both outputs avoid any claim that the block was copied or updated, and both go straight to `gh pr ready 42 -R acme/widget` without retrying, asking or stopping, so nothing Before kept was lost. To keep this stable, keep the wording that requires exactly one line naming the unsynchronized block and its spec path and section, followed by continuing to readiness. Also consider stating that the closing summary may say the body is unchanged but must not restate the out-of-sync report, because After's trailing "existing PR body remains unchanged" comes close to a second report and could be read as a duplicate under the "once" requirement.

exit: 0
