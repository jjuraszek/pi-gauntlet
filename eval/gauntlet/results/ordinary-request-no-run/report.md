# eval report: gauntlet (partial run: ordinary-request-no-run)

for: eaabe1071ee7efc5abe91e7a7d3fda55c6a29db6a501bec4cf2e2622ccdfac97

wall: 16s

## Change

An ordinary coding request does not enter the gauntlet, even with the entry instructions in context. Select ordinary-request-no-run to check the assistant's proposed actions before its first edit: no phase starts, no worktree is created and no step instructions are loaded. Both revisions require consent; no fact is expected to move. This tool-free sample checks the assistant's routing decision, not a live checkout. For handoff-follows-pointer, the completion reply supplies the next file. A read-only replay resumes with that tool result in history. Only the file provides the receipt; a narrated read cannot pass.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ordinary-request-no-run | anthropic/claude-opus-5-5 | unchanged | 5343 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |
| ordinary-request-no-run | github-copilot/gpt-6.1-sol | unchanged | 4233 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |

## Feedback

- ordinary-request-no-run / anthropic/claude-opus-5-5: No fact moved: both outputs decline to reset trackers, start a phase, or create a worktree, list only repo-search, read, and test-baseline actions targeting the CSV exporter, label source, tests, and manifest (nothing under skills/gauntlet/ and no skill invocation), and offer the workflow only as an opt-in the user must explicitly request, so the request is addressed directly and not treated as entry consent. After's wording differs only in naming `/skill:gauntlet` instead of `/skill:brainstorming` as the opt-in and in stating it will work in the current checkout; both are mentions of an option, not invocations. To keep all four facts stable, keep the explicit 'not a gauntlet run / no tracker reset / no worktree' statement, keep the workflow offer phrased as a conditional the user must trigger, and keep the pre-edit action list restricted to project files so no step-instruction read or skill invocation can slip in.
- ordinary-request-no-run / github-copilot/gpt-6.1-sol: Nothing moved on this case: both Before and After treat the CSV export request as ordinary direct work, explicitly decline to start the gauntlet or create a worktree, list only status checks, AGENTS.md reads, source/test searches and reads as pre-edit actions, and neither reads anything under skills/gauntlet/ nor invokes a workflow skill or phase tracker. After differs only in tool naming (`terminal` vs `bash`), splitting locate/read into separate steps, and dropping the baseline test run, none of which touches a fact. To keep all four facts, preserve the wording that an ordinary coding request with entry instructions in context still requires explicit consent before any phase start, worktree creation, or step-instruction read, so the assistant keeps routing straight to locating the exporter and its tests.

exit: 0
