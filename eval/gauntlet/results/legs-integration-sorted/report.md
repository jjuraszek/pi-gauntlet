# eval report: gauntlet (partial run: legs-integration-sorted)

for: 26d1c1f3e56ec9aa53ab90ddeed921b06ff3c19296da7ff12b5341e3cd1f9b91

wall: 23s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| legs-integration-sorted | anthropic/claude-opus-5-5 | unchanged | 5624 | moved: holds -> holds (held); companion-scope: holds -> holds (held); nonmember: holds -> holds (held); carried: holds -> holds (held) |
| legs-integration-sorted | github-copilot/gpt-6.1-sol | unchanged | 5880 | moved: holds -> holds (held); companion-scope: holds -> holds (held); nonmember: holds -> holds (held); carried: holds -> holds (held) |

## Feedback

- legs-integration-sorted / anthropic/claude-opus-5-5: No fact moved on this case: both outputs move `CI is green on the PR head` to Integration with the `pipeline result` marker and no AC index, keep the CLI row verbatim and `in-scope` with `label-cli` claiming `scope: AC 1` counted after the move, keep the web row verbatim with `elsewhere: label-web` while copying only `on staging` to Integration, and give the companion a verbatim copy of the home Integration section including the nested `Use the release thread.` line, the moved row with its marker, and the detached clause. The After wording therefore preserves everything Before kept. One drift worth tightening: After adds that AC 2 'appears in no leg's scope, so under the scope grammar it defaults to home', which sits awkwardly beside its `elsewhere: label-web` disposition and could be read as home owning a nonmember row; Before's phrasing ('counted in the numbering but no leg claims it') is cleaner. To keep these facts stable, state explicitly that an `elsewhere:` row is counted for indexing but claimed by no leg and does not default to home, and keep the instruction that the companion copies the home Integration section unchanged, nested lines included.
- legs-integration-sorted / github-copilot/gpt-6.1-sol: No fact moved: both outputs place `CI is green on the PR head` in Integration with the `pipeline result` marker and no AC index, keep the CLI row verbatim and in-scope with `label-cli` claiming `scope: AC 1` counted after the move, keep the web row verbatim with `elsewhere: label-web` while copying only `on staging` to Integration, and give the companion an identical Integration section including the nested release-thread line. After's explicit sentence that AC indices count only the retained checkbox rows makes the post-sort counting clearer than Before, which only implied it via 'Its row retains index AC 2'; keep that wording. To protect these facts going forward, keep the instruction that moved entries get no index stated next to the counting rule, and keep the companion carry phrased as a verbatim copy of the whole home Integration section (existing entries with nested lines first, then moved rows with their markers, then detached clauses) so that neither the nested line nor the marker is dropped. One optional tightening: the detached `on staging` clause carries no marker or source pointer in either output, so if the author wants it traceable to its mixed row, the wording should say so explicitly rather than rely on the model's choice.

exit: 0
