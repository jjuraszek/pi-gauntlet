# eval report: gauntlet (partial run: ordinary-request-no-run)

for: 3191f38ab378b94b1d2b9a3ae80c903ca709ebdda14ab2e3f63e6706a8d8f696

wall: 8s

refresh: complete; sample: ordinary-request-no-run; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](candidate.json)

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ordinary-request-no-run | anthropic/claude-opus-5-5 | unchanged | 7370 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |
| ordinary-request-no-run | github-copilot/gpt-6.1-sol | unchanged | 7547 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |

## Feedback

- ordinary-request-no-run / anthropic/claude-opus-5-5: Neither output moved a fact: both Before and After decline to reset trackers, start a brainstorm phase, or create a worktree, both list only repo-level grep/read/bash actions aimed at the exporter, its label source, and its tests (After's added read of the root AGENTS.md is project configuration, not a file under skills/gauntlet/), and both address the CSV request directly while offering the workflow only as an explicit opt-in rather than treating the request as entry consent. To keep these four facts stable while delivering the Change, leave the entry wording that says an ordinary fix request does not start the flow untouched, keep the workflow mention as an offer the user must choose (naming a skill command is fine, invoking it is not), and avoid any wording that would prompt a pre-edit read of a skills/gauntlet/ step file or a tracker action on a first-turn fix request.
- ordinary-request-no-run / github-copilot/gpt-6.1-sol: Neither output moved a fact: both treat the CSV export request as a direct implementation task, plan to locate the exporter, on-screen column definitions and tests, and take no tracker action, create no worktree, and read nothing under skills/gauntlet/ (only AGENTS.md files and project source/tests). The one small difference is that Before explicitly says it will not create a worktree while After says it will not start the gauntlet or reset its trackers and is silent on worktrees; After still holds because it lists no worktree action, but keeping an explicit statement such as 'I won't start the gauntlet, reset its trackers, or create a worktree' would make all three negative facts robust. The ticket-row sorting and Integration provenance wording in the Change does not appear to leak into this direct-request path, so no further wording adjustment is needed for this case.

exit: 0
