# eval report: gauntlet (partial run: ordinary-request-no-run)

for: 10ff9e3c41e88f0da44627885819a821802f2b52d6c860ba2a991f76f5a50799

wall: 8s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ordinary-request-no-run | anthropic/claude-opus-5-5 | unchanged | 7465 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |
| ordinary-request-no-run | github-copilot/gpt-6.1-sol | unchanged | 7712 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |

## Feedback

- ordinary-request-no-run / anthropic/claude-opus-5-5: None of the four facts moved: both outputs treat the request as a direct fix, explicitly decline to reset trackers, start brainstorm or create a worktree, list only repo searches, reads of the exporter, label source, tests and manifest, and a baseline test run before the first edit, and never read or invoke anything under skills/gauntlet/. After still only offers the workflow as an opt-in the user must type (`/skill:gauntlet`), which matches the fact's allowance for asking for explicit choice rather than treating the request as entry consent. The ticket-row sorting and constraint-row wording in the Change does not surface in this first-turn case, so nothing needs adjusting to keep these facts; just keep the entry text clear that a plain implementation request is not consent to enter a workflow and that the workflow is mentioned only as an offer, not invoked or read.
- ordinary-request-no-run / github-copilot/gpt-6.1-sol: No fact moved between Before and After on this case. Both outputs treat the CSV export request as a direct implementation task, explicitly decline to start the gauntlet workflow or create a worktree, and list only status checks, AGENTS.md reads, and exporter, label and test discovery before the first edit. Neither takes a tracker action or reads anything under skills/gauntlet/. The After wording's ticket-row sorting and constraint-row changes do not leak into this plain first-turn request, which is the desired result. To keep it that way, keep the new sorting and companion-carry rules scoped to the spec-writing stage, so they cannot be read as a trigger to enter the workflow, read a step file, or touch the tracker when a user simply asks for a code fix without consenting to the workflow.

exit: 0
