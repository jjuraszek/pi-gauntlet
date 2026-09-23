---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees with smart directory selection and safety verification
---

> **Related skills:** Set up **before** `/skill:brainstorming` — the spec is the worktree's first commit, not a separate one on `main`. Execute with `/skill:subagent-driven-development`. Clean up with `/skill:finishing-a-development-branch`.

# Using Git Worktrees

## Overview

Git worktrees create isolated workspaces sharing the same repository, allowing work on multiple branches simultaneously without switching.

**Core principle:** Detect existing isolation first → prefer the project's native tool → default to `<repo>/.worktrees/<branch>`, creating it if missing.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Step 0 — Detect Existing Isolation (REQUIRED)

Before doing anything else, check whether you are **already** inside an isolated worktree. Creating a worktree inside another worktree, or inside a submodule, produces silent corruption.

```bash
read -r GIT_DIR GIT_COMMON <<<"$(git rev-parse --path-format=absolute --git-dir --git-common-dir | tr '\n' ' ')"
ROOT=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")
CURRENT_BRANCH=$(git branch --show-current)
```

**Submodule guard:** `GIT_DIR != GIT_COMMON` is also true inside git submodules. Before concluding "already in a worktree," verify you are not in a submodule:

```bash
# If this returns a path, you're in a submodule, not a worktree — treat as normal repo
git rev-parse --show-superproject-working-tree 2>/dev/null
```

**If `GIT_DIR != GIT_COMMON` (and not a submodule):** The session already runs inside a linked worktree. Its `$GIT_DIR` is `<primary>/.git/worktrees/<name>`, and `$GIT_DIR/gitdir` contains `<worktree>/.git`, so derive its full path:

```bash
WORKTREE=$(dirname "$(cat "$GIT_DIR/gitdir")")
```

Use `$WORKTREE`, report it in the Step 4 shape (`Worktree ready at <that path>`), create nothing, and continue at Step 3 against that path.

**If `GIT_DIR == GIT_COMMON` (or in a submodule):** You are in the primary checkout. Proceed to Step 1.

## Step 1 — Announce, Don't Ask (skill-driven work defaults to a worktree)

For gauntlet-driven work — brainstorming, plans, implementation — the worktree is the default, not a question. Announce and proceed:

> "Setting up an isolated worktree at `<path>` on branch `<branch>` for this work."

Pause for explicit consent **only** when one of these holds:
- A trivial one-off the user named (typo, format run, dependency bump)
- The user already set up a workspace, or asked to work in place
- The sandbox can't support multiple checkouts (see Sandbox fallback)

Otherwise create it. The gate is "is this real work?", not "did the user approve this worktree?"

## Step 1a — Prefer Native Worktree Tools

Do you already have a way to create a worktree? It might be a tool with a name like `EnterWorktree`, `WorktreeCreate`, a `/worktree` command, or a `--worktree` flag. If you do, run the Step 3 clean-base check in the source checkout *before* invoking it, then use it and skip to Step 3.

Native tools handle directory placement, branch creation, and cleanup automatically. Using `git worktree add` when you have a native tool creates phantom state your harness can't see or manage.

**If your project ships a wrapper script instead of a native tool** (commonly `script/worktree`, `bin/worktree`, or similar — check `AGENTS.md`, the repo root, and `script/` / `bin/`), use the wrapper. A typical wrapper handles:
- Sibling-worktree placement under a project-conventional path
- Tool-trust setup (e.g. `mise trust`, `direnv allow`)
- Subproject dependency install (`bundle install`, `uv sync`, `npm install`)
- Isolated dev/test DB provisioning where the runtime needs it
- Branch naming conventions (e.g. `<user>/<name>`)

**Do not call `git worktree add` directly when a native tool or wrapper exists.** Only proceed to Step 2 if neither is available.

## Step 2 — Fallback: Manual Worktree Creation

Only when no native tool exists:

### 2a. Pick a location

The canonical home is `<repo>/.worktrees/<branch>`. A project override or wrapper may define another path; otherwise use the canonical home. Do not ask local-vs-global or invent another path.

### 2b. Create - gitignore the home first

Run the Step 3 clean-base check in the source checkout before this sequence. `.worktrees/` must be gitignored before a worktree lands inside it.

```bash
# ROOT is the primary checkout derived in Step 0.
BRANCH=<new feature branch name>
if git -C "$ROOT" worktree list --porcelain | grep -qx "worktree $ROOT/.worktrees/$BRANCH"; then
  : # already exists - emit the Step 4 report, add nothing
else
  if ! git -C "$ROOT" check-ignore -q .worktrees; then
    echo ".worktrees/" >> "$ROOT/.gitignore"
    git -C "$ROOT" add .gitignore && git -C "$ROOT" commit -m "Ignore .worktrees/" -- .gitignore
  fi
  git -C "$ROOT" worktree add "$ROOT/.worktrees/$BRANCH" -b "$BRANCH"
fi
WORKTREE="$ROOT/.worktrees/$BRANCH"
```

The process cwd never changes. `$WORKTREE` is the value every later step carries; do not `cd` into it.

### 2c. Run project setup

```bash
(cd "$WORKTREE" && {
  if   [ -f pnpm-lock.yaml ]; then pnpm install
  elif [ -f yarn.lock ];      then yarn install
  elif [ -f package.json ];   then npm install
  fi
  [ -f Cargo.toml ]      && cargo build
  [ -f pyproject.toml ]  && uv sync
  [ -f Gemfile ]         && bundle install
  [ -f go.mod ]          && go mod download
})
```

### 2d. Sandbox fallback

If worktree creation fails on permissions (read-only filesystem, container sandbox without write to parent dirs): stop, announce the failure, and continue in the current directory on a feature branch.

Working in place is a degraded mode for this skill only; `/skill:finishing-a-development-branch` requires a worktree path and does not finish an in-place branch.

## Step 3 — Verify Clean Base

The check: bare `git status --porcelain` — untracked files count as dirty. Never `--untracked-files=no` / `-uno`. Empty output means clean only when the command exits 0; a nonzero exit is an error to surface — stop; never treat a failed check as "clean".

**When and where it runs:**

- **Fresh creation (Steps 1a/2):** in the source checkout, **before** invoking the wrapper (Step 1a) or the `git worktree add` sequence (Step 2b), as `git -C "$ROOT" status --porcelain`.
- **Already in a worktree (Step 0):** on arrival at this step, as `git -C "$WORKTREE" status --porcelain`.

**Clean** → proceed (create the worktree if not yet created, then Step 4).

**Dirty** → report the porcelain output verbatim and ask whether to clean up first (stash/commit) or proceed. Never run tests as a fallback; never auto-stash or auto-clean. On fresh paths the ask is about base hygiene — a user who *meant* the dirt to be part of the base commits it, and creation proceeds from the new HEAD. On the Step 0 path the ask is "continue working in a dirty workspace?" — the dirt is already in the workspace, not merely beside it.

**Provenance note (report-only, never a gate).** Fresh-creation paths only — never Step 0 (an already-linked worktree was branched in some earlier invocation; there is no "created from" to compare this run). Resolve the default branch as `git symbolic-ref --short refs/remotes/origin/HEAD` with the leading `origin/` stripped; compare that short name to the source checkout's `git branch --show-current`. If they differ and the user did not name a base in the request, append one declarative line to the Step 4 report: `Note: branching from <ref>, not <default>.` — execution continues, no confirmation is awaited. If resolution fails (no remote, no `origin/HEAD`), skip the note silently. No other default-branch machinery.

## Step 4 — Report Location

```
Worktree ready at <full-path>
Branch: <branch-name>
Base: <ref> (clean)
Ready to implement <feature>
```

When the user chose to proceed past a dirty source, the base line is `Base: <ref> (dirty - proceeded after ask)` instead. When the provenance check fired (fresh paths only), append its `Note: branching from <ref>, not <default>.` line after the base line. `<ref>` per path: fresh creation — the branch/commit the worktree was created from (the user-requested base when one was given); Step 0 — the current branch/HEAD of the existing worktree, with no provenance line.

Every later skill takes `<full-path>` as a value: dispatch `cwd: "<full-path>"`, `git -C <full-path> ...`, or `(cd "<full-path>" && <cmd>)` for other cwd-bound commands. Never change the process cwd.

## Detached HEAD

If `git symbolic-ref -q HEAD` returns nothing, you're on a detached HEAD. Do not create a worktree from this state — first ask the user whether to branch from the current commit or from `main`.

## Keeping a Worktree Current

For longer-running work the base branch advances:

```bash
git -C "$WORKTREE" fetch origin
git -C "$WORKTREE" rebase origin/main    # or merge if branch is shared
```

Re-run tests after rebasing.

## Quick Reference

| Situation | Action |
|---|---|
| `GIT_DIR != GIT_COMMON` | Already in worktree - report its path, create nothing |
| Worktree path already listed by `git worktree list` | Report it, create nothing |
| `git rev-parse --show-superproject-working-tree` returns a path | Submodule — treat as normal repo |
| Project-native wrapper exists | Use the wrapper (commonly `script/worktree create`) |
| No native tool | Create `<repo>/.worktrees/<branch>` (gitignore `.worktrees/` first) |
| Detached HEAD | Ask before branching |
| Sandbox/permission failure | Work in place on a feature branch |
| Source checkout dirty | Report + ask |

## Red Flags — STOP

- About to run `git worktree add` from inside a worktree (`GIT_DIR != GIT_COMMON`)
- About to `cd` into the worktree (carry the path instead)
- About to call `git worktree add` directly when the project ships a wrapper (use the wrapper)
- Created a `.worktrees/` worktree without gitignoring `.worktrees/` first
- Placed a worktree outside `.worktrees/` (or the project's configured path) for no reason
- Source checkout dirty and you proceed without asking
- About to run a test suite during worktree creation

## Integration

**Called by:**
- `/skill:brainstorming` — **before** writing the spec; the spec is the worktree's first commit
- `/skill:subagent-driven-development` — required before any implementation tasks
- Any skill needing isolated workspace

**Pairs with:**
- `/skill:finishing-a-development-branch` — REQUIRED for cleanup. Default finish squashes the worktree's full history into a single commit on `main`. If the worktree was created by a project-native wrapper, cleanup defers to the wrapper's destroy command.

**Note:** Trivial one-off edits the user explicitly asks for (e.g. "fix this typo") do not require a worktree. Everything else — specs, plans, implementation — belongs in a worktree from the first artifact onward.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.
