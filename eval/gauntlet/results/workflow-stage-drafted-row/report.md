# eval report: gauntlet (partial run: workflow-stage-drafted-row)

for: 3191f38ab378b94b1d2b9a3ae80c903ca709ebdda14ab2e3f63e6706a8d8f696

wall: 24s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-drafted-row | anthropic/claude-opus-5-5 | unchanged | 4675 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| workflow-stage-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5329 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- workflow-stage-drafted-row / anthropic/claude-opus-5-5: No fact moved: After, like Before, renders exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (missing-id rejection via `importRows`, and the error naming the offending row's position), keeps `npm test passes`, CI green, PR approval and merge out of the acceptance rows, asks no cut or scope question, emits no `none` fallback, and retains `npm test` as full verification plus the focused missing-id and offending-row cases in `test/importer.test.ts`. The After wording's explicit 'separate proof from outcome' step and its statement that delivery stages produce neither rows nor Integration entries are what keep f1 and f2 stable; keep that wording, and keep the rule that a suite-proof sketch attached to a behavior yields a row naming the behavior, so the new Integration-sorting and grouped-row rules continue to apply only when ticket rows exist and do not pull delivery notes into `## Integration` or trigger an ownership question on the ticketless drafted branch.
- workflow-stage-drafted-row / github-copilot/gpt-6.1-sol: Nothing moved: both outputs draft exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (missing-id rejection and naming the offending row), keep CI, PR approval, merge and the suite run out of the criteria, ask no cut or scope question, emit no `none` fallback, and keep `npm test` as full verification alongside the focused missing-id and offending-row cases in `test/importer.test.ts`. After restructures the Tests section into per-behavior bullets, reorders `npm test` to the end, and appends a 'no tests have been executed' line; that still satisfies f4, but it rewords an already-approved `## Tests` section. To keep this stable, the wording should tell the writer to carry the approved Tests section through verbatim (same bullets, same order) and to keep rewriting a suite-proof sketch into the behavior it proves rather than into a suite-run row, so the ticket-row sorting and Integration changes stay confined to ticket-bearing cases and do not disturb the ticketless drafted-row path.

exit: 0
