# eval report: gauntlet (partial run: workflow-stage-ticket-row)

for: 26d1c1f3e56ec9aa53ab90ddeed921b06ff3c19296da7ff12b5341e3cd1f9b91

wall: 26s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-ticket-row | anthropic/claude-opus-5-5 | unchanged | 10754 | criteria: holds -> holds (intended but unchanged); moved: holds -> holds (intended but unchanged); kinds: holds -> holds (intended but unchanged); mixed: holds -> holds (intended but unchanged); carried: holds -> holds (intended but unchanged); no-question: holds -> holds (intended but unchanged) |
| workflow-stage-ticket-row | github-copilot/gpt-6.1-sol | unchanged | 8797 | criteria: holds -> holds (intended but unchanged); moved: holds -> holds (intended but unchanged); kinds: holds -> holds (intended but unchanged); mixed: holds -> holds (intended but unchanged); carried: holds -> holds (intended but unchanged); no-question: holds -> holds (intended but unchanged) |

## Feedback

- workflow-stage-ticket-row / anthropic/claude-opus-5-5: No fact moved on this sample: the Acceptance criteria and Integration sections in After are identical, line for line, to those in Before, so the expected fails -> holds movement is not visible here because Before already satisfied every fact. Both outputs keep only the three file-checkable rows verbatim with `in-scope`, including the whole mixed staging row. Both carry the existing drain-the-queue entry first with its nested line and no marker, list the seven moved rows as separate items in ticket order with the correct kind markers, copy the bare `on staging` entry without a marker, and ask no question. The only differences in After are presentational: an opening sentence saying no question is needed, code fences around the sections, a placement note, and a trailing rationale list. None of that breaks a fact, but the continuation asked only for the sections, so the rationale adds risk (a paraphrase of a row there could be misread as section content) without adding value. To keep every fact while delivering the Change, keep the sorting wording as it is and consider telling the writer to emit the authored sections alone, with no explanatory recap, when it stops before the approval summary. If you need this sample to demonstrate the Change, it needs a baseline that actually fails, since the Before wording already sorts this ticket correctly.
- workflow-stage-ticket-row / github-copilot/gpt-6.1-sol: No fact moved on this sample: the two outputs are identical except for the provenance line above the criteria ("checkbox list" in Before, "Acceptance criteria" in After), which no fact keys on. Both keep exactly the three file-checkable rows verbatim with an in-scope disposition, including the whole mixed staging/error row. Both open Integration with the carried drain-the-queue entry and its nested line, unmarked, then list the seven moved rows in ticket order, each with its own indented kind marker of the correct kind, and a bare `on staging` entry without a marker. Neither asks a question. The expected fails -> holds movement for workflow-stage-ticket-row therefore does not show here, because Before already satisfies every fact as written; the After wording delivers the Change without losing anything Before kept. To keep that, leave untouched the wording that sorts rows without a question, moves only the external clause of a mixed row, and carries existing Integration entries first with their nested lines.

exit: 0
