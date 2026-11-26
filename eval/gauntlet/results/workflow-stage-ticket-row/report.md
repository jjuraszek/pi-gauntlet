# eval report: gauntlet (partial run: workflow-stage-ticket-row)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 20s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-ticket-row | anthropic/claude-opus-5-5 | improved | 6584 | criteria: fails -> holds (intended change); moved: fails -> holds (intended change); kinds: fails -> holds (intended change); mixed: fails -> holds (intended change); carried: fails -> holds (intended change); no-question: fails -> holds (intended change) |
| workflow-stage-ticket-row | github-copilot/gpt-6.1-sol | improved | 9778 | criteria: fails -> holds (intended change); moved: fails -> holds (intended change); kinds: fails -> holds (intended change); mixed: fails -> holds (intended change); carried: fails -> holds (intended change); no-question: fails -> holds (intended change) |

## Feedback

- workflow-stage-ticket-row / anthropic/claude-opus-5-5: Before stopped on a gauntlet question about the GitHub CI row and offered a ticket repair, so it wrote no Acceptance criteria or Integration section and every fact fails there. After sorts without a question: the three file-checkable rows (missing id, the whole mixed staging/error row, make ci complexity 21) stay verbatim with an in-scope disposition, the seven externally fulfilled rows move to Integration as separate plain items in ticket order with their own indented kind line, the mixed row contributes only an unmarked `on staging` entry, and the existing drain-the-queue entry leads with its nested line intact and no marker. Nothing Before held was lost, since Before held none of these facts. To keep this result, keep the wording that tells the writer a row whose only observable is a pipeline result moves to Integration rather than prompting an ownership or repair question, that a mixed row stays whole under Acceptance criteria while only its external clause is copied, and that carried Integration entries come first verbatim with nested lines; one small ambiguity worth pinning is where the `on staging` clause sits relative to the moved rows (After placed it in the mixed row's ticket position), and that the kind line is indented under its item rather than a nested list item.
- workflow-stage-ticket-row / github-copilot/gpt-6.1-sol: Before stopped on a scope/repair question about the vendor-confirmation merge row and wrote no sections, so every fact fails there. After sorts without asking and all six facts hold: the three file-checkable rows (including the whole mixed staging/error row) stay verbatim under Acceptance criteria with in-scope dispositions; Integration leads with the carried drain-the-queue entry and its nested line, unmarked; the seven externally fulfilled rows follow as separate plain items in ticket order, each with its own indented `ticket row, not an acceptance criterion: <kind>` line and the right kind; and only `on staging` is copied from the mixed row, unmarked. No fact that Before kept was lost, since Before kept none. To keep this stable, the wording should continue to say explicitly that a workflow-stage row (merge condition, person step, tracker update, pipeline result, environment state, live check) moves to Integration without a scope-cut or ticket-repair question, that a mixed row stays whole in Acceptance criteria while only its external clause is copied unmarked, and that existing Integration entries are carried first with nested lines intact. It would also help to pin where the bare `on staging` entry sits and that moved rows drop their checkbox, since those are the details most likely to drift.

exit: 0
