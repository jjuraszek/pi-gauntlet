# eval report: gauntlet (partial run: pr-rework-integration-not-claims)

for: c4a998790b00da8a2ddb379fc6330df343e3a0f6b3a3fe3e7dc43cad44ebd062

wall: 12s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-rework-integration-not-claims | anthropic/claude-opus-5-5 | improved | 5137 | contradicted-claim: holds -> holds (held); provenance-only: fails -> holds (unplanned improvement); no-question: holds -> holds (held) |
| pr-rework-integration-not-claims | github-copilot/gpt-6.1-sol | improved | 4883 | contradicted-claim: holds -> holds (held); provenance-only: fails -> holds (unplanned improvement); no-question: holds -> holds (held) |

## Feedback

- pr-rework-integration-not-claims / anthropic/claude-opus-5-5: Both outputs report the three-attempt claim as contradicted by the four attempts the diff allows (Before under changes and dropped claims, After under changes), and neither raises a question about the Integration block. The fact that moved is provenance-only: Before rendered the operator-card step and its nested shift-log line under keeps, and judged them against the diff ('the diff cannot verify them', 'the limit written on the operator card must be three'), while After leaves both Integration lines out of keeps, changes, and dropped claims entirely, so the fact holds. No fact regressed. One thing to watch: After drops the Integration block altogether rather than carrying it as provenance, which satisfies the fact as written but would lose the verbatim text if a downstream stage expects the scout to hand it on; if that matters, the wording should say to pass the Integration block through verbatim in a separate provenance-only place outside keeps/changes/dropped claims, with no judgment and no question. Keep the explicit statement that the diff allows four attempts against the stated three, since that is what holds contradicted-claim.
- pr-rework-integration-not-claims / github-copilot/gpt-6.1-sol: Before rendered the Integration block's operator-card update and its nested shift-log step under `keeps:` and judged them against the diff ("Neither operational action is implemented by the supplied diff"), which fails provenance-only; After leaves both lines out of keeps, changes, and dropped claims entirely, so that fact now holds, while the three-attempt claim is still reported as contradicted by the four attempts the diff allows and no question is raised about Integration in either output. No fact that Before kept was lost. To keep this stable, the wording should continue to state explicitly that Integration entries (including nested lines) are provenance carried verbatim elsewhere and are never judged against the diff or listed under keeps/changes/dropped claims, and never prompt a question; if you want the scout to show it saw the block, allow at most a neutral provenance mention outside those three lists rather than silence, so that omission is not mistaken for loss in later stages.

exit: 0
