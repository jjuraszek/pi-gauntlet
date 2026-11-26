# eval report: gauntlet (partial run: drafted-row-scenarios)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 4s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| drafted-row-scenarios | anthropic/claude-opus-5-5 | improved | 3863 | one-constraint: fails -> holds (unplanned improvement) |
| drafted-row-scenarios | github-copilot/gpt-6.1-sol | unchanged | 3704 | one-constraint: holds -> holds (held) |

## Feedback

- drafted-row-scenarios / anthropic/claude-opus-5-5: After moved one-constraint from fails to holds: it drafts a single checkbox row covering the empty, spaces-only and slash IDs with the same invalid-ID error, and says the three inputs are scenarios of one row, where Before split them into three separate rows with the stated rationale that each case should be checked separately. Before held no fact that After lost, so nothing needs restoring; to keep this result stable, keep the instruction that several malformed-input scenarios of the same functionality stay one drafted constraint row, and keep it explicit that the row must still name every scenario and the shared error so merging rows never drops a case.
- drafted-row-scenarios / github-copilot/gpt-6.1-sol: Both outputs draft exactly one checkbox row covering the empty, spaces-only and slash IDs with the same invalid-ID error, so the fact holds in Before and After and the wording change did not move it. After names the importer as the subject of the row, which matches the fact's phrasing more directly than Before's 'Importing with...', and adds a 'Stopped before writing the spec.' line that does not affect the row count. To keep this stable, retain the explicit instruction to keep one drafted constraint row for several malformed-input scenarios of the same functionality, and avoid any wording that could be read as one row per scenario or per input case.

exit: 0
