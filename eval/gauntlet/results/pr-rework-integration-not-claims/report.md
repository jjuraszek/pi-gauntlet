# eval report: gauntlet (partial run: pr-rework-integration-not-claims)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 6s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-rework-integration-not-claims | anthropic/claude-opus-5-5 | improved | 5467 | contradicted-claim: holds -> holds (held); provenance-only: fails -> holds (intended change); no-question: holds -> holds (held) |
| pr-rework-integration-not-claims | github-copilot/gpt-6.1-sol | improved | 5504 | contradicted-claim: holds -> holds (held); provenance-only: fails -> holds (intended change); no-question: holds -> holds (held) |

## Feedback

- pr-rework-integration-not-claims / anthropic/claude-opus-5-5: The provenance-only instruction moved the intended fact: Before listed the operator-card step and its nested shift-log line under keeps and judged them against the diff ("the diff cannot verify them", "the limit written on the operator card must be three"), while After leaves both lines out of keeps, changes, and dropped claims and raises no question about them. The contradicted-claim fact survives in After, but more weakly: After says the diff "does not meet the stated claim or the base rule" and shows that `attempt < 4` yields four attempts, whereas Before explicitly said this "contradicts the PR's stated limit" and called the claim false against the diff. To keep that fact robust, add wording that the provenance-only rule covers only the `## Integration` block and that every other PR-body claim must still be checked against the diff and, when the diff disagrees, be named explicitly as contradicted with the observed versus claimed value. Also note that After omits the Integration block entirely; if the scout is meant to carry it forward as provenance, say where it should appear verbatim (outside the claim dispositions, nested lines intact) so that omission is not read as dropping it.
- pr-rework-integration-not-claims / github-copilot/gpt-6.1-sol: The provenance-only wording moved the intended fact: Before rendered the operator-card update and its nested shift-log step under keeps and judged them against the diff ("Neither operational action is implemented by the supplied diff"), while After leaves the Integration block out of keeps, changes, and dropped claims entirely and asks nothing about it. The contradicted-claim fact still holds in After because the changes line says the diff permits four attempts and the dropped-claims line says the diff does not satisfy the three-attempt claim, but the contradiction is now split across two lines; Before stated it directly in the dropped claim ("The supplied diff permits four attempts"). To keep that fact robust, have the wording require the dropped-claim entry itself to state the observed count against the claimed one. After also dropped the base-sync, scoped-tests and carried-specs lines that Before reported; no fact here keys on them, but if the scout output is meant to carry them, say that treating Integration as provenance only removes nothing else from the record. Consider stating whether the scout should carry the Integration block forward verbatim as provenance, since After omits it silently rather than noting it as carried.

exit: 0
