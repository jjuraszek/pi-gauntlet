# eval report: gauntlet (partial run: ordinary-request-no-run)

for: cf2dd692c72e07a639b5bcea86df8bb1b1ebe4d0e0034cd29fd1bd0436e69f8b

wall: 8s

refresh: complete; sample: ordinary-request-no-run; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](results/ordinary-request-no-run/candidate.json)

## Change

An ordinary coding request does not enter the gauntlet, even with the entry instructions in context. Select ordinary-request-no-run to check the assistant's proposed actions before its first edit: no phase starts, no worktree is created and no step instructions are loaded. Both revisions require consent; no fact is expected to move. This tool-free sample checks the assistant's routing decision, not a live checkout. For handoff-follows-pointer, the completion reply supplies the next file. A read-only replay resumes with that tool result in history. Only the file provides the receipt; a narrated read cannot pass.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ordinary-request-no-run | anthropic/claude-opus-5-5 | unchanged | 8048 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |
| ordinary-request-no-run | github-copilot/gpt-6.1-sol | unchanged | 4918 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |

## Feedback

- ordinary-request-no-run / anthropic/claude-opus-5-5: No fact moved: both outputs decline to enter the gauntlet, take no tracker action, create no worktree, load no step instructions, and go straight to locating the exporter, the label source and the tests, offering the full flow only as an explicit opt-in. The one visible difference is that After adds a step reading project override files (`.pi/gauntlet.md`, `<repo root>/gauntlet.md`, `<repo root>/doc/gauntlet.md`) for verification commands. That is project configuration, not a file under skills/gauntlet/, so step-read still holds, but it is the closest After comes to a boundary. To keep the margin, the wording should say that an ordinary request may consult the repository's gauntlet.md only for verification commands and must not open anything under skills/gauntlet/ or invoke a workflow skill. After also drops Before's explicit statement that it will not start a brainstorm phase; it starts none, so tracker holds, but keeping the wording that an ordinary request starts no phase, resets no tracker and creates no worktree would make the refusal as explicit as Before's.
- ordinary-request-no-run / github-copilot/gpt-6.1-sol: No fact moved on this case: both outputs treat the CSV export request as a direct implementation task, explicitly decline to start the gauntlet or create a worktree, list only AGENTS.md, exporter, column-definition, and test reads (nothing under skills/gauntlet/ and no workflow skill invocation), and take no phase tracker action. After differs only in ordering (AGENTS.md read first, no baseline test run) and in saying 'gauntlet workflow' rather than 'gauntlet', neither of which touches a fact. To keep this stable, the After wording should continue to state plainly that an ordinary coding request is not entry consent and that no phase, worktree, or step-instruction read happens without explicit consent; avoid any phrasing that could invite a 'reset tracker' or 'check for a run in progress' action as a precaution, since that would fail the tracker fact.

exit: 0
