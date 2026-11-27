# eval report: ship (partial run: choices-list)

for: c89645944a67d9ec59bc4faea552722379a5ec8413464297f1473cee0457f579

wall: 31s

## Change

The existing coordinated finish instructions now hold the decision list rendering rule for all ship menus. The rule keeps its meaning. Replay choices-list to check how the model explains choices and prints every disclosure when the stand-ins alone exceed the word limit.

Check stand-in disclosures in proposed PR bodies. The choices-list-legs sample compares the shared menu to each repository's Summary. The stand-in-linked-and-rework-body sample follows one disclosure into an existing draft and a reworked PR. These are text replays, not live PR edits.

Use choices-list to check that the menu explains choices without internal identifiers and keeps every stand-in disclosure, even past the word limit. Check the proposed Summary bullets in the same replay.

Use digest-from-record-lines to check the single list above the menu. Read a branch's commit bodies oldest first, explain applied corrections alongside choices and keep repeated choices separate. The sample replays supplied records, not a live delivery.

The shared instructions continue past a spent allowance while the last round moved. The loop, waves and resume samples cover that behavior; no sample of this target was rerun.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| choices-list | anthropic/claude-opus-5-5 | improved | 12793 | register: fails -> holds (intended change); disclosure: fails -> holds (intended change); overflow: fails -> holds (intended change) |
| choices-list | github-copilot/gpt-6.1-sol | improved | 11242 | register: fails -> holds (intended change); disclosure: fails -> holds (intended change); overflow: fails -> holds (intended change) |

## Feedback

- choices-list / anthropic/claude-opus-5-5: Before held none of the three facts, so After loses nothing and moves all three to holds. Before's list showed only the granted receipt amendment with no reason, omitted the routing choice and both stand-ins from the menu and the Summary, and dropped the list entirely in the twenty-stand-in snapshot. After's four-entry list is well under 180 words, uses everyday words with no hash, row, task or finding identifier, and gives each choice with its reason. It prints both Monday stand-in disclosures as separate lines naming the missing receipts, the three handwritten replacements and the lack of proof on the intended data, and repeats them verbatim as Summary bullets. In the independent snapshot it prints all twenty disclosures in full past the word limit, with the "(20)" in the heading adding to the lines rather than replacing any. The one soft spot is the routing entry, which describes the outcome (the help address with a trailing slash now opens help) rather than the choice itself, and so only implies that address matching changed. To make register robust, have the rule require each choice line to state what was changed and why, for example "Page addresses are now tidied before they are matched, because the help address with a slash at the end opened a missing page". Keep the existing wording that stand-in lines are exempt from the word cap, never merged or counted, and copied verbatim into the Summary.
- choices-list / github-copilot/gpt-6.1-sol: Before kept none of the three facts, so After has nothing to preserve and all three moved from fails to holds. Before's only list was an 'Amendments auto-applied (1)' line for the receipt lifetime, with no reason, no path choice, no stand-in lines in the menu or the Summary, and no independent snapshot list at all. After's single list above the menu, 'What the run decided on its own (4)', is about 90 words. It explains the /help/ choice and the two-day receipt choice with their reasons in everyday words, with no hash or row, task or finding identifier. It prints the two Monday stand-in lines separately, each naming the missing receipts, the three handwritten replacements and the lack of proof, and repeats both verbatim as Summary bullets. The independent snapshot prints all twenty stand-in lines in full, well past 180 words, with the count only in the heading and no combined line. To keep this stable, keep the wording that says each stand-in record gets its own full line that is exempt from the word cap and is copied verbatim into the Summary. Two soft spots are worth tightening. 'Not proven on the data the ticket meant' is slightly oblique, so the rule could ask for the intended data to be named plainly, for example 'not proven on Monday's real receipts'. The path entry describes only help links rather than how page addresses are matched in general, so the rule could ask for the general change to be stated alongside the example.

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
