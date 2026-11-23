---
name: pr-checklist
description: Use before opening a pull request to run the project's pre-merge checks.
---

# PR Checklist

## Overview

Run the checks and report each as pass or fail.

## Procedure

1. Read `reference/checks.md` now.
2. Run every check it lists, in order.
3. Report one line per check: `<name>: pass|fail - <evidence>`.
4. Stop. The reviewer decides.

## Project overrides

If `gauntlet.md` exists - checked in order: `.pi/gauntlet.md`, `<repo root>/gauntlet.md`, `<repo root>/doc/gauntlet.md`; first found wins - read it. Skip the read only when the file from the same repository at the same trusted revision is already in context. Apply, without a relevance judgment, these sections of `# shared`: `## issue-tracker`, `## worktrees`, `## verification`, `## cleanup`, `## siblings`, `## deployment`, `## spec-index`. Apply the whole `# pr-checklist` block. Apply nothing else from the file: no other block, no text directly under `# shared`, no other section of `# shared`.
