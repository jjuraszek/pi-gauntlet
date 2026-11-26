# eval report: gauntlet (partial run: workflow-stage-ticket-row)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 28s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-ticket-row | anthropic/claude-opus-5-5 | improved | 13356 | criteria: fails -> holds (intended change); moved: fails -> holds (intended change); kinds: fails -> holds (intended change); mixed: fails -> holds (intended change); carried: fails -> holds (intended change); no-question: fails -> holds (intended change) |
| workflow-stage-ticket-row | github-copilot/gpt-6.1-sol | improved | 7115 | criteria: fails -> holds (intended change); moved: fails -> holds (intended change); kinds: fails -> holds (intended change); mixed: fails -> holds (intended change); carried: fails -> holds (intended change); no-question: fails -> holds (intended change) |

## Feedback

- workflow-stage-ticket-row / anthropic/claude-opus-5-5: Before wrote no sections at all: it stopped on a lettered scope question about the `GitHub CI is green` row and recommended a ticket repair, so all six facts fail there. After sorts without asking and all six hold. Acceptance criteria keeps only the missing-id row, the whole `on staging, the importer names the offending row in its error` row and the `make ci` row, each verbatim with `in-scope`. Integration opens with the carried drain-the-queue entry and its nested `Read the queue length again` line, unmarked. The seven externally fulfilled rows follow as separate checkbox-free items in ticket order, each with its own indented `ticket row, not an acceptance criterion: <kind>` line and the correct kind. The mixed row contributes only a bare `on staging` entry with no marker. What moved the facts is wording that treats a pipeline-result row as an Integration entry sorted by the criteria definition, not as a scope-cut or repair decision, together with the explicit rule that a mixed row stays whole while only its external clause is copied. Before kept none of these facts, so there is nothing to restore. To keep the result stable, keep explicit that moving a row is not a scope cut and needs no question, that the carried entry comes first with its nested lines intact and unmarked, that moved rows drop the checkbox and take no disposition, and that the copied clause of a mixed row gets no marker. The trailing notes on placement and design commitments go slightly past the requested stop point but break no fact; trim them if you want the output to end at the authored sections.
- workflow-stage-ticket-row / github-copilot/gpt-6.1-sol: Before stopped at a scope question about the vendor-confirmation row and recommended a ticket repair, so it wrote no Acceptance criteria or Integration section and every fact fails there. After sorts without asking: the three file-checkable rows stay verbatim with in-scope dispositions (the mixed staging/error row kept whole), the existing Integration entry leads with its nested line intact and no marker, the seven externally fulfilled rows follow as separate plain items in ticket order each with its own indented kind marker of the right kind, and only `on staging` is copied from the mixed row as an unmarked entry. Nothing Before held was lost. To keep this stable, keep the wording that tells the writer to sort workflow-stage rows into Integration rather than raise an ownership or scope question when no row contradicts the checkout, and keep explicit that moved rows drop the checkbox, keep ticket order, carry the marker on an indented line, and that a mixed row contributes only its external clause unmarked while the full row remains under Acceptance criteria.

exit: 0
