# eval report: ship (partial run: choices-list)

for: 16e11067ef8b87e9e6ba86c23bbdb607bce911daddc53404603cf0b8834c818d

wall: 34s

## Change

Use choices-list to check that the menu explains choices without internal identifiers and keeps every stand-in disclosure, even past the word limit. Check the proposed Summary bullets in the same replay.

Use digest-from-record-lines to check the single list above the menu. Read a branch's commit bodies oldest first, explain applied corrections alongside choices and keep repeated choices separate. The sample replays supplied records, not a live delivery.

The shared instructions continue past a spent allowance while the last round moved. The loop, waves and resume samples cover that behavior; no ship sample was rerun for it.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| choices-list | anthropic/claude-opus-5-5 | improved | 11720 | register: fails -> holds (intended change); disclosure: fails -> holds (intended change); overflow: fails -> holds (intended change) |
| choices-list | github-copilot/gpt-6.1-sol | improved | 14429 | register: fails -> holds (intended change); disclosure: fails -> holds (intended change); overflow: fails -> holds (intended change) |

## Feedback

- choices-list / anthropic/claude-opus-5-5: After moved all three facts, and Before held none, so nothing was lost. The new list reads every body record rather than only `granted` rows, which is what moved them: the heading plus four entries stays well under 180 words, uses plain words with no hash or row, task or finding identifier, and gives each stand-in its own line naming the missing Monday receipts, the three handwritten replacements and the lack of proof on the intended data. Those two lines repeat verbatim as Summary bullets, and the twenty-record snapshot prints all twenty in full with no count or merged line. Two soft spots remain. The /help/ entry describes the effect (the trailing-slash address now opens help) rather than saying that the way addresses are matched was changed; register holds on a fair reading, but wording such as "page addresses are now tidied before matching, because /help/ opened a missing page" would make it unambiguous. The receipts Summary bullet ("so a receipt can still be returned on the second day") turns the reason into a result and differs from the list wording; reusing the list sentence verbatim, as the stand-in bullets do, would keep the reason clear.
- choices-list / github-copilot/gpt-6.1-sol: Before kept none of the three facts, so After had nothing to lose and gained all three. Its list above the menu showed only the receipt amendment, with no reason, no /help/ choice, no stand-in lines and no twenty-line snapshot. After moved register by giving each choice with its reason in plain words and no hash, row, task or finding identifier, in well under 180 words. It moved disclosure by rendering each stand-in record as its own line (missing Monday receipts, three handwritten replacements, not proven on the intended data) and repeating both lines verbatim as Summary bullets. It moved overflow by printing all twenty stand-in lines in full, with no count or merged line, past the word cap. The weakest point is the /help/ entry, which describes the outcome ("now shows the help page") rather than the choice itself; I counted it as holding, but only just. To make register robust, have the wording require the decision to be stated as an action, for example "Changed how page addresses are matched so /help/ opens the help page; before, the trailing slash led to a missing page." Also keep the explicit rules that each stand-in record gets its own full line, is never deduplicated or summarised, is exempt from the word cap, and is copied verbatim into the Summary.

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
