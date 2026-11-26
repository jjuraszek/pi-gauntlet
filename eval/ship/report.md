# eval report: ship (partial run: pr-body-integration)

for: 7ebcf0ef9a82a98e5ef879e0062d7f249acab95738f8b56d22877668b4065adf

wall: 32s

## Change

Read current ledger pending recovery from restore-loop.md before verification or stripping, and read coordinated recovery rules only for multi-leg delivery. Preserve once-only admission from ledger-held home attribution or a companion return file, consumed iterations, allowance accounting, rejected-boundary recovery and the stop on an unavailable before-image. Preserve post-strip verification ownership and receipt-validated recovery after the owner split. The selected ledger-pending-return fixture uses allowance: and returned: rather than an old cap header or commit-body decoder. Selected text replays inspect supplied recovery and delivery observations; they do not prove live Git or tracker execution. Coverage is sample-scoped, not a target-wide pass.

For a deferred spec, print the numbered gauntlet command before starting delivery so the user can open the PR in a fresh session.

Carry the spec's Integration section into a new PR and reconcile only that block on an existing PR. Keep the offer independent of its entries. The pr-body-integration replay checks the menu, rendered bodies and create command, not live publication. Write the body as data in a scratch file so a literal EOF line survives publication; pass the path to the command. The spec-gate/option-6-handoff replay checks the same transport for draft publication. Apply the shared Integration body rule to an isolated copy failure: report the unsynchronized block and its source once without claiming success, then continue readiness, push reporting or companion reconciliation. Keep push and mandatory Rework failures distinct. The spec-pr-integration-sync-failed replay loads the shared rule and checks the response through readiness after a supplied edit failure; it does not exercise live publication, push reporting or companion reconciliation.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-integration | anthropic/claude-opus-5-5 | unchanged | 5441 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |
| pr-body-integration | github-copilot/gpt-6.1-sol | improved | 13634 | offer: holds -> holds (held); create: fails -> holds (intended change); update: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-integration / anthropic/claude-opus-5-5: Neither output differs on any fact: both show the five-option named-branch menu in order with no Integration question or item, both carry the spec's Integration section verbatim once after Test Plan (all six entries, the indented instruction, the literal EOF and End of receipt lines) with no claim that any condition was checked, and both replace only the stale Integration block in the existing draft while keeping the double-spaced lead line, the Notes section and their order, with no screenshot entry or Rework block. So the expected fails -> holds moves on create and update are not visible in this pair; Before already satisfied them. The After wording is slightly clearer on transport: it states the body was written with the file writer to a mktemp scratch file and passed by --body-file, which makes 'written as data, outside shell source' explicit, whereas Before only implied it in a shell comment. Keep that explicit statement of the file writer plus scratch path, keep the rule that the offer is independent of Integration entries, and keep the instruction to reconcile only the Integration block on an existing body; those are the phrases holding all three facts.
- pr-body-integration / github-copilot/gpt-6.1-sol: Offer and update are identical in both outputs: the five-option named-branch menu appears in order with no Integration question or item, and the draft body swaps only the stale Integration block for the spec's full current block once, dropping the screenshot entry and leaving the lead line's double spacing, the Notes section and order untouched, with no Rework block. The only fact that moved is create: both outputs render the same correct body (Summary, Test Plan, then the Integration section verbatim once with the indented instruction and literal EOF and End of receipt lines, no claim that any condition was checked), but Before passed it with `--body-file -` and a quoted heredoc, so the body sat inside shell source and no scratch file was used, whereas After passes `--body-file "$BODY"` and states that the scratch file was populated by the file writer. To keep this, retain the wording that the body is written as data to a scratch file and the path is passed to the command; consider also having the closing sentence state explicitly that the body text never appears in shell source, and keep the title as data too (After uses `$LANDED_SUBJECT` rather than an inline string, which is fine). Nothing Before kept was lost in After.

exit: 0
