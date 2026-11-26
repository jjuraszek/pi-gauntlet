# eval report: gauntlet (partial run: drafted-row-scenarios)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 13s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| drafted-row-scenarios | anthropic/claude-opus-5-5 | improved | 4509 | one-constraint: fails -> holds (unplanned improvement) |
| drafted-row-scenarios | github-copilot/gpt-6.1-sol | unchanged | 4053 | one-constraint: holds -> holds (held) |

## Feedback

- drafted-row-scenarios / anthropic/claude-opus-5-5: After moved one-constraint from fails to holds: its Acceptance criteria section contains exactly one checkbox row stating that the importer rejects an empty, spaces-only or slash-containing ID with the same invalid-ID error, whereas Before split the three malformed inputs into three separate rows and explicitly justified doing so ('Each malformed-ID case has its own row'). The wording that keeps one drafted constraint row for several malformed-input scenarios of the same functionality is what delivered this, and no fact held by Before was lost here. To keep it stable, retain the explicit statement that scenarios of one design constraint share a row, and consider trimming the long drafting rationale (integrity check, disposition, gate notes) since the case only asked to show the section and stop before any write; the extra narration is harmless to this fact but adds surface for drift in other cases.
- drafted-row-scenarios / github-copilot/gpt-6.1-sol: Both outputs draft exactly one checkbox row covering the empty, spaces-only and slash-containing IDs with the same invalid-ID error, so one-constraint holds before and after; the After wording did not move it. The only visible difference is that After names the importer as the subject ('The importer rejects...') where Before says 'Importing with ... rejects the ID', which matches the fact's phrasing slightly more directly but does not change the verdict. To keep this fact while delivering the Change, keep the explicit instruction that several malformed-input scenarios of the same functionality stay in one drafted constraint row, and make sure the new row-counting and sorting language for grouped ticket rows is clearly scoped to ticket rows so it cannot be read as a reason to split a drafted row into one row per input case.

exit: 0
