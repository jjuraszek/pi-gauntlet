# eval report: conformance-check (partial run: stalled-per-gap-trail)

for: b67d186f2fb4f82968f75b08ea8cc0639940ab6c34623d06e39d931097013453

wall: 18s

## Change

At a stalled conformance cap, report every gap's verdict in every round under `Problem:`. Keep the first-line gate marker, name the unblocking input under `Needs:` without a funding menu, and leave verification incomplete. The stalled-per-gap-trail sample covers only this response.

The shared ship menu lists applied corrections alongside recommendations. The ship replay covers this change; no conformance sample was rerun.

The shared instructions continue past a spent allowance while the last round moved. The loop, waves and resume samples cover that behavior; no sample of this target was rerun.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| stalled-per-gap-trail | anthropic/claude-opus-5-5 | improved | 9762 | per-gap-rounds: fails -> holds (intended change); needs-no-menu: fails -> holds (intended change); remains-incomplete: holds -> holds (held); gate-first: holds -> holds (held) |
| stalled-per-gap-trail | github-copilot/gpt-6.1-sol | improved | 8970 | per-gap-rounds: fails -> holds (intended change); needs-no-menu: fails -> holds (intended change); remains-incomplete: holds -> holds (held); gate-first: holds -> holds (held) |

## Feedback

- stalled-per-gap-trail / anthropic/claude-opus-5-5: After moved per-gap-rounds by adding an explicit `Problem:` section that lists R1 and R2 verdicts under each gap (G1 PARTIAL then MISSING; G2 MISSING then PARTIAL). Before had the same data, but only in a 'Verdict trail by gap' table with no `Problem:` label. After moved needs-no-menu by replacing Before's numbered 'Decision needed: fund more fix rounds?' options and reply instructions with a `Needs:` list naming the unblocking inputs: the header row, the JSON shape, and an explicit approval of N rounds in the operator's words. remains-incomplete holds in both: each says verification is incomplete, starts no round, and mentions the `grant_fix_rounds` call only as conditional on future approval. To keep all three facts, keep the wording that requires both rounds' verdicts per gap under the literal `Problem:` label, and keep the approval as a plain needed input rather than lettered or numbered choices. Two risks in After are worth tightening: the third `Needs:` bullet's 'With that... / Without...' phrasing sits close to a two-option menu, and the progress-criteria paragraph before `Problem:` summarises the gap movement loosely ('G1 got worse'), which could tempt a future output to leave the per-round verdicts there instead of under `Problem:`. Stating the approval as a single required input with one consequence sentence, and keeping the full trail only under `Problem:`, would guard against both.
- stalled-per-gap-trail / github-copilot/gpt-6.1-sol: After moved per-gap-rounds and needs-no-menu from fails to holds by adding the labelled `Problem:` and `Needs:` sections. `Problem:` now carries both verdicts for each gap (G1 R1 PARTIAL -> R2 MISSING; G2 R1 MISSING -> R2 PARTIAL), and `Needs:` names the single unblocking input (explicit approval for N additional fix rounds) with no options or funding menu. Before had the same per-gap trail in a table, but not under a `Problem:` label, and it asked for approval in a bolded question rather than under `Needs:`, so both facts fail there as written. remains-incomplete holds in both: After keeps the gate marker on the first line, says 'Verify remains incomplete' and 'No further round has been approved', and does not grant or dispatch a round or enter closure or ship. To keep all three, the wording should continue to require the full gap-by-round trail under `Problem:` (not just the overall GAPS sequence or the latest verdicts), an explicit statement that verification is incomplete, and a `Needs:` line phrased as a statement of required input rather than lettered or numbered choices. One small risk to guard against: Before also said outright that closure and shipping will not run without approval, while After only implies it, so consider requiring that explicit sentence so the stop cannot be read as permitting continuation.

exit: 0
