# eval report: gauntlet (partial run: pr-rework-integration-not-claims)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 14s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-rework-integration-not-claims | anthropic/claude-opus-5-5 | improved | 5904 | contradicted-claim: holds -> holds (held); provenance-only: fails -> holds (unplanned improvement); no-question: holds -> holds (held) |
| pr-rework-integration-not-claims | github-copilot/gpt-6.1-sol | improved | 4201 | contradicted-claim: holds -> holds (held); provenance-only: fails -> holds (unplanned improvement); no-question: holds -> holds (held) |

## Feedback

- pr-rework-integration-not-claims / anthropic/claude-opus-5-5: After moved provenance-only from fails to holds: Before rendered the operator-card update and its nested shift-log step as a bullet under keeps and judged them against the diff ("the diff cannot verify them", "the limit written on the operator card must be three"), while After leaves the Integration block out of keeps, changes, and dropped claims entirely and never judges it. Both outputs report the three-attempt claim as contradicted by the four attempts the diff allows (After: "the current diff allows four attempts. That breaks both the PR's stated claim and the base rule"), and neither raises a question about the Integration block, so no fact regressed. To keep this stable, keep the wording that tells the scout Integration entries are provenance carried verbatim elsewhere and are not sorted into keeps/changes/dropped claims or checked against the diff; note that After now omits the Integration block and the `carried specs: none` line altogether, so if the author wants the block's verbatim carriage to be visible in the scout output, state explicitly where it is carried (outside the three judged lists, with nested lines intact) so that it does not slide back under keeps, and keep the explicit statement that the diff's four attempts contradict the body's three-attempt claim.
- pr-rework-integration-not-claims / github-copilot/gpt-6.1-sol: Before failed provenance-only because its keeps line rendered both Integration steps (operator-card update and shift-log entry) as kept requirements and judged them against the diff ('Neither operational action is implemented by the supplied diff'); After leaves the Integration block out of keeps, changes, and dropped claims entirely, so that fact now holds. Both outputs report the three-attempt claim as contradicted by the four attempts the diff allows, and neither raises a question about Integration, so those facts hold on both sides. To keep this result, retain wording that treats PR-body Integration entries as provenance to carry verbatim rather than as claims to verify or keep; note that After omits the Integration block altogether, so if the Change intends it to be carried verbatim (nested line intact), say explicitly where the scout should reproduce it outside keeps/changes/dropped claims, without diff judgment and without a question.

exit: 0
