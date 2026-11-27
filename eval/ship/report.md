# eval report: ship (partial run: pr-body-integration)

The ledger admission fixture `ledger-pending-return` now continues without a tracker call. This sample was not replayed; the results below cover `pr-body-integration` only.

for: e8263e2b1f9ade31618e1f4d2129689e183b3dbc29781bbe82e37d661f7b295a

wall: 29s

## Change

Read current ledger pending recovery from restore-loop.md before verification or stripping, and read coordinated recovery rules only for multi-leg delivery. Preserve once-only admission from ledger-held home attribution or a companion return file, consumed iterations, allowance accounting, rejected-boundary recovery and the stop on an unavailable before-image. Preserve post-strip verification ownership and receipt-validated recovery after the owner split. The selected ledger-pending-return fixture uses allowance: and returned: rather than an old cap header or commit-body decoder. Selected text replays inspect supplied recovery and delivery observations; they do not prove live Git or tracker execution. Coverage is sample-scoped, not a target-wide pass.

For a deferred spec, print the numbered gauntlet command before starting delivery so the user can open the PR in a fresh session.

Carry the spec's Integration section into a new PR and reconcile only that block on an existing PR. Keep the offer independent of its entries. The pr-body-integration replay checks the menu, rendered bodies and create command, not live publication. Write the body as data in a scratch file so a literal EOF line survives publication; pass the path to the command. The spec-gate/option-6-handoff replay checks the same transport for draft publication. Apply the shared Integration body rule to an isolated copy failure: report the unsynchronized block and its source once without claiming success, then continue readiness, push reporting or companion reconciliation. Keep push and mandatory Rework failures distinct. The spec-pr-integration-sync-failed replay loads the shared rule and checks the response through readiness after a supplied edit failure; it does not exercise live publication, push reporting or companion reconciliation.

Read the push procedure on identifying a rework subject, before preflight or the menu. The ordinary named-branch menu renders without reading it. The two selected replays check narrated reads, not a live file-read trace.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-integration | anthropic/claude-opus-5-5 | unchanged | 14250 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |
| pr-body-integration | github-copilot/gpt-6.1-sol | unchanged | 12236 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-integration / anthropic/claude-opus-5-5: No fact moved: the After output matches Before on the menu, both bodies and the create command, so the expected fails -> holds moves on create and update do not appear because Before already satisfied both facts. In both outputs the menu is the ordinary five-option list with no Integration question. In both, the new body carries the Integration block verbatim once after Test Plan, with the indented instruction and the literal EOF and End of receipt lines, and adds no claim that any condition was checked; I read the fact's 'claims none were checked' as that absence, and if it requires an explicit statement, create fails in both. The create command is self-contained in both: it changes into '/work/import queue', passes the minted path single-quoted to --body-file, and reads the title from a file into a quoted variable, so the backticks and $(import) never enter shell source. The draft update swaps only the stale Integration section and keeps the double-spaced intro line and the Notes section intact. To keep these facts stable, keep stating explicitly that the body is written as data to the minted path, that the same literal path is passed in a call that sets its own working directory, and that the title is supplied from data rather than inline. One loose end in both outputs is the '.title' sibling file, which the mint never printed; consider saying where the title file comes from (its own mint, or a fixed rule deriving it from the body path) so models do not improvise it.
- pr-body-integration / github-copilot/gpt-6.1-sol: No fact moved: the After menu, both Markdown bodies and the create command are identical to Before, and only the closing sentence was reworded. The expected fails -> holds moves on create and update do not show on this sample, because Before already places the complete Integration block once after Test Plan and already replaces only the stale block in the draft while keeping the intro spacing and the Notes section. In both outputs the offer is the plain five-option menu with no Integration item. In both, the create command changes into the quoted worktree, passes the minted path as one quoted --body-file argument, and reads the title from a file into a quoted expansion, so the backticks and $(import) stay out of shell source and nothing depends on earlier calls. The one fragile point, shared by both, is that the title travels through an invented `.title` sidecar next to the minted path rather than a path the mint printed. To keep create holding on other samples, the wording should say explicitly how the landed subject reaches the create call as data (for example, a file written by the writer call and read with a quoted expansion in the same create call), and keep the rules that the body file path is the exact minted path and that the create call sets its own working directory.

exit: 0
