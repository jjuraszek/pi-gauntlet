# eval report: gauntlet (partial run: workflow-stage-drafted-row)

for: ddcbb009f7f1e1c9d3bb8b1185445141ea426e3415665e4d69479a9a0be23470

wall: 22s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-drafted-row | anthropic/claude-opus-5-5 | unchanged | 4991 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| workflow-stage-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 4774 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- workflow-stage-drafted-row / anthropic/claude-opus-5-5: Nothing in After moved a fact on this case: both outputs render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (missing-id rejection via `importRows`, and the error naming the offending row's position), keep `npm test passes`, CI, PR approval, and merge out of the acceptance rows, ask no cut or scope question, emit no `none` fallback, and keep `npm test` as full verification plus the two focused cases in `test/importer.test.ts`. The only differences are cosmetic: After moves the full-verification line to the end of `## Tests`, writes it as `Full verification - `npm test`` instead of `Full verification: `npm test`.`, and drops the words `public` and `focused` from the rows and test bullets. To keep this stable while delivering the Change, keep the wording that says a suite run or delivery stage is proof rather than an outcome and stays in `## Tests`, and that an all-Integration or ticketless path drafts rows from the Design without an ownership question or stop; if you want the Tests section pinned more tightly, state that the approved full-verification line is carried over verbatim and first.
- workflow-stage-drafted-row / github-copilot/gpt-6.1-sol: No fact moved on this case: both Before and After render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (missing-id rejection and naming the offending row), rewrite the `npm test passes` sketch into the rejection behavior itself rather than a suite-run row, keep CI green, PR approval, and merge out of the criteria as delivery stages, ask no cut or scope question, emit no `none` fallback, and retain `npm test` as full verification plus the focused missing-id and offending-row cases in `test/importer.test.ts`. The After wording's ticket-row sorting and Integration rules did not leak into this ticketless drafted path, which is what you want; to keep it that way, keep those rules explicitly scoped to ticket rows and keep the drafted-row guidance stating that a suite-pass proof sketch is rewritten to its behavior's observable, that stage-only outcomes are never rows, and that rewriting a proof is not a scope cut and needs no question.

exit: 0
