# eval report: gauntlet (partial run: legs-integration-sorted)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 7s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| legs-integration-sorted | anthropic/claude-opus-5-5 | improved | 6290 | moved: fails -> holds (unplanned improvement); companion-scope: fails -> holds (unplanned improvement); nonmember: fails -> holds (unplanned improvement); carried: fails -> holds (unplanned improvement) |
| legs-integration-sorted | github-copilot/gpt-6.1-sol | improved | 6219 | moved: fails -> holds (unplanned improvement); companion-scope: fails -> holds (unplanned improvement); nonmember: fails -> holds (unplanned improvement); carried: fails -> holds (unplanned improvement) |

## Feedback

- legs-integration-sorted / anthropic/claude-opus-5-5: The After wording moved all four facts from fails to holds. Before kept `CI is green on the PR head` as an acceptance row with a pending disposition and asked a cut question, so the row never moved, `label-cli` claimed `scope: AC 2` by original index, the mixed row's `on staging` clause was never copied, and Integration was a paraphrased Design subsection that lost the nested `Use the release thread.` line. After moves the CI row to `## Integration` with the `pipeline result` marker and no AC index, counts rows after sorting so `label-cli` claims `scope: AC 1`, keeps the web row verbatim with `elsewhere: label-web` while copying only `on staging`, and gives the companion an identical copy of the home Integration section with the nested line intact. Before held none of these facts, so nothing was lost. To keep this stable, keep the explicit wording that moved entries get no index and no disposition or cut question, that numbering is taken after sorting, and that existing Integration entries are carried verbatim with nested lines rather than summarised. One optional tightening: the detached `on staging` entry appears bare with no marker or source-row note, so if you want its origin to be readable in the companion, say whether a detached clause carries a marker.
- legs-integration-sorted / github-copilot/gpt-6.1-sol: Before stopped at a scope-cut question about the `CI is green on the PR head` row (recommending ticket repair) and never rendered Acceptance criteria, Integration, leg scopes or a companion section, so all four facts fail there. After sorts without a question: the CI row sits in Integration with the marker `ticket row, not an acceptance criterion: pipeline result` and takes no AC index; the CLI row stays verbatim, `in-scope`, and the `label-cli` leg claims `scope: AC 1` counted after the move; the web row stays verbatim with `elsewhere: label-web` and only `on staging` is copied to Integration; the companion repeats the home Integration block identically, including the nested `Use the release thread.` line, the moved row with its marker, and the detached clause. Nothing Before held was lost, so the count-after-sorting and carry-verbatim wording is doing its job. Two places where the wording could be tightened to keep this stable: the detached clause `on staging` appears in Integration with no kind marker or pointer back to its source row, while the fully moved row has one, so say explicitly whether a mixed row's detached clause carries a marker; and the `labels` leg is rendered as `scope: none` because its only row moved, so state that outcome explicitly so it is not later mistaken for a missing-scope fallback or a reason to ask an ownership question.

exit: 0
