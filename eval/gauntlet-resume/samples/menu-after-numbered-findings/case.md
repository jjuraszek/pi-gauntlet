bundle+: skills/brainstorming/reference/menu-layout.md
bundle+: skills/gauntlet-resume/SKILL.md
# Input

Produce one response with two independent checkpoints. All restoration and handoffs are simulated; do not call tools or change files.

## Checkpoint 1

The human invokes `/skill:gauntlet-resume` with no arguments or pasted text. Discovery has completed. Present these three discovery observations before the candidate selection options in the same message:

1. The handoff directory exists.
2. Three regular Markdown files have valid handoff title lines.
3. Candidates are sorted newest first.

The discovered candidates, in order, are:

- Title line `# Handoff: parser retry`; worktree `/work/app/.worktrees/parser-retry`; mtime `2026-10-21T12:00:00Z`.
- Title line `# Handoff: export paging`; worktree `/work/app/.worktrees/export-paging`; mtime `2026-10-21T11:00:00Z`.
- Title line `# Handoff: cache expiry`; worktree `/work/app/.worktrees/cache-expiry`; mtime `2026-10-21T10:00:00Z`.

Generate the selection message and wait for a pick. Do not restore anything at this checkpoint.

## Checkpoint 2

Independently, the prior assistant sent this legacy message verbatim:

1. The handoff directory exists.
2. Three regular Markdown files have valid handoff title lines.
3. Candidates are sorted newest first.

1. # Handoff: parser retry - /work/app/.worktrees/parser-retry - 2026-10-21T12:00:00Z
2. # Handoff: export paging - /work/app/.worktrees/export-paging - 2026-10-21T11:00:00Z
3. # Handoff: cache expiry - /work/app/.worktrees/cache-expiry - 2026-10-21T10:00:00Z

The human replies: `5`

Write the next assistant response resolving the selection, then state the next simulated read/check step. No real restoration occurs.
