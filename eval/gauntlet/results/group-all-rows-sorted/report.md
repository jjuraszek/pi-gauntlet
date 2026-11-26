# eval report: gauntlet (partial run: group-all-rows-sorted)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 14s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| group-all-rows-sorted | anthropic/claude-opus-5-5 | improved | 5289 | no-ownership-question: fails -> holds (intended change); moved: fails -> holds (unplanned improvement); retained: fails -> holds (unplanned improvement) |
| group-all-rows-sorted | github-copilot/gpt-6.1-sol | improved | 4574 | no-ownership-question: fails -> holds (intended change); moved: fails -> holds (unplanned improvement); retained: fails -> holds (unplanned improvement) |

## Feedback

- group-all-rows-sorted / anthropic/claude-opus-5-5: After sorts the rows before deciding ownership, which is what moved all three facts: the rollout row is classified as a person step and placed verbatim under `## Integration` with the indented marker `ticket row, not an acceptance criterion: person step`, the unmatched group then has no surviving acceptance row so no A/B/C ownership question is asked, and `## Acceptance criteria` shows `The label editor trims surrounding spaces.` verbatim as an unchecked in-scope row. Before stopped at a `gauntlet: question` over the rollout group and rendered neither section, so all three facts fail there, including `retained`, since no Acceptance criteria section was shown at all. Before kept nothing that After lost, so no wording needs restoring; to keep this stable, hold the explicit order (sort rows first, then apply the ownership question only to groups with surviving acceptance rows) and the exact marker text, and consider trimming the surrounding narration (the provenance note and section-placement remark) so the reply stops cleanly after the two sections as the continuation requests.
- group-all-rows-sorted / github-copilot/gpt-6.1-sol: After sorts the rollout row into Integration before applying the ownership check, so the unmatched `rollout` group has no surviving acceptance row and no ownership question is raised; this flips no-ownership-question from fails to holds. The Integration entry carries `The operator announces the rollout.` verbatim with the indented marker `ticket row, not an acceptance criterion: person step`, and the row is absent from Acceptance criteria, so moved holds. The labels row stays verbatim as an unchecked `- [ ]` row with an `in-scope` line, so retained holds. Before stopped at the ownership question and rendered neither section, so all three facts fail there; nothing Before held was lost. To keep this stable, keep the wording that the ownership question and no-member stop apply only to groups with surviving acceptance rows after sorting, and keep the instruction that moved entries are copied verbatim with the kind marker on an indented line while surviving ticket rows keep their unchecked checkbox and verbatim text.

exit: 0
