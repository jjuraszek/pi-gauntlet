# eval report: gauntlet (partial run: ordinary-request-no-run)

for: a2e8216936cf441d144f2edb4161fb33662e06a64b7e58b65b4a74e3d1acb9e9

wall: 22s

## Change

An ordinary coding request does not enter the gauntlet, even with the entry instructions in context. Select ordinary-request-no-run to check the assistant's proposed actions before its first edit: no phase starts, no worktree is created and no step instructions are loaded. Both revisions require consent; no fact is expected to move. This tool-free sample checks the assistant's routing decision, not a live checkout.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ordinary-request-no-run | anthropic/claude-opus-5-5 | unchanged | 8175 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |
| ordinary-request-no-run | github-copilot/gpt-6.1-sol | unchanged | 4524 | tracker: holds -> holds (held); worktree: holds -> holds (held); step-read: holds -> holds (held); request: holds -> holds (held) |

## Feedback

- ordinary-request-no-run / anthropic/claude-opus-5-5: No fact moved: both outputs decline to reset trackers, start a brainstorm phase, or create a worktree, list only repo-inspection actions (search, read exporter/label source/tests/manifest, baseline test run) with no read of skills/gauntlet/ files and no workflow skill invocation, and both address the CSV export directly while offering the gauntlet as an explicit opt-in rather than treating the request as entry consent. After's explicit sentence that an ordinary implementation request doesn't start the gauntlet, plus the offer of `/skill:gauntlet` only as a user choice, delivers the Change cleanly; keep that wording. The one thing to watch is After's step 8 mention of `AGENTS.md` verification commands 'already in context' - it is fine as written because it reads no gauntlet step file, but keep it phrased as project test config so it cannot drift into loading workflow instructions.
- ordinary-request-no-run / github-copilot/gpt-6.1-sol: No fact moved: both outputs go straight to the CSV export work (locate exporter, screen label definitions, tests, baseline run) and list no phase tracker action, no worktree creation, and no read of gauntlet step instructions or workflow skill invocation. Before states the routing explicitly ('I won't start the gauntlet or create a worktree'), while After only implies it with 'I'll work in the existing checkout'; both satisfy the facts as written, since the listed actions contain nothing gauntlet-related. Reading AGENTS.md repository instructions in both is not a gauntlet step read. If you want the routing decision to stay robustly visible, keep wording that leads the assistant to say it is working directly in the existing checkout without starting a workflow, but the current After wording already preserves everything Before held.

exit: 0
