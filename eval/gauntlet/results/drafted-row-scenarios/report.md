# eval report: gauntlet (partial run: drafted-row-scenarios)

for: 26d1c1f3e56ec9aa53ab90ddeed921b06ff3c19296da7ff12b5341e3cd1f9b91

wall: 10s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| drafted-row-scenarios | anthropic/claude-opus-5-5 | unchanged | 3975 | one-constraint: holds -> holds (held) |
| drafted-row-scenarios | github-copilot/gpt-6.1-sol | unchanged | 4157 | one-constraint: holds -> holds (held) |

## Feedback

- drafted-row-scenarios / anthropic/claude-opus-5-5: Nothing moved: both Before and After draft exactly one checkbox row in which the importer rejects an empty ID, a spaces-only ID, or an ID with a slash with the same invalid-ID error, and neither splits the three inputs into separate rows. The After wording's instruction to keep one drafted constraint row for several malformed-input scenarios of the same functionality is reflected directly in the output, which even explains that the three forms are scenarios of one constraint. To keep this fact safe, retain that explicit sentence about one row per constraint for multiple malformed-input scenarios; the extra explanatory bullets in After (disposition, header, no Integration section) are harmless to this fact but are not required by it, so trim them if brevity matters.
- drafted-row-scenarios / github-copilot/gpt-6.1-sol: Nothing in After moved the fact: both outputs draft exactly one checkbox row in which the importer rejects an empty ID, a spaces-only ID, or an ID with a slash with the same invalid-ID error, and neither splits the three malformed inputs into separate rows. After's row tracks the request wording slightly more closely ("with a slash,") and drops Before's trailing "Stopped before writing the spec." line, neither of which bears on the fact. To keep this stable while delivering the Change, retain the explicit wording that several malformed-input scenarios of the same functionality stay as one drafted constraint row, and that all-design drafting proceeds without an ownership question; if the stop-before-write confirmation matters elsewhere, say explicitly whether the output should state it, since After omitted it.

exit: 0
