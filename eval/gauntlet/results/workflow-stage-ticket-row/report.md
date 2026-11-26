# eval report: gauntlet (partial run: workflow-stage-ticket-row)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 10s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-ticket-row | anthropic/claude-opus-5-5 | improved | 5879 | criteria: fails -> holds (intended change); moved: fails -> holds (intended change); kinds: fails -> holds (intended change); mixed: fails -> holds (intended change); carried: fails -> holds (intended change); no-question: fails -> holds (intended change) |
| workflow-stage-ticket-row | github-copilot/gpt-6.1-sol | improved | 10113 | criteria: fails -> holds (intended change); moved: fails -> holds (intended change); kinds: fails -> holds (intended change); mixed: fails -> holds (intended change); carried: fails -> holds (intended change); no-question: fails -> holds (intended change) |

## Feedback

- workflow-stage-ticket-row / anthropic/claude-opus-5-5: Before stopped on a gauntlet question about the GitHub CI row and recommended a ticket repair, so it wrote neither section and every fact fails there. After sorts without asking: the three file-checkable rows stay verbatim under Acceptance criteria with in-scope dispositions (the mixed staging/error row kept whole), the carried Integration entry leads with its nested line intact and no marker, the seven externally fulfilled rows follow as separate plain items in ticket order each with an indented kind line matching the expected kinds, and only `on staging` is copied from the mixed row without a marker. Nothing Before held was lost. To keep this stable, the wording should continue to state explicitly that a pipeline-result row moves to Integration with its kind marker rather than triggering a scope or repair question, that mixed rows remain whole in Acceptance criteria while only the external clause is copied unmarked, and that the kind line is indented beneath its row; the `on staging` entry currently sits between the In Review row and the CI row per ticket order, which is fine, but spelling out that placement rule would prevent drift.
- workflow-stage-ticket-row / github-copilot/gpt-6.1-sol: Before stopped at a gauntlet question about the vendor-confirmation row and recommended a ticket repair, so it wrote no Acceptance criteria or Integration section and every fact fails there. After sorts without asking, and all six facts hold. It keeps only the three file-checkable rows verbatim with `in-scope`, including the whole mixed `on staging, the importer names the offending row in its error` row. Integration opens with the existing drain-the-queue entry and its nested `Read the queue length again after the final batch.` line, unmarked. The seven externally fulfilled rows follow in ticket order as separate plain items without checkboxes, each with its own indented `ticket row, not an acceptance criterion: <kind>` line and the right kind. The bare `on staging` entry is copied without a marker. No fact that Before kept was lost, since Before kept none. To keep this result stable, the wording should continue to state four things explicitly: an externally fulfilled row moves without an ownership or scope question; a mixed row stays whole under Acceptance criteria while only its external clause is copied unmarked; existing Integration entries are carried first with nested lines intact; and each moved row gets its own kind line in original ticket order. The one fragile spot is where the `on staging` clause sits: After places it at the mixed row's ticket position, between the tracker-update row and the CI row, and the wording should say so if that placement is intended.

exit: 0
