# eval report: gauntlet (partial run: legs-integration-sorted)

for: c4a998790b00da8a2ddb379fc6330df343e3a0f6b3a3fe3e7dc43cad44ebd062

wall: 29s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| legs-integration-sorted | anthropic/claude-opus-5-5 | improved | 8428 | moved: fails -> holds (unplanned improvement); companion-scope: fails -> holds (unplanned improvement); nonmember: fails -> holds (unplanned improvement); carried: fails -> holds (unplanned improvement) |
| legs-integration-sorted | github-copilot/gpt-6.1-sol | improved | 8231 | moved: fails -> holds (unplanned improvement); companion-scope: fails -> holds (unplanned improvement); nonmember: fails -> holds (unplanned improvement); carried: fails -> holds (unplanned improvement) |

## Feedback

- legs-integration-sorted / anthropic/claude-opus-5-5: All four facts moved from fails to holds, and Before held none of them, so there is nothing to preserve. Before left `CI is green on the PR head` in Acceptance criteria behind a disposition question, kept original indices (`label-cli` at `scope: AC 2`, `labels` at `scope: AC 1`), paraphrased the ticket's Integration entry into one sentence so the nested `Use the release thread.` line was lost, and never detached the staging clause. After sorts before counting: the CI row sits in Integration with the `ticket row, not an acceptance criterion: pipeline result` marker and no index, the CLI row stays verbatim and in-scope with `label-cli` at `scope: AC 1`, the web row stays whole with `elsewhere: label-web` while only `on staging` is copied to Integration, and the companion's Integration is identical to the home section, including the nested line, the moved row with its marker and the detached clause. To keep this, retain the wording that makes sorting precede indexing, that copies existing Integration entries first with nested lines intact, and that has the companion copy the home section verbatim. Two optional tightenings: the detached clause appears as a bare `- on staging` with no marker or pointer to its source row, and the `labels` leg reads `scope: none`; if either is intended, state it explicitly in the wording so it stays stable across runs.
- legs-integration-sorted / github-copilot/gpt-6.1-sol: Before stopped at a scope-cut question about the `CI is green on the PR head` row and rendered no spec sections, so all four facts fail there. After sorts without a question and all four facts hold. The CI row sits in Integration with the `pipeline result` marker and no AC index. The CLI row stays verbatim and in-scope, and `label-cli` claims `scope: AC 1`, counted after the move. The web row stays verbatim with `elsewhere: label-web`, and only `on staging` is copied to Integration. The companion Integration matches the home section line for line, including the nested release-thread line. No fact that Before kept was lost, since Before kept none. To keep this stable, the wording should continue to say explicitly that indices are counted after moved rows leave Acceptance criteria, that sorting a pipeline-result row is classification and not a scope cut (so no question is asked), and that the companion copies Integration verbatim, nested lines included. One fragility: the detached clause `- on staging` carries no kind marker or pointer back to its source row, unlike the moved CI row. If the wording intends a marker on detached clauses, say so explicitly; otherwise this bare form may vary between runs.

exit: 0
