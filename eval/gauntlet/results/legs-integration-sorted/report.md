# eval report: gauntlet (partial run: legs-integration-sorted)

for: ddcbb009f7f1e1c9d3bb8b1185445141ea426e3415665e4d69479a9a0be23470

wall: 24s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| legs-integration-sorted | anthropic/claude-opus-5-5 | unchanged | 5916 | moved: holds -> holds (held); companion-scope: holds -> holds (held); nonmember: holds -> holds (held); carried: holds -> holds (held) |
| legs-integration-sorted | github-copilot/gpt-6.1-sol | unchanged | 5059 | moved: holds -> holds (held); companion-scope: holds -> holds (held); nonmember: holds -> holds (held); carried: holds -> holds (held) |

## Feedback

- legs-integration-sorted / anthropic/claude-opus-5-5: Both outputs satisfy all four facts and the authored sections are textually identical: the CI row sits in Integration with the `ticket row, not an acceptance criterion: pipeline result` marker and is absent from the numbered checkbox rows; the CLI row is verbatim, `in-scope`, and `label-cli` claims `scope: AC 1` counted over the two surviving rows; the web row is verbatim with `elsewhere: label-web` and only `on staging` is copied to Integration; the companion Integration repeats the home section including the nested release-thread line, the moved row with its marker, and the detached clause. Nothing in After moved a fact. After's explicit statement that there are 2 checkbox rows and that the companion section is copied verbatim because home has it makes the post-sort counting and carry rule clearer than Before's 'count both checkbox rows in order'; keep that wording. To stay safe, keep stating that moved rows get no AC index and keep the unmarked external clause as a separate final Integration item, and consider dropping the 'AC 2 is unlisted, so it defaults to home. It stays cut as `elsewhere:`' phrasing, since calling an `elsewhere:` row 'cut' right before saying `Scope cuts: none` could read as contradictory.
- legs-integration-sorted / github-copilot/gpt-6.1-sol: All four facts hold in both outputs: each moves `CI is green on the PR head` to Integration with the `pipeline result` marker and no AC index, keeps the CLI row verbatim and in-scope with `label-cli` claiming `scope: AC 1` counted after the move, keeps the web row verbatim with `elsewhere: label-web` while copying only `on staging` to Integration, and gives the companion an identical Integration block with the nested release-thread line intact. The After wording did not move any fact on this sample; its only visible differences are the explicit sentence that the moved row consumes no AC index and that the web row is AC 2 owned elsewhere, plus the reordering of Integration ahead of Legs, which makes the post-sort counting easier to verify. To keep these facts stable, keep the wording that counts rows only after sorting, that copies just the external clause of a mixed row while leaving the row verbatim, and that the companion Integration is a verbatim copy including nested lines and markers; note the detached clause `on staging` is carried without a kind marker in both outputs, so if you want that marked, say so explicitly.

exit: 0
