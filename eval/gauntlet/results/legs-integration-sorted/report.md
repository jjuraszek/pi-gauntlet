# eval report: gauntlet (partial run: legs-integration-sorted)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 24s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| legs-integration-sorted | anthropic/claude-opus-5-5 | improved | 7151 | moved: fails -> holds (unplanned improvement); companion-scope: fails -> holds (unplanned improvement); nonmember: fails -> holds (unplanned improvement); carried: fails -> holds (unplanned improvement) |
| legs-integration-sorted | github-copilot/gpt-6.1-sol | improved | 6284 | moved: fails -> holds (unplanned improvement); companion-scope: fails -> holds (unplanned improvement); nonmember: fails -> holds (unplanned improvement); carried: fails -> holds (unplanned improvement) |

## Feedback

- legs-integration-sorted / anthropic/claude-opus-5-5: After moved all four facts. The sort-then-count wording made the writer take `CI is green on the PR head` out of Acceptance criteria into Integration with the `ticket row, not an acceptance criterion: pipeline result` marker and no AC index, where Before kept it as row 1 and asked a disposition question. That in turn let `label-cli` claim `scope: AC 1` on the verbatim, in-scope CLI row instead of AC 2. The mixed web row stays verbatim with `elsewhere: label-web` and only `on staging` is copied to Integration; Before left the clause in place. The companion Integration is now a byte-for-byte copy of the home section, including the nested `Use the release thread.` line, the moved row with its marker, and the detached clause; Before paraphrased the ticket entry into one sentence and dropped the nesting. Before held none of these facts, so nothing was lost. To keep the gains stable, keep explicit wording that indices are counted only over surviving rows, that an existing Integration entry is carried first with nested lines intact, and that the companion copy is verbatim rather than summarised. One loose end: the scope check says the unclaimed `elsewhere:` row 'defaults to home' and then says no leg delivers it; a sentence stating that `elsewhere:` rows are claimed by no leg would remove that near-contradiction without affecting any fact.
- legs-integration-sorted / github-copilot/gpt-6.1-sol: Before stops at a scope-cut question about the `CI is green on the PR head` row and recommends ticket repair, so it produces no Acceptance criteria, Integration, leg scopes, or companion section and all four facts fail there. After sorts without a question: the CI row sits in Integration with the `pipeline result` marker and is absent from Acceptance criteria, the CLI row stays verbatim and in-scope with `label-cli` claiming `scope: AC 1` counted after the move, the web row stays verbatim with `elsewhere: label-web` while only `on staging` is copied to Integration, and the companion Integration is a byte-for-byte copy of the home section including the nested `Use the release thread.` line. No fact that Before held was lost, so nothing needs to be restored. To keep this stable, keep the wording that says moved rows are sorted before indexing and get no AC index, and that the companion carries Integration verbatim. One thing to consider tightening: the detached clause appears as a bare `- on staging` with no kind marker or pointer back to its source row, unlike the moved CI row; if you want mixed-row clauses marked consistently, say so explicitly in the wording, otherwise a reader may not know where the clause came from.

exit: 0
