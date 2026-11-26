# eval report: gauntlet (partial run: workflow-stage-ticket-row)

for: c4a998790b00da8a2ddb379fc6330df343e3a0f6b3a3fe3e7dc43cad44ebd062

wall: 27s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-ticket-row | anthropic/claude-opus-5-5 | improved | 12075 | criteria: fails -> holds (intended change); moved: fails -> holds (intended change); kinds: fails -> holds (intended change); mixed: fails -> holds (intended change); carried: fails -> holds (intended change); no-question: fails -> holds (intended change) |
| workflow-stage-ticket-row | github-copilot/gpt-6.1-sol | improved | 6873 | criteria: fails -> holds (intended change); moved: fails -> holds (intended change); kinds: fails -> holds (intended change); mixed: fails -> holds (intended change); carried: fails -> holds (intended change); no-question: fails -> holds (intended change) |

## Feedback

- workflow-stage-ticket-row / anthropic/claude-opus-5-5: Before stopped at a gauntlet question about the `GitHub CI is green` row and recommended a ticket repair, so it wrote neither section and all six facts fail there. After sorts without asking, and every fact holds. It keeps only the missing-id row, the whole mixed `on staging, the importer names the offending row in its error` row and the make-ci row under Acceptance criteria, each verbatim with `in-scope`. Integration opens with the carried drain-the-queue entry and its nested `Read the queue length again` line, unmarked. The seven externally fulfilled rows follow as separate checkbox-free items in ticket order, each with its own indented `ticket row, not an acceptance criterion: <kind>` line and the right kind. The mixed row contributes only a bare, unmarked `on staging`. What moved the facts is the wording that treats a pipeline-result row as an Integration entry to move rather than a scope decision, and that says moving is not a cut and so needs no disposition or question. Keep that wording explicit, along with the rules that a mixed row stays whole as a criterion while only its external clause is copied unmarked, and that an existing Integration entry is carried first with its nested lines intact. Before held no fact here, so nothing was lost. The surrounding explanation and the `Criteria count` note in After touch no fact, but if the Change's point that moved entries get no AC index is meant to show in the output, keep that note short and outside the authored sections so it cannot be read as section content.
- workflow-stage-ticket-row / github-copilot/gpt-6.1-sol: Before stopped at a scope/repair question about the vendor-confirmation row and wrote no sections, so every fact fails there. After writes both sections without a question: the three file-checkable rows stay under Acceptance criteria verbatim with an in-scope disposition, including the whole mixed `on staging, the importer names the offending row in its error` row; the seven externally fulfilled rows appear in Integration as separate unchecked items in ticket order, each with its own indented `ticket row, not an acceptance criterion: <kind>` line and the correct kind; only `on staging` is copied from the mixed row as a plain unmarked entry; and the existing drain-the-queue entry comes first, verbatim, with its nested line intact and no marker. Nothing Before held was lost. To keep this stable, keep the wording that says externally fulfilled rows are sorted rather than questioned or sent to ticket repair, that a mixed row stays whole in Acceptance criteria while only its external clause is copied unmarked, and that existing Integration entries are carried first with nested lines; it may help to state explicitly that the marker line is indented under its own item and that the mixed-row clause sits at its original ticket position, since those are the places most likely to drift.

exit: 0
