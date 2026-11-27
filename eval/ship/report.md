# eval report: ship (partial run: pr-body-integration)

for: e595950727e209737ec58945ba1953ef387fa0e75d2acc9835d5eb5ce58d4a3d

wall: 30s

The `pr-body-integration` run predates the rebase onto main. No replay tested the merged instructions.

Saved rows for other samples predate the commit-body wording change and were not rerun.

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
| pr-body-integration | anthropic/claude-opus-5-5 | unchanged | 12599 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |
| pr-body-integration | github-copilot/gpt-6.1-sol | unchanged | 13547 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-integration / anthropic/claude-opus-5-5: No fact moved: the menu, both Markdown bodies and the create command are the same in Before and After, and only the closing explanation is reworded from bullets to prose. The expected fails -> holds moves for create and update do not show up on this case, because Before already places the Integration section verbatim once after Test Plan, including the indented instruction and the literal EOF and End of receipt lines, and already replaces only the stale Integration block in the draft while leaving the double-spaced lead line and the Notes section untouched. Both create commands cd into '/work/import queue' in a subshell, pass the minted path as one quoted --body-file argument and read the title from a file into a quoted variable within the same call, so neither relies on earlier shell state and the backticks and $(import) stay out of shell source. I read 'claims none were checked' as the body making no claim that any condition was checked, which both satisfy. One fragile point in both outputs is that the title travels through a '.title' sidecar path that the mint did not print; if the wording is meant to settle how the title is carried, say so explicitly (for example, mint or name that sidecar, or state that the title is read from a file within the create call) so the behaviour stays stable. Keep the current rules for the ordinary menu with no Integration question, the verbatim single copy of the section and the replace-only-the-block update as they are, since they already deliver every fact here.
- pr-body-integration / github-copilot/gpt-6.1-sol: No fact moved: After reproduces Before's menu, both bodies and the create command essentially verbatim, differing only in dropped labels, three-backtick instead of four-backtick fences, and a reworded closing sentence. The create and update facts you expected to go from fails to holds already held in Before, so this case shows no effect from the Change. The ordinary five-option menu appears in order with no Integration question. The new PR body carries the Integration section once after Test Plan, with the indented instruction and the literal EOF and End of receipt lines, and makes no claim that any condition was checked. The existing draft swaps only the stale Integration block, keeping the double-spaced intro line and the Notes section. The create command changes into '/work/import queue' in the same call, passes the minted path as one quoted --body-file argument, and passes the title as one quoted argument read from a file, so neither the backticks nor $(import) reaches shell source. One fragile point is present in both outputs: the title comes from a '.title' sidecar path that the mint never printed. If you want that pinned down, have the wording say where the landed subject is stored (for example a separately minted scratch file, or a stated sidecar convention) while keeping the same-call cd, the quoted --body-file path and the title kept out of shell source. The current wording on verbatim Integration copying and section-only replacement already holds these facts and needs no change.

## Earlier cells (not rerun)

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| choices-list-legs | anthropic/claude-opus-5-5 | improved | 6162 | receipt-range: fails -> holds (intended change); home-list: fails -> holds (intended change); bodies: fails -> holds (intended change) |
| choices-list-legs | github-copilot/gpt-6.1-sol | improved | 9635 | receipt-range: fails -> holds (intended change); home-list: fails -> holds (intended change); bodies: fails -> holds (intended change) |

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
