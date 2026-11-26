# eval report: ship (partial run: pr-body-integration)

for: 7ebcf0ef9a82a98e5ef879e0062d7f249acab95738f8b56d22877668b4065adf

wall: 26s

## Change

Read current ledger pending recovery from restore-loop.md before verification or stripping, and read coordinated recovery rules only for multi-leg delivery. Preserve once-only admission from ledger-held home attribution or a companion return file, consumed iterations, allowance accounting, rejected-boundary recovery and the stop on an unavailable before-image. Preserve post-strip verification ownership and receipt-validated recovery after the owner split. The selected ledger-pending-return fixture uses allowance: and returned: rather than an old cap header or commit-body decoder. Selected text replays inspect supplied recovery and delivery observations; they do not prove live Git or tracker execution. Coverage is sample-scoped, not a target-wide pass.

For a deferred spec, print the numbered gauntlet command before starting delivery so the user can open the PR in a fresh session.

Carry the spec's Integration section into a new PR and reconcile only that block on an existing PR. Keep the offer independent of its entries. The pr-body-integration replay checks the menu, rendered bodies and create command, not live publication. Write the body as data in a scratch file so a literal EOF line survives publication; pass the path to the command. The spec-gate/option-6-handoff replay checks the same transport for draft publication. Apply the shared Integration body rule to an isolated copy failure: report the unsynchronized block and its source once without claiming success, then continue readiness, push reporting or companion reconciliation. Keep push and mandatory Rework failures distinct. The spec-pr-integration-sync-failed replay loads the shared rule and checks the response through readiness after a supplied edit failure; it does not exercise live publication, push reporting or companion reconciliation.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-integration | anthropic/claude-opus-5-5 | unchanged | 9373 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |
| pr-body-integration | github-copilot/gpt-6.1-sol | unchanged | 10967 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-integration / anthropic/claude-opus-5-5: No fact moved between Before and After: all three hold in both outputs, so the expected fails -> holds movement for create and update does not show in this sample, because Before already met them. Both outputs give the five-item named-branch menu in order with no Integration question or item. Both carry the Integration section verbatim once after Test Plan, including the indented instruction and the literal EOF and End of receipt lines, with no claim that any condition was checked. Both pass the literal minted path `/work/import queue/.git/gauntlet/tmp/pr-body.B72pL3` as one quoted `--body-file` argument, with the body written by a separate call. Both replace only the stale Integration block in the existing draft, keeping the double-spaced first line and the Notes section. The After differences are cosmetic: single quotes instead of double around the path, the `whole-diff minors: none` line dropped from the offer, and a shorter transport sentence. To keep these facts stable, keep the wording that requires the literal minted path in both the writer and the create call (not a shell variable from the mint), the body written as file data rather than a heredoc, and reconciliation limited to the Integration block. Consider having the transport sentence restate the path explicitly, as Before did, so the same-path claim is visible in the prose as well as the command.
- pr-body-integration / github-copilot/gpt-6.1-sol: No fact moved: both outputs show the same five-option menu with no Integration question, the same new PR body with the Integration section verbatim once after Test Plan (indented instruction and literal EOF / End of receipt lines intact, no checked claims), and the same draft body with only the stale Integration block replaced and the surrounding text, double spacing and Notes section untouched. Because Before already satisfies create and update on this sample, the expected fails -> holds movement is not visible here. The only difference is the create command: After keeps the minted path as one single-quoted literal --body-file argument, which still satisfies the fact, but it now shows "$WORKTREE" and "$LANDED_SUBJECT" where Before showed the concrete directory and title. Those variables do not come from the mint, so the fact holds, but in a separate call they read as dependence on shell state and put the margin at risk. To keep it safe, have the wording require the rendered create command to use concrete literal values (or state that the title and directory are resolved in the same call), and keep the explicit sentence that the writer and the create call use the same printed path with the body written as file data rather than a heredoc or shell variable.

exit: 0
