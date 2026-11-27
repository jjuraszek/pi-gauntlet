# eval report: ship (partial run: digest-from-record-lines)

for: bb9750e7d2eef38a47117925f3284d138e2a96e38f1bca98c5c8e1f7042a4fb3

wall: 24s

## Change

Use digest-from-record-lines to check the single list above the menu. Read a branch's commit bodies oldest first, explain applied corrections alongside choices and keep repeated choices separate. The sample replays supplied records, not a live delivery.

The shared instructions continue past a spent allowance while the last round moved. The loop, waves and resume samples cover that behavior; no ship sample was rerun for it.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| digest-from-record-lines | anthropic/claude-opus-5-5 | improved | 10538 | source: fails -> holds (intended change); digest: fails -> holds (intended change); menu: holds -> holds (held) |
| digest-from-record-lines | github-copilot/gpt-6.1-sol | improved | 10044 | source: fails -> holds (intended change); digest: fails -> holds (intended change); menu: holds -> holds (held) |

## Feedback

- digest-from-record-lines / anthropic/claude-opus-5-5: The After wording moved both targeted facts and lost none. On source, After adds `--reverse` to the body-only `git -C "/workspace/app-tree" log main..HEAD --format=%b` read, so it is oldest first, whereas Before read newest first. On digest, After prints a single `What the run decided on its own (4):` list in oldest-first order, with the 43117-byte correction and its re-measurement reason, the one-hour expiry and its 3600-second evidence, and the two identical keep-the-old-cache-key choices as separate rows; the accepted scope row, the quoted line and the citation repair are left out, and both variants get no list. Before instead printed `Amendments auto-applied (2):` with no reasons and dropped the choices. The menu fact holds in both: the gate marker is first, the five ordinary options follow the list, and there is no recommended suffix, extra approval or automatic shipping. Two things to tighten: After appends a 'How the decision list was built' section and the variant notes after the menu, although the case says to stop at the menu, so the wording should say that any derivation notes and variant statements go before the menu or are left out, in case a later fact checks that the menu is last. After also paraphrased the evidence cell as 'a fixture run measured 3600 seconds' rather than 'fixture measured 3600 seconds'; if reasons are meant to be verbatim, say so.
- digest-from-record-lines / github-copilot/gpt-6.1-sol: After moved `source` by adding `--reverse` to the body-only `git -C /workspace/app-tree log main..HEAD --format=%b` command, so the bodies are read oldest first with no subject filter; Before read them newest first. After moved `digest` by replacing the `Amendments auto-applied (2):` list (two entries, newest first, no reasons, no choices) with a single `What the run decided on its own (4):` list that gives the 43117-byte correction, the one-hour cache expiry and the two separate keep-the-old-cache-key choices in oldest-first order, each with its reason, while leaving out the accepted row and the repair and printing no list for either variant. `menu` held in both: the gate marker comes first and the five ordinary options follow the list with no recommended suffix, extra approval or automatic shipping. To keep all three, keep the wording that says to read bodies only, oldest first, emit one entry per body record even when two are identical, and include only granted or auto-applied corrections and choices. Two things in After are not covered by any fact but could be pinned down: it adds `Closure / conformance: CONFORMS` and `whole-diff minors: none` lines above the list, and it places the variant statements between the command and the user-visible text. If the status lines are unintended, say explicitly whether they belong above the menu when no gaps remain; and say that the decision list sits directly above `Implementation complete.` so nothing drifts between the list and the menu.

exit: 0

---

# eval report: ship (earlier partial run: pr-body-integration)

for: 84d61c63f50c04d8174332f540e50a0986f96253526150f694c4d76309bd1b36

wall: 13s

refresh: complete; sample: pr-body-integration; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](results/pr-body-integration/candidate.json)

## Change

Recover ledger returns without writing the task list. On a ship brief restore, show the allowance from disk before continuing verification. Read current ledger pending recovery from restore-loop.md before verification or stripping, and read coordinated recovery rules only for multi-leg delivery. Preserve once-only admission from ledger-held home attribution or a companion return file, consumed iterations, allowance accounting, rejected-boundary recovery and the stop on an unavailable before-image. Preserve post-strip verification ownership and receipt-validated recovery after the owner split. The selected ledger-pending-return fixture uses allowance: and returned: rather than an old cap header or commit-body decoder. Selected text replays inspect supplied recovery and delivery observations; they do not prove live Git or tracker execution. Coverage is sample-scoped, not a target-wide pass.

For a deferred spec, print the numbered gauntlet command before starting delivery so the user can open the PR in a fresh session.

Carry the spec's Integration section into a new PR and reconcile only that block on an existing PR. Keep the offer independent of its entries. The pr-body-integration replay checks the menu, rendered bodies and create command, not live publication. Write the body as data in a scratch file so a literal EOF line survives publication; pass the path to the command. The spec-gate/option-6-handoff replay checks the same transport for draft publication. Apply the shared Integration body rule to an isolated copy failure: report the unsynchronized block and its source once without claiming success, then continue readiness, push reporting or companion reconciliation. Keep push and mandatory Rework failures distinct. The spec-pr-integration-sync-failed replay loads the shared rule and checks the response through readiness after a supplied edit failure; it does not exercise live publication, push reporting or companion reconciliation.

Read the push procedure on identifying a rework subject, before preflight or the menu. The ordinary named-branch menu renders without reading it. The two selected replays check narrated reads, not a live file-read trace.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-integration | anthropic/claude-opus-5-5 | unchanged | 13297 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |
| pr-body-integration | github-copilot/gpt-6.1-sol | unchanged | 12014 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-integration / anthropic/claude-opus-5-5: Before and After are identical on this case, so the After wording moved no fact: create and update already hold in Before rather than moving from fails to holds as expected. Both show the five-option menu in order with no Integration question, both carry the Integration block verbatim once after Test Plan with the indented instruction and the literal EOF and End of receipt lines and no checked claims, and both replace only the stale Integration block in the draft while keeping the intro spacing and Notes. The one judgement call is the title: both outputs read it from an unminted `.title` sibling of the body file via `$(cat ...)` into a quoted variable. I counted that as one literal --title argument kept outside shell source, but the rendered command never shows the subject and the sibling path is invented rather than printed by the mint. To make create robust, the wording could say where the landed subject is written (its own minted scratch file, or an explicitly named sibling) and that the create call reads it from there as a single quoted argument, while keeping the current rules: body as data in the minted file, the same printed path passed via --body-file, an explicit cd into the observed worktree, and no reliance on variables from earlier calls.
- pr-body-integration / github-copilot/gpt-6.1-sol: Before and After are identical for this case, so no fact moved: the expected fails -> holds on create and update does not show, because Before already satisfies both. In both outputs the offer is the plain five-option named-branch menu with no mention of Integration. The new PR body carries Summary, Test Plan, then the Integration section verbatim once, including the indented instruction and the literal EOF and End of receipt lines, with no claim that any condition was checked. The existing draft has only its stale Integration block replaced, with the opening line's double spaces, the Notes section and the order intact, and no screenshot entry or Rework block. The create command runs in a subshell that cds into '/work/import queue', passes the minted path as one quoted --body-file argument, and passes the title as one quoted variable expansion read from a file, so the backticks and $(import) never appear in shell source and nothing depends on earlier calls. One thing to tighten: the title comes from an invented `pr-body.B72pL3.title` sidecar that the scratch-file mint never printed. If the After wording is meant to deliver this transport, state explicitly where the landed subject is stored (a separately minted file, or a named sidecar of the body file) so the output stops improvising that path; keep the wording that the body and title are written as data and only paths appear in the command, since that is what holds create in both outputs.

exit: 0
