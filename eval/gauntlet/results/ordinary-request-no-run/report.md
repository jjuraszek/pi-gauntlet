# eval report: gauntlet (partial run: ordinary-request-no-run)

for: ddcbb009f7f1e1c9d3bb8b1185445141ea426e3415665e4d69479a9a0be23470

wall: 6s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ordinary-request-no-run | anthropic/claude-opus-5-5 | unchanged | 5615 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |
| ordinary-request-no-run | github-copilot/gpt-6.1-sol | unchanged | 5769 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |

## Feedback

- ordinary-request-no-run / anthropic/claude-opus-5-5: Before and After are textually identical for this case, so the wording change moved none of the four facts: both outputs explicitly decline to reset trackers or start a gauntlet phase, create no worktree, plan reads only of AGENTS.md and the exporter, label, and test files (nothing under skills/gauntlet/ and no workflow skill invocation), and address the CSV export request directly while offering the full flow only on explicit request rather than treating the fix request as entry consent. Nothing needs to change to keep these facts; the ticket-row sorting, Integration provenance, and group-ownership wording in the Change does not leak into ordinary first-turn fix requests, and it should stay scoped to the spec-writing and rework-scouting steps so that entry behavior remains untouched.
- ordinary-request-no-run / github-copilot/gpt-6.1-sol: Before and After are textually identical for this case, so nothing in the After wording moved any of the four facts: both outputs explicitly decline to start the gauntlet or reset trackers, plan no worktree, read only repository AGENTS.md files and CSV export source/tests (nothing under skills/gauntlet/), and address the CSV export request directly by locating the exporter, the on-screen column definitions, and the existing tests. The ticket-row sorting, Integration provenance, and ownership-question changes do not leak into this non-entry continuation case, which is the desired outcome; to keep it that way, keep the new wording scoped to the spec-writer and rework-scouting steps and avoid adding any language to the entry instructions that could read as implicit consent to start a workflow, read a skill step file, or provision a worktree for a plain implementation request.

exit: 0
