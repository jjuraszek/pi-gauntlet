# eval report: gauntlet (partial run: ordinary-request-no-run)

for: 0866b31cea705429fd0576541ea992ecc59a31985f22f572cb2aa10c9c0ba88f

wall: 17s

## Change

An ordinary coding request does not enter the gauntlet, even with the entry instructions in context. Select ordinary-request-no-run to check the assistant's proposed actions before its first edit: no phase starts, no worktree is created and no step instructions are loaded. Both revisions require consent; no fact is expected to move. This tool-free sample checks the assistant's routing decision, not a live checkout. For handoff-follows-pointer, the completion reply supplies the next file. A read-only replay resumes with that tool result in history. Only the file provides the receipt; a narrated read cannot pass.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ordinary-request-no-run | anthropic/claude-opus-5-5 | unchanged | 5248 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |
| ordinary-request-no-run | github-copilot/gpt-6.1-sol | unchanged | 4081 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |

## Feedback

- ordinary-request-no-run / anthropic/claude-opus-5-5: No fact moved: both outputs decline to reset trackers, start a brainstorm or other gauntlet phase, or create a worktree; neither lists any read of a file under skills/gauntlet/ or a workflow skill invocation among its pre-edit actions; and both go straight to locating the CSV exporter, the on-screen label source and the existing tests, while offering the workflow only as an explicit opt-in rather than treating the request as entry consent. After's wording delivers the Change cleanly: it states that an ordinary implementation request does not start the gauntlet and names the opt-in (`/skill:gauntlet`) without invoking it. To keep this stable, retain the explicit statement that an ordinary request is not entry consent, keep the opt-in phrased as something the user must say rather than something the assistant does, and keep the pre-edit action list limited to project files (exporter, label source, tests, manifest) so no step-instruction read or tracker action can creep in. After's added `git status` step and its stop-and-tell condition are harmless to these facts.
- ordinary-request-no-run / github-copilot/gpt-6.1-sol: No fact moved: both outputs treat the CSV export request as ordinary implementation work, list only checkout, AGENTS.md, exporter, label-source and test reads before the first edit, and explicitly decline to start the gauntlet or create a worktree; neither takes a tracker action nor reads anything under skills/gauntlet/. After's wording keeps everything Before kept. The only slight softening is 'would not start the gauntlet or create its dedicated worktree', which a reader could take as leaving room for some other worktree; saying 'no worktree' outright, as Before did, would keep the worktree fact unambiguous, and keeping the explicit statement that no gauntlet phase starts continues to protect the tracker and step-read facts.

exit: 0
