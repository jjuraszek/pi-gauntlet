# eval report: gauntlet (partial run: legs-integration-sorted)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 26s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| legs-integration-sorted | anthropic/claude-opus-5-5 | improved | 8073 | moved: fails -> holds (unplanned improvement); companion-scope: fails -> holds (unplanned improvement); nonmember: fails -> holds (unplanned improvement); carried: fails -> holds (unplanned improvement) |
| legs-integration-sorted | github-copilot/gpt-6.1-sol | improved | 4929 | moved: fails -> holds (unplanned improvement); companion-scope: fails -> holds (unplanned improvement); nonmember: fails -> holds (unplanned improvement); carried: fails -> holds (unplanned improvement) |

## Feedback

- legs-integration-sorted / anthropic/claude-opus-5-5: All four facts moved from fails to holds, and Before held none of them, so nothing was lost. Before left `CI is green on the PR head` in Acceptance criteria as a pending row and asked a disposition question, so the CLI row was numbered AC 2; it also paraphrased the ticket's Integration entry into one sentence, dropping the nested `Use the release thread.` line, and copied no staging clause. After sorts without a question: the CI row goes to `## Integration` with the marker `ticket row, not an acceptance criterion: pipeline result` and gets no index, so `label-cli` claims `scope: AC 1`. The web row stays verbatim as `elsewhere: label-web` with only `on staging` copied to Integration, and the companion Integration is identical to the home section, nested line included. To keep this, hold on to the wording that numbers rows only after moved entries leave Acceptance criteria, that carries the existing Integration entry first and verbatim with its nested lines, and that copies only the external clause of a mixed row. One thing to tighten: the detached `on staging` entry carries no marker or source-row reference, so a reader of Integration alone cannot tell which row it came from; say explicitly whether a detached clause should carry one.
- legs-integration-sorted / github-copilot/gpt-6.1-sol: Before stopped at a scope-cut question about the CI row and showed none of the requested sections, so every fact fails there. After sorts without a question: the CI row moves to Integration with the `ticket row, not an acceptance criterion: pipeline result` marker and no AC index, the CLI row stays verbatim and in-scope with `label-cli` claiming `scope: AC 1` counted after the move, the web row stays verbatim with `elsewhere: label-web` while only `on staging` is copied to Integration, and the companion Integration is an identical copy including the nested release-thread line. Nothing Before held was lost. To keep this stable, keep the wording that indices are counted after sorting and that the companion carries Integration verbatim; consider also stating that a detached mixed-row clause should carry a kind marker like moved whole rows do, since After's bare `- on staging` entry is unmarked and could fail a stricter reading of per-entry kind marking.

exit: 0
