# eval report: ship (partial run: pr-body-integration)

for: c069b66f0252220a22ca3cfffd233fcb7ee9766d9c87b95db6b05853797052e9

wall: 14s

## Change

Recover ledger returns without writing the task list. Read current ledger pending recovery from restore-loop.md before verification or stripping, and read coordinated recovery rules only for multi-leg delivery. Preserve once-only admission from ledger-held home attribution or a companion return file, consumed iterations, allowance accounting, rejected-boundary recovery and the stop on an unavailable before-image. Preserve post-strip verification ownership and receipt-validated recovery after the owner split. The selected ledger-pending-return fixture uses allowance: and returned: rather than an old cap header or commit-body decoder. Selected text replays inspect supplied recovery and delivery observations; they do not prove live Git or tracker execution. Coverage is sample-scoped, not a target-wide pass.

For a deferred spec, print the numbered gauntlet command before starting delivery so the user can open the PR in a fresh session.

Carry the spec's Integration section into a new PR and reconcile only that block on an existing PR. Keep the offer independent of its entries. The pr-body-integration replay checks the menu, rendered bodies and create command, not live publication. Write the body as data in a scratch file so a literal EOF line survives publication; pass the path to the command. The spec-gate/option-6-handoff replay checks the same transport for draft publication. Apply the shared Integration body rule to an isolated copy failure: report the unsynchronized block and its source once without claiming success, then continue readiness, push reporting or companion reconciliation. Keep push and mandatory Rework failures distinct. The spec-pr-integration-sync-failed replay loads the shared rule and checks the response through readiness after a supplied edit failure; it does not exercise live publication, push reporting or companion reconciliation.

Read the push procedure on identifying a rework subject, before preflight or the menu. The ordinary named-branch menu renders without reading it. The two selected replays check narrated reads, not a live file-read trace.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-integration | anthropic/claude-opus-5-5 | unchanged | 14009 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |
| pr-body-integration | github-copilot/gpt-6.1-sol | unchanged | 12614 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-integration / anthropic/claude-opus-5-5: Before and After are byte-identical for this case, so the wording change moved nothing here: the expected fails -> holds moves on create and update do not show up, because Before already satisfies both. The offer keeps the five-option menu in order with no Integration question. The new PR body carries the Integration block verbatim once after Test Plan, including the indented instruction and the EOF and End of receipt lines, and makes no claim that any condition was checked. The draft update swaps only the stale Integration block and leaves the lead line's spacing and the Notes section untouched. The create command runs in a subshell that cds into '/work/import queue', passes the minted path as one quoted --body-file argument, and uses no variables from earlier calls. The weakest point is the title: it is read from an invented `pr-body.B72pL3.title` sibling that the mint never printed, through `$(cat ...)` into a double-quoted variable. That does keep the backticks and `$(import)` out of shell source and passes them as one argument, so I counted it as holding, but a stricter reader could object to the un-minted path, and the output never shows the title text itself. To make this robust, have the wording say where the title data file comes from (a second mint, or a stated sibling rule) and require the output to state that the file holds the exact landed subject, while keeping the --body-file transport and the worktree-anchored, state-free create call as they are.
- pr-body-integration / github-copilot/gpt-6.1-sol: Before and After are byte-identical for this case, so the After wording moved nothing here: the expected fails -> holds moves for create and update do not appear because Before already satisfies both. In both outputs the menu is the plain five-option named-branch offer with no Integration question. The new PR body carries Summary, Test Plan and then the Integration block verbatim once, including the indented instruction and the literal EOF and End of receipt lines, with no claim that any condition was checked. The existing draft body has only its stale Integration block replaced, with the lead line's spacing and the Notes section untouched. The create command changes into '/work/import queue' in the same call, passes the minted path as one quoted --body-file argument, and passes the title as one quoted expansion read from a file, so neither title nor body text sits in shell source. The one fragile point is the title transport: it relies on an invented '.title' sidecar next to the minted path, which the case never says was minted or written, and a stricter reader could fail create on that. To keep every fact safely, have the wording name how the literal subject reaches --title (for example, a second minted scratch file whose writing is explicitly stated, read in the create call itself), while keeping the body-file-as-data rule and the offer's independence from Integration entries as they are.

exit: 0
