# eval report: gauntlet (partial run: workflow-stage-ticket-row)

for: ddcbb009f7f1e1c9d3bb8b1185445141ea426e3415665e4d69479a9a0be23470

wall: 23s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-ticket-row | anthropic/claude-opus-5-5 | unchanged | 9484 | criteria: holds -> holds (intended but unchanged); moved: holds -> holds (intended but unchanged); kinds: holds -> holds (intended but unchanged); mixed: holds -> holds (intended but unchanged); carried: holds -> holds (intended but unchanged); no-question: holds -> holds (intended but unchanged) |
| workflow-stage-ticket-row | github-copilot/gpt-6.1-sol | unchanged | 8905 | criteria: holds -> holds (intended but unchanged); moved: holds -> holds (intended but unchanged); kinds: holds -> holds (intended but unchanged); mixed: holds -> holds (intended but unchanged); carried: holds -> holds (intended but unchanged); no-question: holds -> holds (intended but unchanged) |

## Feedback

- workflow-stage-ticket-row / anthropic/claude-opus-5-5: The After wording moved no fact in this case: the Acceptance criteria and Integration blocks are identical in Before and After, so all six facts hold in both, not the expected fails -> holds. Both keep exactly the three file-checkable rows verbatim with `in-scope`, including the whole mixed staging/error row. Both carry the existing drain-the-queue entry first with its nested line and no marker, list the seven moved rows as separate items in ticket order with the right kind markers, copy only `on staging` unmarked from the mixed row, and ask no question. The only difference is After's closing notes, which explain the mixed-row split, the complexity row staying, and that moved rows are not scope cuts and carry no disposition; none of that changes a fact. To keep every fact, preserve the current sorting wording: whole mixed row stays a criterion while only its external clause moves unmarked, existing Integration entries stay first and verbatim with nested lines, each moved row gets its own indented `ticket row, not an acceptance criterion: <kind>` line, and moving rows triggers no cut or ownership question. One small thing to watch: After's lead-in says "two are criteria, one is mixed", which is consistent with the three rows shown but could be tightened so the count of surviving acceptance rows reads plainly as three.
- workflow-stage-ticket-row / github-copilot/gpt-6.1-sol: No fact moved on this sample: all six hold in both outputs, so the expected fails -> holds movement for workflow-stage-ticket-row does not show here because Before already satisfied each fact. The two outputs are identical except for the provenance line under Acceptance criteria, which reads `checkbox list` in Before and `Acceptance criteria` in After; no fact depends on that line. Both keep exactly the three file-checkable rows verbatim with `in-scope`, including the whole mixed staging/error row. Both open Integration with the carried drain-the-queue entry and its nested line, with no marker. Both move the seven externally fulfilled rows as separate plain items in ticket order, each with its own indented `ticket row, not an acceptance criterion: <kind>` line and the right kind. Both copy only `on staging` as an unmarked plain entry, and neither asks a question. To keep this, the After wording should continue to say explicitly that a mixed row stays whole under Acceptance criteria while only its external clause is copied unmarked, that existing Integration entries come first with nested lines intact, and that moved rows drop the checkbox but keep their exact text and ticket order.

exit: 0
