# eval report: gauntlet (partial run: drafted-row-scenarios)

for: 3191f38ab378b94b1d2b9a3ae80c903ca709ebdda14ab2e3f63e6706a8d8f696

wall: 10s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| drafted-row-scenarios | anthropic/claude-opus-5-5 | unchanged | 3461 | one-constraint: holds -> holds (held) |
| drafted-row-scenarios | github-copilot/gpt-6.1-sol | unchanged | 3720 | one-constraint: holds -> holds (held) |

## Feedback

- drafted-row-scenarios / anthropic/claude-opus-5-5: Nothing moved: both Before and After draft exactly one checkbox row in which the importer rejects an empty ID, a spaces-only ID, or an ID with a slash with the same invalid-ID error, and neither splits the three inputs into separate rows. The After wording's instruction to keep one drafted constraint row for several malformed-input scenarios of the same functionality is reflected directly in the output's explanation ('one row because the design commits to one ID validation rule, and each of the three inputs is a case of it'). To keep this fact stable, retain that explicit sentence tying multiple malformed-input scenarios of one functionality to a single drafted row, and keep it distinct from the rules for splitting broad set-wide outcomes by Design families so the two do not get confused.
- drafted-row-scenarios / github-copilot/gpt-6.1-sol: Both outputs draft exactly one checkbox row covering the empty, spaces-only and slash IDs with the same invalid-ID error, and neither splits the three inputs into separate rows, so the fact holds in Before and After alike; nothing in the After wording moved it. The only difference is After's trailing 'Stopped before writing.' line, which sits outside the checkbox rows and does not affect the fact. To keep this stable while delivering the Change, retain the explicit instruction to keep one drafted constraint row for several malformed-input scenarios of the same functionality, and avoid any wording that could be read as one row per input scenario or per error case.

exit: 0
