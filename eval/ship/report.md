# eval report: ship (partial run: choices-list-legs, stand-in-linked-and-rework-body)

for: 464dfb5f73dfbec12700f530f85064f04e0a488461114868d92c64f0d71681c3

wall by sample: choices-list-legs: 23s, stand-in-linked-and-rework-body: 22s

## Change

Check stand-in disclosures in proposed PR bodies. The choices-list-legs sample compares the shared menu to each repository's Summary. The stand-in-linked-and-rework-body sample follows one disclosure into an existing draft and a reworked PR. These are text replays, not live PR edits.

Use choices-list to check that the menu explains choices without internal identifiers and keeps every stand-in disclosure, even past the word limit. Check the proposed Summary bullets in the same replay.

Use digest-from-record-lines to check the single list above the menu. Read a branch's commit bodies oldest first, explain applied corrections alongside choices and keep repeated choices separate. The sample replays supplied records, not a live delivery.

The shared instructions continue past a spent allowance while the last round moved. The loop, waves and resume samples cover that behavior; no sample of this target was rerun.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| choices-list-legs | anthropic/claude-opus-5-5 | improved | 8904 | home-list: fails -> holds (intended change); bodies: fails -> holds (intended change) |
| choices-list-legs | github-copilot/gpt-6.1-sol | improved | 5852 | home-list: fails -> holds (intended change); bodies: fails -> holds (intended change) |
| stand-in-linked-and-rework-body | anthropic/claude-opus-5-5 | improved | 7965 | sole-entry: fails -> holds (intended change); linked: fails -> holds (intended change); rework: fails -> holds (intended change) |
| stand-in-linked-and-rework-body | github-copilot/gpt-6.1-sol | improved | 6189 | sole-entry: fails -> holds (intended change); linked: fails -> holds (intended change); rework: fails -> holds (intended change) |

## Feedback

- choices-list-legs / anthropic/claude-opus-5-5: After moved home-list by adding a single three-entry list above the menu: the till stand-in comes first, then the printer's shop-name choice with its reason, then the printer's paper-receipt stand-in, and each stand-in line names the missing input, its replacement and the lack of proof on the intended data. Before showed no list at all, arguing that the records lacked amendment-audit fields. After moved bodies because each Summary now carries its own repository's disclosure sentence word for word from the home list and nothing from the other repository; Before only paraphrased the stand-ins and had no list to copy from. Before kept neither fact, so nothing regressed. Two points in After are still worth tightening. Each Summary opens with an unfilled placeholder bullet ("<what changed in the till, from its acceptance rows>"), so the wording should tell the model to write a concrete bullet from the material it has, or omit the bullet, rather than emit a template slot. The list header "What the run decided on its own" also sits awkwardly over stand-in disclosures, which are not decisions; a header that covers both choices and stand-ins would read better while still keeping the stand-in sentences copied verbatim into only the receiving repository's Summary.
- choices-list-legs / github-copilot/gpt-6.1-sol: After moved both facts in the intended direction: it emits a single pre-menu list of three entries in the right order (till stand-in, printer choice with reason, printer stand-in), each stand-in naming the missing input, its replacement and the lack of proof, and each Summary repeats only its own repository's disclosure word-for-word with no cross-leak; Before had no list at all and refused to draft either Summary. Two things to tighten so these facts stay held: After dropped the 'Implementation complete. What would you like to do?' line and the ordinary options that Before showed, so the list is only implicitly 'above the menu' - keep wording that requires the list to be placed directly above the ship prompt/options rather than replacing them; and the heading 'What the run decided on its own' sits oddly over stand-in disclosures, so consider wording that labels the list as covering both choices and stand-ins. Also keep the instruction that the Summary disclosure bullet be copied verbatim from the home list and restricted to the receiving repository's own feature range, since that is exactly what makes 'bodies' hold here.

- stand-in-linked-and-rework-body / anthropic/claude-opus-5-5: All three facts moved from fails to holds, and nothing Before satisfied was lost. In Before, the three-field stand-in line did not match the amendment pattern, so A rendered no list and the disclosure never reached the B or C bodies. In After, A shows a decisions heading with count one and a single plain-language line naming the missing Monday order sheet, the three handwritten orders and the lack of proof on the intended data. B carries that identical line as a Summary bullet in the same single edit that replaces the Integration instruction, with the original Summary bullet, the Notes text and the double spaces intact and no Rework block. C keeps `Keep  both  spaces.` unchanged and puts the same line inside the appended Rework block, with no separate Summary. To keep this stable, keep the wording explicit that a stand-in record counts as a decision even when it is the only entry, that the disclosure sentence is reused verbatim across the list, the Summary and the Rework block, and that on the linked route it rides in the same body edit as the Integration replacement. One loose end: in C the disclosure sits as a bare bullet between `Dropped claims:` and `Verification:`; a fixed position or label for it inside Rework would make the placement less likely to drift outside the block.
- stand-in-linked-and-rework-body / github-copilot/gpt-6.1-sol: All three facts moved from fails to holds, and nothing that Before kept was lost. In A, After renders the decisions heading with count one and a single line naming the missing Monday order sheet, the three handwritten orders and the lack of proof on the intended data, where Before refused to render any list. In B, After adds the disclosure line as a Summary bullet in the same single edit that replaces the Integration instruction with the printout text; the original Summary bullet, the Notes heading and the double-spaced 'Keep  both  spaces.' survive, and no Rework block appears. Before made only the Integration replacement. In C, After keeps the original description byte-for-byte and places the disclosure inside the appended Rework block, with no separate Summary. Before omitted it entirely. To keep these results stable, keep wording that says the disclosure must be shown even when it is the only entry, that it goes into the Summary within the same edit as the Integration sync on a linked draft, and that on rework it is placed only inside the Rework block. You might also specify where in the Rework block the line sits (it currently lands as a bare bullet between 'Dropped claims' and 'Verification' with no label), since an unlabelled bullet amid key-value lines could drift in position or be read as part of 'Dropped claims' in other runs.

exit by sample: choices-list-legs: 0, stand-in-linked-and-rework-body: 0

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
