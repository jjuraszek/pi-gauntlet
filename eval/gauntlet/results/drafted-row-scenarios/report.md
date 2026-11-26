# eval report: gauntlet (partial run: drafted-row-scenarios)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 10s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| drafted-row-scenarios | anthropic/claude-opus-5-5 | improved | 4913 | one-constraint: fails -> holds (unplanned improvement) |
| drafted-row-scenarios | github-copilot/gpt-6.1-sol | unchanged | 3947 | one-constraint: holds -> holds (held) |

## Feedback

- drafted-row-scenarios / anthropic/claude-opus-5-5: After moved one-constraint from fails to holds: the section now has exactly one checkbox row that covers the empty, spaces-only and slash IDs together with the same invalid-ID error, where Before split them into three rows and justified the split ('Each malformed-ID case has its own row so it can be checked separately'). The wording 'Keep one drafted constraint row for several malformed-input scenarios of the same functionality' is what delivers this; keep it as an explicit statement that scenarios of one design constraint share a row, and keep it scoped to drafted rows from a single design constraint so it does not collapse genuinely distinct Design behaviors (one row per behavior) or verbatim ticket rows. No fact that Before held was lost in this case, since Before held none; the retained 'Drafted from the design, no ticket rows' lead-in, the in-scope marker, and the stop-before-write statement are all still present in After.
- drafted-row-scenarios / github-copilot/gpt-6.1-sol: Both outputs draft exactly one checkbox row covering the empty, spaces-only and slash IDs with the same invalid-ID error, so the fact holds before and after; After did not move it. After's row names the importer as the subject explicitly ('The importer rejects...'), which matches the fact's wording slightly more directly than Before's 'Importing with... rejects the ID', and it adds a 'Stopped before writing the spec.' line that does not affect the row count. To keep this fact while delivering the Change, retain the wording that tells the writer to keep one drafted constraint row for several malformed-input scenarios of the same functionality, and avoid any phrasing that could be read as one row per input scenario or per error case.

exit: 0
