# eval report: gauntlet (partial run: ordinary-request-no-run)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 20s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ordinary-request-no-run | anthropic/claude-opus-5-5 | unchanged | 6440 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |
| ordinary-request-no-run | github-copilot/gpt-6.1-sol | unchanged | 5928 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |

## Feedback

- ordinary-request-no-run / anthropic/claude-opus-5-5: Neither output moved any of the four facts: both Before and After explicitly decline to reset trackers, start a brainstorm or other gauntlet phase, or create a worktree; neither lists a read of anything under skills/gauntlet/ (After adds a read of the repo-root AGENTS.md, which is project configuration, and only mentions `/skill:gauntlet` as an option the user could choose, not an invocation); and both address the CSV export directly by planning to locate the exporter, the on-screen label source, and existing tests, while offering the workflow as an explicit opt-in rather than treating the request as entry consent. To keep these facts stable while delivering the Change, keep the entry wording clear that an ordinary fix request does not start the flow and that workflow skills are only offered, never invoked or read, without the user's explicit choice; the ticket-row sorting and Integration changes should stay confined to the spec-writing step so they do not leak into first-turn behavior.
- ordinary-request-no-run / github-copilot/gpt-6.1-sol: No fact moved between Before and After: both outputs treat the CSV export request as a direct implementation task, list only checkout-status, AGENTS.md, exporter/column-definition and test reads before the first edit, and take no tracker action, create no worktree, and read nothing under skills/gauntlet/. After drops Before's explicit 'won't create a worktree' sentence and instead says it won't reset trackers; the worktree fact still holds because no action creates one, but keeping both disclaimers (no gauntlet start, no tracker reset, no worktree) would make the continuation behaviour most robust. The ticket-row sorting and Integration changes described in the Change do not surface in this case, so the current wording keeps every fact Before kept; no wording adjustment is needed for this sample.

exit: 0
