# eval report: gauntlet (partial run: ordinary-request-no-run)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 8s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ordinary-request-no-run | anthropic/claude-opus-5-5 | unchanged | 7065 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |
| ordinary-request-no-run | github-copilot/gpt-6.1-sol | unchanged | 6696 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |

## Feedback

- ordinary-request-no-run / anthropic/claude-opus-5-5: None of the four facts moved: both outputs treat the CSV request as a direct fix, explicitly decline to reset trackers, start brainstorm or create a worktree, list only repo-level grep/read/bash actions (the After's added read of the root AGENTS.md is project configuration, not a file under skills/gauntlet/), and offer the workflow only as an opt-in the user must ask for rather than treating the request as entry consent. The After wording's changes to ticket-row sorting, Integration provenance and ownership questions did not leak into this first-turn entry behaviour. To keep it that way, leave the entry rule's wording intact so that an ordinary fix request does not start a phase, read step files or provision a worktree, and keep the new sorting and Integration rules scoped to the spec-writing and rework-scouting steps so they are not read as actions to take at session start.
- ordinary-request-no-run / github-copilot/gpt-6.1-sol: No fact moved on this sample: both outputs treat the CSV export request as a direct implementation task, list only checkout, AGENTS.md, exporter/label source and test reads before the first edit, and take no tracker action, create no worktree, and read nothing under skills/gauntlet/. The only visible difference is cosmetic: Before explicitly says it will not create a worktree, while After instead says it will not reset the gauntlet trackers and drops the worktree mention; After still holds because it arranges no worktree, but the fact is now satisfied by omission rather than by statement. To keep all four facts robustly while delivering the ticket-row sorting and Integration-provenance changes, keep those new rules scoped to the spec-writing and rework-scouting steps so they are not read as applying at session entry, and leave the entry wording that says a plain implementation request does not start a phase, reset trackers, create a worktree, or load workflow step files unchanged.

exit: 0
