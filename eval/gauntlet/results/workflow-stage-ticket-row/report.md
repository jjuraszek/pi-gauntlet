# eval report: gauntlet (partial run: workflow-stage-ticket-row)

for: 3191f38ab378b94b1d2b9a3ae80c903ca709ebdda14ab2e3f63e6706a8d8f696

wall: 22s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-ticket-row | anthropic/claude-opus-5-5 | unchanged | 8906 | criteria: holds -> holds (intended but unchanged); moved: holds -> holds (intended but unchanged); kinds: holds -> holds (intended but unchanged); mixed: holds -> holds (intended but unchanged); carried: holds -> holds (intended but unchanged); no-question: holds -> holds (intended but unchanged) |
| workflow-stage-ticket-row | github-copilot/gpt-6.1-sol | unchanged | 6280 | criteria: holds -> holds (intended but unchanged); moved: holds -> holds (intended but unchanged); kinds: holds -> holds (intended but unchanged); mixed: holds -> holds (intended but unchanged); carried: holds -> holds (intended but unchanged); no-question: holds -> holds (intended but unchanged) |

## Feedback

- workflow-stage-ticket-row / anthropic/claude-opus-5-5: No fact moved on this sample: the After wording produces the same Acceptance criteria and Integration blocks as Before, so the expected fails -> holds movement does not show here because Before already holds all six facts. In both, the three file-checkable rows stay verbatim with `in-scope`, including the whole mixed staging row. The carried operator entry comes first with its nested line and no marker. The seven moved rows follow in ticket order, each with its own indented `ticket row, not an acceptance criterion: <kind>` line and the right kind. `on staging` appears as a bare entry without a marker, and neither output asks a question. The only difference in After is the surrounding prose: a shorter lead-in that numbers the mixed row as "Row 8" and a condensed closing note. That is harmless here. To keep every fact, the wording should keep stating that moved entries carry no AC index or disposition, that a mixed row stays whole under Acceptance criteria with only its external clause copied unmarked, and that existing Integration entries are carried verbatim with their nested lines ahead of the moved rows.
- workflow-stage-ticket-row / github-copilot/gpt-6.1-sol: Before and After are identical in every respect the facts test; the only textual difference is the Acceptance criteria lead-in ("Acceptance criteria, rows verbatim" became "checkbox list, rows verbatim"), which moves no fact. Both keep exactly the three file-checkable rows word for word with an in-scope disposition (the mixed staging/error row kept whole), both open Integration with the carried drain-the-queue entry and its nested line with no marker, both move the seven externally fulfilled rows as separate plain items in ticket order, each with its own indented `ticket row, not an acceptance criterion: <kind>` line and the correct kind, both copy only `on staging` as an unmarked plain entry, and neither asks a question. So the expected fails -> holds movement is not visible on this sample: Before already satisfied all six facts, and the After wording neither gained nor lost anything. To keep it that way, retain the wording that drives verbatim rows with dispositions, the carried-entry-first ordering with nested lines intact, the per-row kind marker, and the external-clause-only copy for mixed rows; if the lead-in label change from the ticket's section name to "checkbox list" was unintended, restore the original label source.

exit: 0
