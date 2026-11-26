# eval report: gauntlet (partial run: drafted-row-scenarios)

for: c4a998790b00da8a2ddb379fc6330df343e3a0f6b3a3fe3e7dc43cad44ebd062

wall: 13s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| drafted-row-scenarios | anthropic/claude-opus-5-5 | improved | 5507 | one-constraint: fails -> holds (unplanned improvement) |
| drafted-row-scenarios | github-copilot/gpt-6.1-sol | unchanged | 4445 | one-constraint: holds -> holds (held) |

## Feedback

- drafted-row-scenarios / anthropic/claude-opus-5-5: Before split the three malformed-ID inputs into three separate checkbox rows (empty, spaces-only, slash), so one-constraint fails there; After drafts exactly one checkbox row stating the importer rejects an empty, spaces-only, or slash-containing ID with the same invalid-ID error, so the fact holds. The wording that keeps one drafted constraint row for several malformed-input scenarios of the same functionality is what moved it, and the After output's 'One row' note shows the writer tied the three shapes to the single design constraint. No fact that Before held was lost in this case, so no repair is needed here; to keep it stable, keep the rule phrased as 'scenarios of one constraint share one row' and distinct from the one-row-per-Design-behavior rule so writers do not over-merge genuinely separate behaviors, and consider trimming the extra commentary bullets after the section (provenance, integrity check, Integration) if the request is only to show the section, since they add text beyond what was asked without affecting this fact.
- drafted-row-scenarios / github-copilot/gpt-6.1-sol: The only fact under Facts, one-constraint, holds in both outputs: each shows a single checkbox row that covers the empty ID, the spaces-only ID and the slash ID together with the same invalid-ID error, and neither splits the three inputs into separate rows. After's only visible difference is the subject of the sentence ('The importer rejects...' instead of 'Importing with... rejects the ID'), which matches the fact's phrasing slightly more directly but does not change the verdict. Nothing moved, so no wording repair is needed; to keep this stable, retain the explicit instruction that several malformed-input scenarios of the same functionality stay in one drafted constraint row, and keep it clearly separate from the ticket-row sorting and Integration-carrying rules so those do not get applied to drafted rows.

exit: 0
