# eval report: ship (partial run: choices-list-legs)

for: b6026ea470363ca36abd0a443a4201ae30f6a1b6284077932b9fffe0ddb3dc55

wall: 27s

## Change

On a retry with a validated receipt and no companion worktree, read the companion's feature range from its primary using the attempted feature SHA. The choices-list-legs replay checks that range selection, the stand-in in the shared menu and its attribution in the PR Summary preview. The deterministic recipe test covers an unreadable range; neither check edits a live PR.

The existing coordinated finish instructions now hold the decision list rendering rule for all ship menus. The rule keeps its meaning. Replay choices-list to check how the model explains choices and prints every disclosure when the stand-ins alone exceed the word limit.

Check stand-in disclosures in proposed PR bodies. The choices-list-legs sample compares the shared menu to each repository's Summary. The stand-in-linked-and-rework-body sample follows one disclosure into an existing draft and a reworked PR. These are text replays, not live PR edits.

Use choices-list to check that the menu explains choices without internal identifiers and keeps every stand-in disclosure, even past the word limit. Check the proposed Summary bullets in the same replay.

Use digest-from-record-lines to check the single list above the menu. Read a branch's commit bodies oldest first, explain applied corrections alongside choices and keep repeated choices separate. The sample replays supplied records, not a live delivery.

The shared instructions continue past a spent allowance while the last round moved. The loop, waves and resume samples cover that behavior; no sample of this target was rerun.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| choices-list-legs | anthropic/claude-opus-5-5 | improved | 6162 | receipt-range: fails -> holds (intended change); home-list: fails -> holds (intended change); bodies: fails -> holds (intended change) |
| choices-list-legs | github-copilot/gpt-6.1-sol | improved | 9635 | receipt-range: fails -> holds (intended change); home-list: fails -> holds (intended change); bodies: fails -> holds (intended change) |

## Feedback

- choices-list-legs / anthropic/claude-opus-5-5: All three facts moved from fails to holds as intended, and Before held none, so nothing was lost. The After wording added --reverse to the printer log at /work/printer over trunk..1111111111111111111111111111111111111111 and explicitly rejected trunk..HEAD, which satisfies receipt-range; Before omitted --reverse. After shows a single three-entry list above the menu (till choice with reason, printer choice with reason, then the stand-in naming the missing paper receipt, the typed replacement and the lack of proof on the intended data), where Before treated the lines as non-matching audit rows and omitted the list. After's printer Summary preview repeats the disclosure word for word in the existing open PR and the till preview has none, where Before produced no Summary bullet. To keep these results stable, keep the wording that requires --reverse and the attempted-head SHA from the primary, that the stand-in sentence be copied verbatim from the menu into only the owning repository's Summary, and that the existing PR is reconciled rather than re-created. One soft spot: the list does not label which repository each entry comes from, and the menu itself is described rather than printed; if attribution in the shared list or the rendered menu matters, state it explicitly in the wording.
- choices-list-legs / github-copilot/gpt-6.1-sol: All three facts moved from fails to holds, and Before held none of them, so nothing was lost. For receipt-range, After added `--reverse` to the log in `/work/printer` over `trunk..1111111111111111111111111111111111111111` with `--format=%b`; Before had the right range and path but no oldest-first ordering. For home-list, After printed one three-entry list above the options: the till's choice and reason first, then the printer's choice and reason, then its stand-in naming the missing paper receipt, the typed replacement and the lack of proof on the intended data. Before showed no list at all, because it treated the body lines as incomplete amendment rows. For bodies, After repeated the menu's disclosure word for word under the printer's existing PR and gave the till no stand-in bullet; Before paraphrased it into a shorter 'Stand-in:' bullet that dropped the not-proven clause and had no menu line to match. To keep these gains, keep the wording explicit on four points: the range is read from the companion primary at the attempted head with `--reverse`, never `HEAD`; plain three-field choice and stand-in lines qualify for the list; home entries come first; and the Summary bullet is copied verbatim from the menu disclosure into the owning repository's existing PR only.

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
