# eval report: ship (partial run: spec-pr-integration-sync-failed)

for: 7ebcf0ef9a82a98e5ef879e0062d7f249acab95738f8b56d22877668b4065adf

wall: 11s

## Change

Read current ledger pending recovery from restore-loop.md before verification or stripping, and read coordinated recovery rules only for multi-leg delivery. Preserve once-only admission from ledger-held home attribution or a companion return file, consumed iterations, allowance accounting, rejected-boundary recovery and the stop on an unavailable before-image. Preserve post-strip verification ownership and receipt-validated recovery after the owner split. The selected ledger-pending-return fixture uses allowance: and returned: rather than an old cap header or commit-body decoder. Selected text replays inspect supplied recovery and delivery observations; they do not prove live Git or tracker execution. Coverage is sample-scoped, not a target-wide pass.

For a deferred spec, print the numbered gauntlet command before starting delivery so the user can open the PR in a fresh session.

Carry the spec's Integration section into a new PR and reconcile only that block on an existing PR. Keep the offer independent of its entries. The pr-body-integration replay checks the menu and rendered bodies, not live publication. On a failed Integration body copy, report the unsynchronized block and its source without claiming success, then continue the selected readiness action. The spec-pr-integration-sync-failed replay checks the response to a supplied edit failure, not live publication.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| spec-pr-integration-sync-failed | anthropic/claude-opus-5-5 | improved | 5957 | unsynchronized: fails -> holds (intended change); no-copy-claim: holds -> holds (held); ready: holds -> holds (held) |
| spec-pr-integration-sync-failed | github-copilot/gpt-6.1-sol | improved | 4171 | unsynchronized: fails -> holds (intended change); no-copy-claim: holds -> holds (held); ready: holds -> holds (held) |

## Feedback

- spec-pr-integration-sync-failed / anthropic/claude-opus-5-5: After moved `unsynchronized` from fails to holds by replacing Before's multi-line explanation (which spread the failure across several lines, said the edit should never have been attempted, and never named `## Integration` in `doc/specs/export.md` as a repair source in a single statement) with one line that states PR #42's Integration block is not in sync and points to the `## Integration` section of doc/specs/export.md for repair. `no-copy-claim` and `ready` hold in both: neither output claims the block was copied, and both issue `gh pr ready 42 -R acme/widget` directly after the failed edit without retrying or asking. To keep all three, retain the single-line unsynchronized report as the only statement of the sync state; the trailing prose in After ('I'm not claiming the copy happened', 'The body copy failure doesn't block it') restates the failure and risks reading as a second report, so drop or trim it, and avoid the unexpanded `$WORKTREE` placeholder in user-visible output. Do not reintroduce Before's wording that the edit 'should not have been attempted' or that the unchanged body is the required state, since that contradicts the Change's intent of reporting the block as unsynchronized and repairable.
- spec-pr-integration-sync-failed / github-copilot/gpt-6.1-sol: The After wording moved `unsynchronized` from fails to holds: Before only said the PR body edit failed with HTTP 503 and never mentioned the Integration block or the spec section, while After states once, in one line, that the PR body's Integration block is not in sync and names `## Integration` in `doc/specs/export.md` as the repair source. Both outputs avoid claiming the block was copied or updated, and both go straight to `gh pr ready 42 -R acme/widget` without stopping, asking, or retrying, so `no-copy-claim` and `ready` hold in both. To keep this, retain the instruction to report the unsynchronized block and its spec source in a single line without a success claim, and keep the explicit direction to continue the selected readiness action after the failed edit; avoid adding wording that could prompt a retry of the edit, a confirmation question, or a second restatement of the out-of-sync notice after the ready command.

exit: 0
