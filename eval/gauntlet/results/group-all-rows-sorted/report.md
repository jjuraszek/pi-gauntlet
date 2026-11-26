# eval report: gauntlet (partial run: group-all-rows-sorted)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 23s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| group-all-rows-sorted | anthropic/claude-opus-5-5 | improved | 5676 | no-ownership-question: fails -> holds (intended change); moved: fails -> holds (unplanned improvement); retained: fails -> holds (unplanned improvement); elsewhere: fails -> holds (unplanned improvement) |
| group-all-rows-sorted | github-copilot/gpt-6.1-sol | improved | 5561 | no-ownership-question: fails -> holds (intended change); moved: fails -> holds (unplanned improvement); retained: fails -> holds (unplanned improvement); elsewhere: holds -> holds (held) |

## Feedback

- group-all-rows-sorted / anthropic/claude-opus-5-5: Before stopped Case A on an A/B/C ownership question about the unmatched `rollout` group, so it produced no Acceptance criteria or Integration sections for that case, and in Case B it kept the person-step handoff row as an in-scope criterion and replaced Integration with a deferred `## Legs` description. After sorts rows before assigning ownership, which is what moved every fact: the rollout row lands in `## Integration` verbatim with the `ticket row, not an acceptance criterion: person step` marker, the trim row stays as an unchecked `in-scope` row, and Case B keeps the palette row verbatim as `elsewhere: sample/palette` stated without a question and without stopping over the member group having no surviving rows. Nothing Before held was lost, so keep the wording that orders sorting before the unmatched-group check and that says a surviving known-nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. One thing to watch: After's Case B says the member leg owns no AC index and adds no design-derived row, which is consistent with a surviving ticket row here, but make sure the wording keeps this distinct from the all-rows-moved case, where drafted rows from the design are expected.
- group-all-rows-sorted / github-copilot/gpt-6.1-sol: After moved no-ownership-question, moved, and retained from fails to holds: it treats the rollout row as a person step sorted into Integration before checking group ownership, so the unmatched `rollout` heading has no surviving acceptance row and no question is asked, the entry appears verbatim under `## Integration` with the indented marker `ticket row, not an acceptance criterion: person step`, and `The label editor trims surrounding spaces.` stays verbatim, unchecked and in-scope. Before instead stopped Case A on an ownership question and emitted no sections. The elsewhere fact holds in both: each keeps the palette row verbatim with `elsewhere: sample/palette`, asks no ownership question in Case B, and does not stop over the member group; After additionally moves the handoff-note row to Integration, whereas Before left it in Acceptance criteria as in-scope, which the fact as written does not forbid. To keep this stable, keep the wording that sorts rows before counting a group's surviving rows, that an unmatched group is asked about only when an acceptance row survives, and that a known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move; nothing Before kept was lost in After.

exit: 0
