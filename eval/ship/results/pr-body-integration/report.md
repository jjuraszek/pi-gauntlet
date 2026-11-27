# eval report: ship (partial run: pr-body-integration)

for: 813cc861a65985a581220da88936444e6b0e311b6c405524ebf7dbfa9b548a2e

wall: 28s

## Change

On a retry with a validated receipt and no companion worktree, read the companion's feature range from its primary using the attempted feature SHA. The choices-list-legs replay checks that range selection, the stand-in in the shared menu and its attribution in the PR Summary preview. The deterministic recipe test covers an unreadable range; neither check edits a live PR.

The existing coordinated finish instructions now hold the decision list rendering rule for all ship menus. The rule keeps its meaning. Replay choices-list to check how the model explains choices and prints every disclosure when the stand-ins alone exceed the word limit.

Check stand-in disclosures in proposed PR bodies. The choices-list-legs sample compares the shared menu to each repository's Summary. The stand-in-linked-and-rework-body sample follows one disclosure into an existing draft and a reworked PR. These are text replays, not live PR edits.

Use choices-list to check that the menu explains choices without internal identifiers and keeps every stand-in disclosure, even past the word limit. Check the proposed Summary bullets in the same replay.

Use digest-from-record-lines to check the single list above the menu. Read a branch's commit bodies oldest first, explain applied corrections alongside choices and keep repeated choices separate. The sample replays supplied records, not a live delivery.

The shared instructions continue past a spent allowance while the last round moved. The loop, waves and resume samples cover that behavior; no ship sample was rerun for it.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-integration | anthropic/claude-opus-5-5 | unchanged | 11358 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |
| pr-body-integration | github-copilot/gpt-6.1-sol | unchanged | 13436 | offer: holds -> holds (held); create: holds -> holds (intended but unchanged); update: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-integration / anthropic/claude-opus-5-5: No fact moved on this case: Before and After are the same in substance, and all three facts hold in both. The Expected to move list predicted create and update would go from fails to holds, but Before already satisfied them, so the new wording shows no effect here. Both outputs give the ordinary five-option menu in order with no Integration question. Both new PR bodies keep Summary and Test Plan, carry the Integration section verbatim once after Test Plan (indented instruction and the literal EOF and End of receipt lines included), and add no claim that any condition was checked. Both create commands cd into '/work/import queue', pass the minted path as one quoted --body-file argument, and read the title from a .title sibling file into a quoted variable, so the backticks and $(import) stay out of shell source. Both draft updates replace only the stale Integration block and leave the double-spaced lead line and the Notes section untouched. The only differences in After are cosmetic: three-backtick outer fences instead of four, and reworded labels and closing sentences. To keep these facts holding, preserve the wording that drives the verbatim single copy of Integration after Test Plan, the minted-path --body-file handoff with the title read from a file, and the section-only replacement in existing drafts. If you need this case to demonstrate the Change, give it an input where Before actually fails.
- pr-body-integration / github-copilot/gpt-6.1-sol: Nothing in After moved a fact: apart from added headings and a tense change in the closing sentence, After matches Before, and all three facts hold in both. The expected fails -> holds moves for create and update do not show here because Before already satisfied them. Both outputs give the five-option menu in order with no Integration question, carry the Integration section verbatim once after Test Plan with no claim that anything was checked, and replace only the stale Integration block in the draft while leaving the preamble spacing and Notes untouched. The create command changes into '/work/import queue', passes the minted path as one quoted --body-file argument, and reads the title from a file into a quoted variable, so the backticks and $(import) stay literal and outside shell source. The one fragile point in both is the invented sibling path `pr-body.B72pL3.title`, which the mint never printed. I counted it as holding because the title still arrives as one literal argument with no shell state carried over from earlier calls. To make this robust, the wording should say explicitly where the landed subject is stored (for example, a separately minted scratch file) and that the create call reads it from there. Keep the current rules on verbatim Integration copy, single replacement and same-path body file as they are.

exit: 0
