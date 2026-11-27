# eval report: gauntlet (partial run: legs-integration-sorted)

for: 3191f38ab378b94b1d2b9a3ae80c903ca709ebdda14ab2e3f63e6706a8d8f696

wall: 22s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| legs-integration-sorted | anthropic/claude-opus-5-5 | unchanged | 5147 | moved: holds -> holds (held); companion-scope: holds -> holds (held); nonmember: holds -> holds (held); carried: holds -> holds (held) |
| legs-integration-sorted | github-copilot/gpt-6.1-sol | unchanged | 5573 | moved: holds -> holds (held); companion-scope: holds -> holds (held); nonmember: holds -> holds (held); carried: holds -> holds (held) |

## Feedback

- legs-integration-sorted / anthropic/claude-opus-5-5: Both outputs satisfy all four facts and produce identical authored sections: the CI row moves to Integration with the `ticket row, not an acceptance criterion: pipeline result` marker and no AC index, the CLI row stays verbatim and in-scope with `label-cli` claiming `scope: AC 1` counted after the move, the web row stays verbatim with `elsewhere: label-web` while only `on staging` is copied to Integration, and the companion Integration is a verbatim copy including the nested release-thread line. The After wording moved no fact here; the only differences are ordering (sections first, sorting notes after) and a minor heading-case change (`Acceptance criteria` vs `Acceptance Criteria` in the provenance line). To keep these facts stable, retain the explicit instruction that indices are counted over surviving checkbox rows after moved rows leave, that moved entries get no index, and that the companion carries Integration verbatim; consider keeping Before's explicit statement of which row is AC 1 and AC 2, since After only says the numbers 'count both checkbox rows in order', which is slightly less explicit about the post-move counting.
- legs-integration-sorted / github-copilot/gpt-6.1-sol: Nothing moved on this case: both outputs put `CI is green on the PR head` in Integration with the `ticket row, not an acceptance criterion: pipeline result` marker and no AC index, keep the CLI row verbatim and in-scope with `label-cli` claiming `scope: AC 1` counted after the move, keep the mixed web row verbatim with `elsewhere: label-web` while copying only `on staging` into Integration, and give the companion an Integration block identical to the home one, including the nested `Use the release thread.` line. The After wording therefore delivers the counting-after-sorting and verbatim-companion-Integration behaviour without losing anything Before kept. Two small observations for robustness: After dropped Before's explicit sentence that AC indices count only the rows retained in Acceptance criteria, so the post-sort counting is now shown only implicitly through `scope: AC 1`; and the detached `on staging` clause carries no marker in either output, which the facts do not require but which leaves it less self-explanatory than the pipeline row. If you want the counting rule to stay visible to a reader, keep wording that prompts the writer to state the indexing basis next to the leg scopes.

exit: 0
