---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup
---

# Finishing a Development Branch

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Detect environment → Surface closure → Present options → Execute choice → Clean up.

**Announce at start:** "I'm using the finishing-a-development-branch skill to complete this work."

At start, call `phase_tracker({ action: "start", phase: "ship" })`.

## The Process

### Step 1: Verify Tests

**Hard verification gate.** Tests/format/lint must pass before presenting any options — including Discard. The user's stated intent to throw the branch away does not change whether the diff is in a verifiable state; verifying first surfaces accidental damage to unrelated code before the branch is gone forever. No exceptions.

Run the project's canonical verification target from inside the worktree. The exact command lives in the repo's `AGENTS.md` or service-level docs (look for "verification", "CI", or "test" sections). Typical patterns: `make ci`, `npm test`, `pytest`, `cargo test`, `bundle exec rspec`. Cross-cutting changes: run each affected service's target; don't skip any.

**Scoping caveat — pre-existing findings.** Some services carry lint findings unrelated to the diff. If verification fails on lines you didn't touch:

1. Confirm with `git diff <base>...HEAD --name-only` that the offending file isn't in your diff.
2. Surface the pre-existing finding to the user as a separate issue — do **not** auto-fix it in this completion ("surface, don't auto-fix").
3. Proceed only after the user acknowledges.

**If tests fail (within your diff):**
```
Tests failing (<N> failures). Must fix before completing:

[Show failures]

Cannot proceed with Options 1–3 until tests pass.
```

Stop. Don't proceed to Step 2.

**If tests pass:** Continue to Step 2.

No documentation prompt here: Documentation impact is decided at spec time (`/skill:brainstorming` section 6, gated by `brainstorming/reference/documentation-impact.md`) and has already shipped in the diff by the time you reach finishing.

### Step 2: Detect Environment

**Determine workspace state before presenting options:**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```

This determines which menu to show and how cleanup works:

| State | Menu | Cleanup |
|-------|------|---------|
| `GIT_DIR == GIT_COMMON` (normal repo) | Standard 4 options | No worktree to clean up |
| `GIT_DIR != GIT_COMMON`, named branch | Standard 4 options | Provenance-based (see Step 6) |
| `GIT_DIR != GIT_COMMON`, detached HEAD | Reduced 3 options (no merge) | No cleanup (externally managed) |

### Step 3: Determine Base Branch

```bash
# Try common base branches
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

Or ask: "This branch split from main - is that correct?"

### Step 3.5: Closure / Conformance Disposition Gate

This is an **enforced disposition gate**, not a surface-only notice. The user is about to choose how to ship; every carried-open decision must get an explicit disposition here, before Step 4's menu. Tests prove the code runs; conformance proves it does what was requested - different gates.

`verification-before-completion/reference/conformance-check.md` is **canonical** for the durable handoff schema, concern-decomposition rules, the single disposition-availability table, the `UNAUTHORIZED` question text, the `recommended: none` preflight, the freshness rule, and the concern-scoped fix projection. This step owns only **render, response, and execute-order** and consumes the rest by link - it does not restate the availability table, the `UNAUTHORIZED` question, or the preflight prose.

**If no conformance check has run in this flow** (e.g. ad-hoc work that landed without an execution skill): say so, then dispatch a fresh-context `conformance-reviewer` against the origin (spec + verbatim prompt + full diff vs base) per that reference - it owns the audit-time input rule (stage/commit untracked deliverables before auditing). Closing the loop is cheap relative to shipping unverified intent. Route the raw reviewer verdict through the reference's canonical pipeline (gap/concern partition, auto-fix where eligible, concern decomposition, emission of a durable `## Closure / conformance` block), then consume that block through the branching below exactly as a carried handoff.

**Freshness precondition - before any verdict branch, including `CONFORMS`.** The durable block opens with a two-line sentinel: `status: CONFORMS (0 open)` or `status: GAPS (N open)`, then `audited-base: <full HEAD SHA at audit time>`. Read the sentinel, then apply the reference's freshness rule (its `## Closure / conformance` block is the single source): compare `audited-base` to the current working tree; any change, doubt, missing/mismatched sentinel, legacy terse row, or malformed structured reviewer block triggers a fresh audit and replacement of the closure block. Never infer `CONFORMS` from the absence of bullets. Only a clean, valid `status: CONFORMS (0 open)` handoff enters the zero-gap fast path.

**Zero-gap fast path:** print exactly

```
Closure / conformance: CONFORMS
```

then continue directly to Step 4. No approval prompt, no menu, no shared options line, no sign-off. If the run auto-applied fixes, surface the flat `auto-applied fix commits: <Gn: SHA>, ...` index from the durable block as **one informational, non-blocking line** with a one-line revert offer (see "Revert semantics") - a gap that auto-converged mid-verify has no bullet, so this index is the only place its fix commit stays revertable. Do not wait for acknowledgment.

**Carried-open render (dense).** Read the `## Closure / conformance` block. Render a header with the decision count, one bullet per decision unit (a gap by default; a `Gn/Cn` concern only where the reference split it), then the shared options line, then the recommended-set reply. Never show durable-card internals (ownership, evidence tokens, identity, hashes) in the render.

Each bullet:

`* <handle> - <plain title>: <what's unresolved, one clause>. <short question> Recommended: <choice> (<one-clause why>).`

- `<handle>` leads the bullet and is a short unique human word derived from the title (`Cache coverage` -> `cache`); on collision append a digit. It is the token option 2 targets. When a gap split and no clean word fits, use the bare `Gn/Cn`; a single-concern gap uses its gap ID `Gn`.
- The shared options line sits below the bullets: `Other options per item: fix-now / accept / rescope / follow-up / custom`, listing the options **generally available across items**. When a specific item's availability deviates - an option unavailable for it, or an `UNAUTHORIZED` item whose `rescope` is unavailable and whose `fix-now` means removal - note that deviation as a short parenthetical on **that item's bullet** (one clause, not a block), e.g. `(rescope N/A: scope creep)`. The shared line appears **only in the carried-open render**, never in the zero-gap path. Full per-option effects only on request, or when option 2 targets an unclear choice.
- Group items under one recommended line only when they share a disposition and rationale; each grouped handle repeats its title.
- Availability per concern comes from the reference's single availability table - apply it against current context (worktree state, `maxFixRounds`, ownership, resource accessibility), do not restate it. `UNAUTHORIZED` bullets ask the reference's question verbatim (`Should this unrequested behavior become part of the current workflow?`); `rescope-into-spec` is shown **unavailable** (not dropped) and `fix-now` means **removal** of the unrequested code.
- `revert conformance fix Gn`, when the gap has an auto-applied fix, renders on the shared options line as a **separate one-off action** - never inside a bullet's recommendation and never in the option-2 list. Name the parent gap and warn that revert undoes the entire gap-level commit (see "Revert semantics").

Representative carried-open render (multi-concern gap split to `e2e`; single-concern gap `cache`; `UNAUTHORIZED` gap `auth`):

```
Conformance: 3 decisions needed before shipping.

* e2e - Source-image E2E validation: not run; blocked (HYDRA1.png, HTTP 401).
  Still in scope for this branch? Recommended: rescope (defer until image available) (fix-now N/A: needs HYDRA1.png).
* cache - Cache coverage: implemented but the spec is silent on it.
  In scope? Recommended: accept into spec (behavior is intentional).
* auth - Unrequested admin bypass: adds an unlisted route. Should this unrequested behavior become part of the current workflow? Recommended: fix-now = remove it (rescope N/A: scope creep).

Other options per item: fix-now / accept / rescope / follow-up / custom.

1. Go with recommended
2. Recommended except <handle>=<choice>   e.g. "2: cache=follow-up"
```

A single-concern render is identical minus the split: one bullet whose handle is the gap ID or word, no sibling.

#### Response grammar

```
1                                  -> apply every recommendation
2: cache=follow-up
2: e2e=custom(open ticket after image lands), cache=follow-up
```

- `1` (or `apply recommended`) applies all recommendations.
- `2:` takes a comma-separated override list, each `<handle>=<choice>`; omitted items keep their recommendation. A handle may appear at most once (repeat = invalid).
- `custom(<concrete effect>)` supplies an inline effect. Manual fix-in-place is expressed only as `custom(...)` where isolated `fix-now` is unavailable.
- `recommended: none` items follow the reference's preflight (linked, not restated): the item needs a `<handle>=custom(...)` decision, and option 1 is withheld until every open item has an executable recommendation; after the custom decision the menu re-renders for the remainder.
- `revert conformance fix Gn` is a valid standalone reply, mutually exclusive with `1` and `2:`; it never appears inside a `2:` override list.
- Invalid handle or choice -> focused reprompt naming only that item, retaining every valid pick and never reopening the gate. Unknown token: list the valid titled handles. Known item, bad choice: repeat its title + its available choices.

#### Execute order

Take **no** disposition action before the reply. Then, once, in order:

1. **Normalize** every `custom(...)` into explicit operations; classify state-changing (edits code or spec) vs not. Clarify only an ambiguous or unexecutable effect.
2. **Commit spec edits** (`accept-into-spec`, `rescope-into-spec`, state-changing spec `custom`) - the main session edits the spec directly, before any fix dispatch (a dirty tree rejects `worktree: true`, and the re-audit must read the amended spec).
3. **Re-audit if step 2 changed the spec**; regenerate the inventory and re-render if it changed. Project `fix-now` only from the refreshed inventory.
4. **fix-now + code-changing custom:** project the selected concerns per gap into the reference's concern-scoped fix contract (excluding accepted/rescoped/followed-up siblings); run the reference "Fix loop" (unchanged - do not re-describe it). A code-changing `custom` runs the project's tests + `code-reviewer` on its delta before proceeding. Re-run Step 1's canonical tests.
5. **Re-audit after all state-changing work;** obtain fresh decisions **only if** the refreshed inventory differs from the approved one, else proceed.
6. **follow-up** from the current inventory: create the item via the project's issue-tracker convention (`.pi/gauntlet-overrides.md`), record the ticket ID/URL; on failure keep the concern open.
7. **Non-state-changing custom:** execute and record the result.
8. **revert** (`revert conformance fix Gn`): light-revert the indexed commit, re-run Step 1's canonical tests; on failure stop; on pass re-audit and regenerate.
9. Re-enter Step 3.5 with the re-audited block if any concern remains open.

Record every final disposition with its **stable ID** as `Gn/Cn - <title>: <disposition>` (or `Gn - <title>: <disposition>` for a single-concern gap) - ticket ID/URL for `follow-up`, result for `custom`; never relabel a `custom` result as a recommendation. This durable record is the machine/audit surface; the interactive render stays handle-based. Then continue to Step 4:

```
Closure / conformance: CONFORMS
  (or: GAPS resolved - G1/C1 - Source-image E2E validation: rescope-into-spec;
       G2 - Cache coverage: follow-up (PROJ-123); ...)
```

No auto-proceed: every carried-open decision needs an explicit disposition before Step 4 renders.

### Revert semantics

Three tiers, increasing cost — name the tier when a revert is requested:

| Tier | What's reverted | Cost | Mechanics |
|---|---|---|---|
| Cheap | Council edit, reverted at the `brainstorming` gate | Spec isn't yet plan- or code-bearing | Revise spec, re-present |
| Light | Conformance fix, reverted at finish | Gap re-opens for a fresh disposition | Revert the `conformance fix Gn` commit(s), re-audit |
| Heavy | Council edit, reverted at finish | Rewrites the already-ratified contract that drove the plan and code | Amend spec → re-approve → regenerate affected plan/code → re-run verify before ship |

A **heavy** revert is not a menu toggle — say so explicitly to the user before proceeding, and do not present it as equivalent-effort to the light tier. The council audit that lets the human identify revert candidates lives in the `brainstorming` spec commit message body (not a committed spec section).

### Step 4: Present Options

**Normal repo and named-branch worktree — present exactly these 4 options:**

```
Implementation complete. What would you like to do?

1. Squash-merge to <base-branch> (no PR, no surviving branch)
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option?
```

**Detached HEAD — present exactly these 3 options:**

```
Implementation complete. You're on a detached HEAD (externally managed workspace).

1. Push as new branch and create a Pull Request
2. Keep as-is (I'll handle it later)
3. Discard this work

Which option?
```

**Don't add explanation** - keep options concise.

### Step 5: Execute Choice

#### Option 1: Squash-merge to base

```bash
# Get main repo root for CWD safety
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"

# Squash-merge — collapses the feature branch into one commit on base
git checkout <base-branch>
git pull
git merge --squash <feature-branch>

# Plans are ephemeral — delete from the squash. Spec stays.
git rm doc/plans/<plan-file>.md   # or <service>/doc/plans/<plan-file>.md

# Single commit covering spec + code + review fixes.
git commit -m "<imperative summary> (ref E-XXXX)"

# Verify tests on merged result
<Step 1 command for the service(s) touched>
```

The post-squash re-verify is not optional — `git merge --squash` can surface conflict-resolution mistakes the worktree-side run couldn't catch.

Then: Cleanup worktree (Step 6), then delete branch:

```bash
git branch -d <feature-branch>
```

**No push. No PR.** The squashed commit stays local on `<base-branch>` unless the user explicitly asks to push.

#### Option 2: Push and Create PR

```bash
# Plans are ephemeral - if one was committed on this branch, remove it before the PR diff is opened.
PLAN_PATH=doc/plans/<plan-file>.md   # or <service>/doc/plans/<plan-file>.md
if git ls-files --error-unmatch "$PLAN_PATH" >/dev/null 2>&1; then
  git rm "$PLAN_PATH" && git commit -m "Remove ephemeral plan doc"
fi

# Push branch
git push -u origin <feature-branch>

# Create PR
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<2-3 bullets of what changed>

## Test Plan
- [ ] <verification steps>
EOF
)"
```

**Do NOT clean up worktree** — user needs it alive to iterate on PR feedback.

#### Option 3: Keep As-Is

Report: "Keeping branch <name>. Worktree preserved at <path>."

**Don't cleanup worktree.**

#### Option 4: Discard

**Confirm first:**
```
This will permanently delete:
- Branch <name>
- All commits: <commit-list>
- Worktree at <path>

Type 'discard' to confirm.
```

Wait for exact confirmation.

If confirmed:
```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
```

Then: Cleanup worktree (Step 6), then force-delete branch:
```bash
git branch -D <feature-branch>
```

### Step 6: Cleanup Workspace

**Only runs for Options 1 and 4.** Options 2 and 3 always preserve the worktree.

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```

**If `GIT_DIR == GIT_COMMON`:** Normal repo, no worktree to clean up. Done.

**If the worktree was created by a project-native script (e.g., `script/worktree create`, `bin/worktree`):** defer to the matching destroy command. The script likely cleans up DBs, env files, or other side-effects that raw `git worktree remove` will miss.

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
name="${WORKTREE_PATH##*-}"
# Example: project-native wrapper. Substitute your project's destroy command.
"$MAIN_ROOT/script/worktree" destroy "$name"
```

**If worktree path is under `.worktrees/` or `~/.worktrees/<project>/`:** Gauntlet created this worktree — we own cleanup.

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git worktree remove "$WORKTREE_PATH"
git worktree prune  # Self-healing: clean up any stale registrations
```

**Otherwise:** The host environment (harness) owns this workspace. Do NOT remove it. If your platform provides a workspace-exit tool, use it. Otherwise, leave the workspace in place.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch | Plan-doc removal |
|---|---|---|---|---|---|
| 1. Squash-merge locally | yes (squash) | - | - | yes | yes (unconditional) |
| 2. Create PR | - | yes | yes | - | yes (guarded, before push) |
| 3. Keep as-is | - | - | yes | - | - |
| 4. Discard | - | - | - | yes (force) | - |

## Common Mistakes

**Skipping test verification**
- **Problem:** Merge broken code, create failing PR
- **Fix:** Always verify tests before offering options

**Open-ended questions**
- **Problem:** "What should I do next?" is ambiguous
- **Fix:** Present exactly 4 structured options (or 3 for detached HEAD)

**Cleaning up worktree for Option 2**
- **Problem:** Remove worktree user needs for PR iteration
- **Fix:** Only cleanup for Options 1 and 4

**Deleting branch before removing worktree**
- **Problem:** `git branch -d` fails because worktree still references the branch
- **Fix:** Merge first, remove worktree, then delete branch

**Running git worktree remove from inside the worktree**
- **Problem:** Command fails silently when CWD is inside the worktree being removed
- **Fix:** Always `cd` to main repo root before `git worktree remove`

**Cleaning up harness-owned worktrees**
- **Problem:** Removing a worktree the harness created causes phantom state
- **Fix:** Only clean up worktrees under `.worktrees/`, `~/.worktrees/<project>/`, or paths produced by a project-native worktree script

**No confirmation for discard**
- **Problem:** Accidentally delete work
- **Fix:** Require typed "discard" confirmation

**Skipping the plan-doc deletion in Options 1 and 2 (any path that lands on base)**
- **Problem:** Plan docs are ephemeral and shouldn't land on `<base-branch>`. Forgetting `git rm doc/plans/<plan-file>.md` ships scaffolding to main.
- **Fix:** The plan stays in the deleted branch's git history (`git log --all -- doc/plans/...`). Spec stays on `<base-branch>`; plan does not.

## Completion

Once the chosen option (Options 1, 2, or 3 — not Discard) is executed successfully, mark the ship phase complete:

```
phase_tracker({ action: "complete", phase: "ship" })
```

## Red Flags

**Never:**
- Proceed with failing tests
- Merge without verifying tests on result
- Delete work without confirmation
- Force-push without explicit request
- Remove a worktree before confirming merge success
- Clean up worktrees you didn't create (provenance check)
- Run `git worktree remove` from inside the worktree
- Auto-proceed past an undispositioned carried-open gap
- Skip the guarded plan-doc removal before push on Option 2 when a plan doc was committed

**Always:**
- Verify tests before offering options
- Detect environment before presenting menu
- Present exactly 4 options (or 3 for detached HEAD)
- Get typed confirmation for Option 4
- Clean up worktree for Options 1 & 4 only
- `cd` to main repo root before worktree removal
- Run `git worktree prune` after removal
- Surface the closure / conformance verdict as its own section before the options menu

## Project overrides

If `.pi/gauntlet-overrides.md` exists, read it. Any sections relevant to this skill — by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention — override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.
