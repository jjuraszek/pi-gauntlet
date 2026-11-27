# eval report: gauntlet (partial run: drafted-row-scenarios)

for: ddcbb009f7f1e1c9d3bb8b1185445141ea426e3415665e4d69479a9a0be23470

wall: 9s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| drafted-row-scenarios | anthropic/claude-opus-5-5 | unchanged | 3850 | one-constraint: holds -> holds (held) |
| drafted-row-scenarios | github-copilot/gpt-6.1-sol | unchanged | 3644 | one-constraint: holds -> holds (held) |

## Feedback

- drafted-row-scenarios / anthropic/claude-opus-5-5: Both outputs draft exactly one checkbox row covering the empty, spaces-only and slash-containing IDs with the same invalid-ID error, and neither splits the three inputs into separate rows, so the fact holds unchanged. The After wording's instruction to keep one drafted constraint row for several malformed-input scenarios of the same functionality is reflected directly in the output's closing explanation ('three inputs are scenarios of that one functionality'); nothing moved. The only difference is that After drops Before's sentence noting that no `## Integration` section is needed, which this fact does not depend on; if you want that note retained, say explicitly that the writer should state when the spec gets no Integration section, but the current wording already preserves the single-row behavior.
- drafted-row-scenarios / github-copilot/gpt-6.1-sol: Both outputs draft exactly one checkbox row covering the empty ID, spaces-only ID and slash ID with the same invalid-ID error, so the one-constraint fact holds in Before and After; nothing in the After wording moved it. The only textual difference is that After drops the trailing 'Stopped before writing.' line, which this fact does not key on, but if a stop-before-write statement matters elsewhere, keep an explicit instruction to state the stop. To keep this fact stable, retain the wording that several malformed-input scenarios of the same functionality stay as one drafted constraint row rather than being split per input.

exit: 0
