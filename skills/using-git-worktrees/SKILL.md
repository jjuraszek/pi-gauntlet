---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees with smart directory selection and safety verification
---

> **Related skills:** Set up **before** `/skill:brainstorming` — the spec is the worktree's first commit, not a separate one on `main`. Execute with `/skill:subagent-driven-development`. Clean up with `/skill:finishing-a-development-branch`.

# Using Git Worktrees

## Overview

Git worktrees create isolated workspaces sharing the same repository, allowing work on multiple branches simultaneously without switching.

**Core principle:** Detect existing isolation first → prefer the project's native tool → default to `<repo>/.worktrees/<name>`, creating it if missing.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Step 0 — Detect Existing Isolation (REQUIRED)

Accept caller-supplied `$ROOT` and `$BRANCH` without replacing them from session
state. Root isolation detection, clean-base, overrides/settings reads, wrapper
discovery and creation in `$ROOT`. For a coordinated member, require its own
primary as `$ROOT`; never reuse session isolation as another leg. Create a fresh
member tree even when the session is linked. Without caller inputs, derive the
primary as below and choose the feature branch by the existing convention.

For a caller passing resolved PR values for home, read [reference/pr-head.md](reference/pr-head.md) now and follow it instead of Steps 0 and 1, before generic linked-worktree reuse. For every other caller, check whether you are **already** inside an isolated worktree. Creating a worktree inside another worktree, or inside a submodule, produces silent corruption.

```bash
CALLER_ROOT=${ROOT:-}
if [ -n "$CALLER_ROOT" ]; then
  read -r GIT_DIR GIT_COMMON <<<"$(git -C "$ROOT" rev-parse --path-format=absolute --git-dir --git-common-dir | tr '\n' ' ')"
else
  read -r GIT_DIR GIT_COMMON <<<"$(git rev-parse --path-format=absolute --git-dir --git-common-dir | tr '\n' ' ')"
  ROOT=$(dirname "$GIT_COMMON")
fi
CURRENT_BRANCH=$(git -C "$ROOT" branch --show-current)
```

**Submodule guard:** `GIT_DIR != GIT_COMMON` is also true inside git submodules. Before concluding "already in a worktree," verify you are not in a submodule:

```bash
# If this returns a path, you're in a submodule, not a worktree — treat as normal repo
git -C "$ROOT" rev-parse --show-superproject-working-tree 2>/dev/null
```

**If `GIT_DIR != GIT_COMMON` (and not a submodule):** The session already runs inside a linked worktree. Its `$GIT_DIR` is `<primary>/.git/worktrees/<name>`, and `$GIT_DIR/gitdir` contains `<worktree>/.git`, so derive its full path:

```bash
WORKTREE=$(dirname "$(cat "$GIT_DIR/gitdir")")
```

Use `$WORKTREE`, report it in the Step 4 shape (`Worktree ready at <that path>`), create nothing, and continue at Step 3 against that path.

**If `GIT_DIR == GIT_COMMON` (or in a submodule):** You are in the primary checkout. Proceed to Step 1.

## Step 1 — Announce, Don't Ask (skill-driven work defaults to a worktree)

For a PR head, use [reference/pr-head.md](reference/pr-head.md) instead of this step. For gauntlet-driven work — brainstorming, plans, implementation — the worktree is the default, not a question. Announce and proceed:

> "Setting up an isolated worktree at `<path>` on branch `<branch>` for this work."

Pause for explicit consent **only** when one of these holds:
- A trivial one-off the user named (typo, format run, dependency bump)
- The user already set up a workspace, or asked to work in place
- The sandbox can't support multiple checkouts without a caller root (see Sandbox fallback)

Otherwise create it. The gate is "is this real work?", not "did the user approve this worktree?"

For explicit caller roots, preflight the requested branch and resolved home in
that repo before any creator runs: use `git -C "$ROOT" show-ref --verify
refs/heads/"$BRANCH"`, `git -C "$ROOT" worktree list --porcelain`, and the
resolved path's existence. A branch, name, or path collision stops naming repo
and branch; never suffix or reuse an unrelated tree. On dirty-primary decline,
abort creation. On every failure, preserve created trees and list them using
[Step 4's coordinated-member inventory](#step-4--report-location).

## Step 1a - Read the `## using-git-worktrees` contract

Read the gauntlet overrides file under `$ROOT` (ladder in Project overrides) before any tool or wrapper discovery. With a caller-supplied `$ROOT` (a coordinated member), read that member's overrides file and `$ROOT/.pi/settings.json` by file for its checkout configuration using existing preset rules - never the session-scoped `gauntlet_setting` - and run wrapper discovery under `$ROOT`. Its `## using-git-worktrees` section carries up to three key lines, written like `## cleanup` items; prose before, between, or after them is instruction too:

| Key | Meaning | Absent (keyed contract active) |
|---|---|---|
| `- home: <path pattern>` | Where this repo's worktrees live, relative to the primary checkout (an absolute path is used as-is). `<name>` substitutes and must appear exactly once, inside one path segment that may carry a literal prefix or suffix (`../acme-mono-<name>`). Ownership test for finishing Step 6 and gatekeep cleanup. | `<primary>/.worktrees/<name>` |
| `- create: <command>` | Shell command run from the primary with `<name>` and `<branch>` substituted. Any other `<token>` stays literal: resolve it from the task context when the plan, ticket, or prompt names exactly one value for it (`<subproject>`: the one top-level directory the change touches); zero or several candidates -> ask once. | Built-in: `git worktree add "<home>" -b "<branch>"`, gitignore-first only when the home is inside the primary |
| `- destroy: <command>` | Removal command run from the primary, same substitution; read by `finishing-a-development-branch` Step 6 and gatekeep-pr cleanup. | `git worktree remove "<path>" && git worktree prune` when the path matches `home:`; host-owned, keep, when it does not |

The **keyed contract is active** when at least one key is present. A duplicate key: the first wins; name the duplicate. `home:` without a `<name>` segment, or with it twice: stop and name the line.

Keyed contract active:

1. Run the Step 3 clean-base check in the source checkout.
2. `NAME` is the branch name with every `/` replaced by `-` (`jacek/fix-x` -> `jacek-fix-x`). `HOME` is `home:` resolved against `$ROOT` with `<name>` -> `NAME`.
3. `create:` set -> run it from `$ROOT` with each resolved token inserted as one single-quoted shell word (`'...'`, an embedded `'` escaped), including when the template already quotes it; a `<token>` the context rule cannot resolve is never executed - ask once for its value. A non-zero exit stops this skill with the command's output: no `git worktree add` fallback, no Step 4 report.
   Resolve other wrapper tokens from this leg's touched directory, not the
   session repo's touched paths.
   `create:` absent -> when `HOME` is inside `$ROOT`, gitignore its parent directory first (the Step 2b sequence with that directory in place of `.worktrees`); then `git -C "$ROOT" worktree add "$HOME" -b "$BRANCH"`.
4. Post-create check, always: `git -C "$ROOT" worktree list --porcelain` must print `worktree $HOME`; otherwise stop and report the mismatch (a wrong `home:` pattern, or a wrapper that places trees elsewhere).
5. `WORKTREE="$HOME"`; `$WORKTREE` is the value every later step carries (`home: ../acme-mono-<name>` with branch `fix-x` gives `/work/acme-mono-fix-x`, so the basename `acme-mono-fix-x` is not the name). Go to Step 4.

No overrides file, no section, or a section with none of the three keys (both shapes are the **legacy path**): the prose, if any, is instruction; continue at Step 1b - native tools, then a wrapper discovered from `AGENTS.md`, the repo root, `script/`, or `bin/`, then `.worktrees/`.

## Step 1b - Prefer Native Worktree Tools (legacy path)

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

Derive `NAME` from `$BRANCH` by replacing every `/` with `-`. The canonical home is `<repo>/.worktrees/<name>`. A keyed `## using-git-worktrees` section never reaches this step (Step 1a creates at `home:`); on the legacy path a wrapper may define another path, otherwise use the canonical home. Do not ask local-vs-global or invent another path.

### 2b. Create - gitignore the home first

Run the Step 3 clean-base check in the source checkout before this sequence. `.worktrees/` must be gitignored before a worktree lands inside it.

```bash
# ROOT is the primary checkout derived in Step 0.
: "${BRANCH:?supply the shared or new feature branch name}"
NAME=${BRANCH//\//-}
if git -C "$ROOT" worktree list --porcelain | grep -qx "worktree $ROOT/.worktrees/$NAME"; then
  : # already exists - emit the Step 4 report, add nothing
else
  if ! git -C "$ROOT" check-ignore -q .worktrees; then
    echo ".worktrees/" >> "$ROOT/.gitignore"
    git -C "$ROOT" add .gitignore && git -C "$ROOT" commit -m "Ignore .worktrees/" -- .gitignore
  fi
  git -C "$ROOT" worktree add "$ROOT/.worktrees/$NAME" -b "$BRANCH"
fi
WORKTREE="$ROOT/.worktrees/$NAME"
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

On a permission failure (read-only filesystem or container sandbox without write to parent dirs), use the caller-root boundary:

- With an explicit caller root, stop naming the repo, requested branch and error; never branch the session cwd. Preserve created trees and list them using [Step 4's coordinated-member inventory](#step-4--report-location).
- Without a caller root, announce the failure and continue in the current directory on a feature branch after the Step 1 consent. Treat this as degraded in-place mode: `/skill:finishing-a-development-branch` requires a worktree path and does not finish an in-place branch.

## Step 3 — Verify Clean Base

The check: `git -C "$ROOT" status --porcelain` in the source checkout — untracked files count as dirty. Never `--untracked-files=no` / `-uno`. Empty output means clean only when the command exits 0; a nonzero exit is an error to surface — stop; never treat a failed check as "clean".

**When and where it runs:**

- **Fresh creation (Steps 1a/2):** in the source checkout, **before** invoking the wrapper (Step 1a) or the `git worktree add` sequence (Step 2b), as `git -C "$ROOT" status --porcelain`.
- **Already in a worktree (Step 0):** on arrival at this step, as `git -C "$WORKTREE" status --porcelain`.

**Clean** → proceed (create the worktree if not yet created, then Step 4).

**Dirty**:

Start the message with `gauntlet: question` alone at column zero on the first physical line, followed by a newline. Never append a colon to the marker. Follow the [first-line rule](../brainstorming/reference/menu-layout.md). Report the porcelain output verbatim and ask whether to clean up first (stash/commit) or proceed. Never run tests as a fallback; never auto-stash or auto-clean. On fresh paths the ask is about base hygiene — a user who *meant* the dirt to be part of the base commits it, and creation proceeds from the new HEAD. On the Step 0 path the ask is "continue working in a dirty workspace?" — the dirt is already in the workspace, not merely beside it.

For a dirty-primary decline, stop this member before creation and list preserved
created legs. Never auto-remove earlier members.

**Provenance note (report-only, never a gate).** Fresh-creation paths only — never Step 0 (an already-linked worktree was branched in some earlier invocation; there is no "created from" to compare this run). Resolve the default branch as `git -C "$ROOT" symbolic-ref --short refs/remotes/origin/HEAD` with the leading `origin/` stripped; compare that short name to the source checkout's `git -C "$ROOT" branch --show-current`. If they differ and the user did not name a base in the request, append one declarative line to the Step 4 report: `Note: branching from <ref>, not <default>.` — execution continues, no confirmation is awaited. If resolution fails (no remote, no `origin/HEAD`), skip the note silently. No other default-branch machinery.

## Step 4 — Report Location

Retain Step 1a's mandatory keyed-contract post-create path check. After every
creation path (keyed, native, wrapper or built-in), apply the caller's row:

| Caller supplied `$ROOT` | Read-back and ready condition |
|---|---|
| Yes (coordinated member) | Require `git -C "$ROOT" worktree list --porcelain` to print `worktree $WORKTREE` and `git -C "$WORKTREE" branch --show-current` to print exactly `$BRANCH`. On an absent, empty, or different result, stop this member, name repo, requested branch and actual result, and emit no `Worktree ready at` line for this member. In `Preserved created legs:`, list every tree created so far in this run, including the stopped member's own tree when its create command succeeded, each as `<repo> <branch or "branch unverified"> <path>`. Report `Worktree ready at <full-path>` only after both read-backs match. |
| No (single-member run) | Use successful creation as the ready condition; read back the path and branch with the commands above as advisory checks, stopping only on an observed different path or branch and naming repo, requested branch and actual result. Treat an absent or undescribed result as unobserved, not a mismatch; report `Worktree ready at <full-path>` after successful creation with no observed mismatch. |

Carry every verified result home first.

```
Worktree ready at <full-path>
Branch: <branch-name>
Base: <ref> (clean)
Ready to implement <feature>
```

When the user chose to proceed past a dirty source, the base line is `Base: <ref> (dirty - proceeded after ask)` instead. When the provenance check fired (fresh paths only), append its `Note: branching from <ref>, not <default>.` line after the base line. `<ref>` per path: fresh creation — the branch/commit the worktree was created from (the user-requested base when one was given); Step 0 — the current branch/HEAD of the existing worktree, with no provenance line.

Every later skill takes `<full-path>` as a value: dispatch `cwd: "<full-path>"`, `git -C <full-path> ...`, or `(cd "<full-path>" && <cmd>)` for other cwd-bound commands. Never change the process cwd.

## Detached HEAD

Start the message with `gauntlet: question` alone at column zero on the first physical line, followed by a newline, for the branch/base choice. Never append a colon to the marker. Follow the [first-line rule](../brainstorming/reference/menu-layout.md).

If `git symbolic-ref -q HEAD` returns nothing, you're on a detached HEAD. Do not create a worktree from this state — first ask the user whether to branch from the current commit or from `main`.

## Keeping a Worktree Current

For a PR-subject branch, follow [reference/pr-head.md](reference/pr-head.md): sync per that reference. For other longer-running work the base branch advances:

```bash
git -C "$WORKTREE" fetch origin
git -C "$WORKTREE" rebase origin/main    # or merge if branch is shared
```

Re-run tests after rebasing.

## Quick Reference

| Situation | Action |
|---|---|
| `GIT_DIR != GIT_COMMON` | Already in worktree - report its path, create nothing |
| Worktree path already listed by `git worktree list` | Explicit caller root: stop on collision; otherwise report existing isolation |
| `git rev-parse --show-superproject-working-tree` returns a path | Submodule — treat as normal repo |
| `## using-git-worktrees` has `home:`/`create:`/`destroy:` | Keyed contract (Step 1a): run `create:` or the built-in add at `home:`, then the post-create check |
| `## using-git-worktrees` absent or keyless | Legacy path: native tool, then wrapper discovery, then `<repo>/.worktrees/<name>` |
| Project-native wrapper exists (legacy path) | Use the wrapper (commonly `script/worktree create`) |
| No native tool | Create `<repo>/.worktrees/<name>` (gitignore `.worktrees/` first) |
| Detached HEAD | Ask before branching |
| Sandbox/permission failure | Follow Step 2d's caller-root boundary |
| Source checkout dirty | Report + ask |

## Red Flags — STOP

- About to run `git worktree add` from inside a worktree (`GIT_DIR != GIT_COMMON`)
- About to `cd` into the worktree (carry the path instead)
- About to call `git worktree add` directly when the project ships a wrapper (use the wrapper)
- Created a `.worktrees/` worktree without gitignoring `.worktrees/` first
- Placed a worktree outside `.worktrees/` (or the `home:` key of `## using-git-worktrees`) for no reason
- Source checkout dirty and you proceed without asking
- About to run a test suite during worktree creation
- Executed a `create:` or `destroy:` template with an unresolved `<token>` still in it
- Fell back to `git worktree add` after a configured `create:` failed

## Integration

**Called by:**
- `/skill:brainstorming` — **before** writing the spec; the spec is the worktree's first commit
- `/skill:subagent-driven-development` — required before any implementation tasks
- Any skill needing isolated workspace

**Pairs with:**
- `/skill:finishing-a-development-branch` — REQUIRED for cleanup. Default finish squashes the worktree's full history into a single commit on `main`. If the worktree was created by a project-native wrapper, cleanup defers to the wrapper's destroy command.

**Note:** Trivial one-off edits the user explicitly asks for (e.g. "fix this typo") do not require a worktree. Everything else — specs, plans, implementation — belongs in a worktree from the first artifact onward.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
