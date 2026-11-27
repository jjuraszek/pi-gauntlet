# eval report: conformance-check (partial run: stalled-per-gap-trail)

for: 9bfad9d75c9bfd21e7922643af956515aadff6be8781055fa6e47c8cf223bfad

wall: 14s

The `stalled-per-gap-trail` run predates the rebase onto main. No replay tested the merged instructions.

## Integrated coverage

Only `stalled-per-gap-trail` was replayed. It excludes `ship.md` and `disposition-protocol.md`; it does not exercise a moving round or any caller. The other conformance samples were not rerun. This is not a target-wide pass.

## Change

Defer closure at the conformance cap to step 6. The stalled-per-gap-trail replay checks the stalled stop, not the moving grant or caller routing.

At a stalled conformance cap, report every gap's verdict in every round under `Problem:`. Keep the first-line gate marker, name the unblocking input under `Needs:` without a funding menu, and leave verification incomplete. The stalled-per-gap-trail sample covers only this response.

The shared ship menu lists applied corrections alongside recommendations. The ship replay covers this change; no conformance sample was rerun.

The shared instructions continue past a spent allowance while the last round moved. The loop, waves and resume samples cover that behavior; no sample of this target was rerun.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| stalled-per-gap-trail | anthropic/claude-opus-5-5 | improved | 6611 | per-gap-rounds: fails -> holds (intended change); needs-no-menu: fails -> holds (intended change); remains-incomplete: holds -> holds (held); gate-first: holds -> holds (held) |
| stalled-per-gap-trail | github-copilot/gpt-6.1-sol | improved | 7050 | per-gap-rounds: fails -> holds (intended change); needs-no-menu: fails -> holds (intended change); remains-incomplete: holds -> holds (held); gate-first: holds -> holds (held) |

## Feedback

- stalled-per-gap-trail / anthropic/claude-opus-5-5: After moved per-gap-rounds by adding an explicit `Problem:` label and listing each gap's R1 and R2 verdicts beneath it (G1 PARTIAL then MISSING; G2 MISSING then PARTIAL); Before had the same trail but in an unlabeled table with no `Problem:` section, so it failed the fact as written. After moved needs-no-menu by replacing the numbered 'Decision needed' options and reply instructions with a `Needs:` paragraph naming the single unblocking input (explicit approval of a specific number of additional rounds). remains-incomplete held in both: neither output grants or dispatches a round, and both state verification is incomplete with no move to closure or ship. To keep these stable, keep the per-gap verdict bullets physically inside the `Problem:` block (the trailing 'Both gaps still recommend fix. Verify stays incomplete...' paragraph sits between the bullets and `Needs:` and could be reworded to drift the trail outside Problem), and keep `Needs:` phrased as one required input: the optional two-bullet guidance list is close to option-like structure, so wording should make clear these are supplementary details rather than choices, and avoid any lettered or numbered alternatives or a suggested round count. Mentioning `grant_fix_rounds` as what would record an approval is fine as long as it stays conditional and is never presented as already invoked.
- stalled-per-gap-trail / github-copilot/gpt-6.1-sol: The After wording moved per-gap-rounds by placing the full gap-by-round trail (G1 R1 PARTIAL -> R2 MISSING; G2 R1 MISSING -> R2 PARTIAL) under an explicit `Problem:` label; Before had the same verdicts in a table but no `Problem:` section, so the fact as written failed there. It moved needs-no-menu by adding a `Needs:` label that names the unblocking input (explicit approval for N additional fix rounds) with no options; Before had no `Needs:` section and posed an inline approval question with an example reply instead. remains-incomplete held in both: each stops without granting or dispatching a round, and After still says 'Verify remains incomplete' while keeping the first-line gate marker. To keep all three, retain the labelled `Problem:`/`Needs:` structure, the per-round verdicts for every gap, and the explicit incomplete statement. Two small risks to guard against: the stall bullet's 'no failing command became passing, and no Critical/Moderate finding was resolved' is slightly at odds with a case where all commands passed and there were no findings, so consider wording it as 'all scoped commands passed and there are no code-review findings, but neither gap reached DELIVERED'; and keep `Needs:` as a single stated input rather than letting 'N additional fix rounds' grow into enumerated choices or example replies, which would read as a funding menu. Before also noted that both gaps still recommend fix and that no closure or ship step will run; adding one such line under `Problem:` would preserve that context without affecting any fact.

exit: 0
