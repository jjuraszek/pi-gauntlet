---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup
argument-hint: "<worktree-path>"
---

# Finishing a Development Branch

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Detect environment → Surface closure → Present options → Execute choice → Clean up.

## Input

`<worktree-path>` - the absolute path of the worktree to finish, from the `using-git-worktrees` report or the handoff brief. Before anything else - before the announcement and before `phase_tracker` start - if it is missing, stop with "finishing needs the worktree path: /skill:finishing-a-development-branch <worktree-path>" and do nothing else. Derive the primary checkout once:

```bash
WORKTREE=<worktree-path>
PRIMARY=$(dirname "$(git -C "$WORKTREE" rev-parse --path-format=absolute --git-common-dir)")
FEATURE=$(git -C "$WORKTREE" branch --show-current)
```

The process cwd never changes; every command targets `$WORKTREE` or `$PRIMARY` explicitly.

**Announce at start:** "I'm using the finishing-a-development-branch skill to complete this work."

Then call `phase_tracker({ action: "start", phase: "ship" })`.

## The Process

### Step 1: Verify Tests

**Hard verification gate.** Tests/format/lint must pass before presenting any options — including Discard. The user's stated intent to throw the branch away does not change whether the diff is in a verifiable state; verifying first surfaces accidental damage to unrelated code before the branch is gone forever. The skip rule below is the only exception.

Read the selected run spec before verification. Detect a PR subject only by its `## Rework record`, never by an open PR on `$FEATURE`. Read `PR:` and the full `Pre-rework head:` into `PRE_REWORK_HEAD` from that record; missing pre-head -> stop naming the spec path. Confirm with `gh pr view <N> --json number,url,headRefName,baseRefName,state` (use the record's repository): non-`OPEN` -> stop: `PR #N is <state>; the rework cannot be pushed to it.`; headRefName != `$FEATURE` -> stop naming both branches. Retain baseRefName for Step 3.

Recognize a ledger by line 1 exactly `# Ledger - loop engine`. For a ledger, use its `verification:` command throughout finish, including the minors round. For a PR subject with a task plan, use the union of every plan task's `Tests:` commands plus the executable lint/format commands in the header's `**Verification:**` line; treat `none - PR subject, scoped` as no header commands, not an empty task union. Capture this set and accepted-complete task evidence before stripping the plan. Apply the hard gate and skip rule below to this set. For every other subject with a task plan, run the plan header's `**Verification:**` set in the worktree: `(cd "$WORKTREE" && <command>)`. With no plan in this session, run the verification command(s) of the affected services from the gauntlet overrides file or `AGENTS.md` (look for "verification", "CI", or "test" sections).

**Skip rule.** Skip the run only when this set passed on a known clean commit in the verify phase of this session and no edit or write landed outside `<telemetry.dir>` since. Check the current tree: `git -C "$WORKTREE" diff --quiet <commit the run passed on> -- . ':!<telemetry.dir>'` must exit 0, and `git -C "$WORKTREE" status --porcelain --untracked-files=all -- . ':!<telemetry.dir>'` must exit 0 with empty output (`<telemetry.dir>` defaults to `.pi/gauntlet/telemetry`). These checks cover committed, staged, unstaged, and untracked changes outside telemetry. Otherwise run it once; a missing verified commit, a failed check, or uncertainty means run.

**Scoping caveat — pre-existing findings.** Some services carry lint findings unrelated to the diff. If verification fails on lines you didn't touch:

1. Confirm with `git -C "$WORKTREE" diff <base>...HEAD --name-only` that the offending file isn't in your diff.
2. Surface the pre-existing finding to the user as a separate issue — do **not** auto-fix it in this completion ("surface, don't auto-fix").
3. Proceed only after the user acknowledges.

**If tests fail (within your diff):**
```
Tests failing (<N> failures). Must fix before completing:

[Show failures]

Cannot proceed until tests pass.
```

Stop. Don't proceed to Step 2.

**If tests pass:** Continue to Step 2.

No documentation prompt here: Documentation impact is decided at spec time (`/skill:brainstorming` section 6, gated by `brainstorming/reference/documentation-impact.md`) and has already shipped in the diff by the time you reach finishing.

### Step 2: Detect Environment

For a PR subject, use the Step 4 PR menu. For other subjects: detached HEAD (`git -C "$WORKTREE" symbolic-ref -q HEAD` prints nothing) -> reduced 4-option menu (no merge), no cleanup. Otherwise the standard 5 options.

### Step 3: Determine Base Branch

For a PR subject, set `<base-branch>` to the confirmed `baseRefName` and skip the common-base probe below.

```bash
# Try common base branches
git -C "$WORKTREE" merge-base HEAD main 2>/dev/null || git -C "$WORKTREE" merge-base HEAD master 2>/dev/null
```

Or ask: "This branch split from main - is that correct?"

### Step 3.5: Closure / Conformance Disposition Gate

This is an **enforced disposition gate**, not a surface-only notice. The user is about to choose how to ship; every carried-open decision must get an explicit disposition here, before Step 4's menu. Tests prove the code runs; conformance proves it does what was requested - different gates.

`verification-before-completion/reference/conformance-check.md` is **canonical** for the durable handoff schema, concern-decomposition rules, the single disposition-availability table, the `UNAUTHORIZED` question text, the `recommended: none` preflight, the freshness rule, and the concern-scoped fix projection. This step owns only **render, response, and execute-order** and consumes the rest by link - it does not restate the availability table, the `UNAUTHORIZED` question, or the preflight prose.

**If no conformance check has run in this flow** (e.g. ad-hoc work that landed without an execution skill): say so, then dispatch a fresh-context `conformance-reviewer` with `cwd: "<worktree-path>"` against the origin (spec + verbatim prompt + full diff vs base) per that reference - it owns the audit-time input rule (stage/commit untracked deliverables before auditing; this path never runs a happy path and passes no happy-path input). Closing the loop is cheap relative to shipping unverified intent. Route the raw reviewer verdict through the reference's canonical pipeline (gap/concern partition, auto-fix where eligible, concern decomposition, emission of a durable `## Closure / conformance` block), then consume that block through the branching below exactly as a carried handoff.

**Freshness precondition - before any verdict branch, including `CONFORMS`.** The durable block opens with a sentinel: `status: CONFORMS (0 open)` or `status: GAPS (N open)`, then `audited-base: <full HEAD SHA at audit time>`, then an optional `happy-path: <outcome>` line (present exactly when a happy-path run happened; informational, never a freshness input), then an optional `Deferred/deviates per spec: ...` line (present exactly when the spec defers or deviates a row; informational, never a freshness input). Read the sentinel, then apply the reference's freshness rule (its `## Closure / conformance` block is the single source): compare `audited-base` to the current working tree; any change, doubt, missing/mismatched sentinel, legacy terse row, or malformed structured reviewer block triggers a fresh audit and replacement of the closure block. Never infer `CONFORMS` from the absence of bullets. Only a clean, valid `status: CONFORMS (0 open)` handoff enters the zero-gap fast path.

**Whole-diff minors (both paths).** Read the block's `whole-diff minors:` section (`conformance-check.md` "Closure / conformance") and render it as one informational, non-blocking line directly under the `Deferred/deviates per spec:` line when present, else under the `happy-path:` line when present, else directly under `Closure / conformance: CONFORMS` or the `Conformance: N decisions needed before shipping.` header: `whole-diff minors (3, not blocking): F3, F7, F9`, `whole-diff minors: none`, or `whole-diff minors: not recorded` (section absent). Never a re-audit trigger. The reply point is the Step 4 menu.

**Zero-gap fast path:** print (plus the informational lines below)

```
Closure / conformance: CONFORMS
```

then continue directly to Step 4 and render its menu in full, options included. Place no approval prompt, conformance menu, or sign-off between the CONFORMS line and that menu. The render never stops at Step 4's question line; the numbered options are part of the same message. If the run auto-applied fixes, surface the flat `auto-applied fix commits: <Gn: SHA>, ...` index from the durable block as **one informational, non-blocking line** with a one-line revert offer (see "Revert semantics") - a gap that auto-converged mid-verify has no bullet, so this index is the only place its fix commit stays revertable. Do not wait for acknowledgment.

When the sentinel carries a `happy-path:` line, print it directly under `Closure / conformance: CONFORMS` as one informational, non-blocking line in the same shape as the `auto-applied fix commits` line: `happy-path: passed`, `happy-path: failed - unattributable`, or `happy-path: not run - <reason>` (a `failed - attributed to G<n>` value cannot reach this branch: its gaps are open). When the sentinel carries a `Deferred/deviates per spec:` line, print it verbatim as one informational line directly under the `happy-path:` line when present, else directly under `Closure / conformance: CONFORMS` or the `Conformance: N decisions needed before shipping.` header, and above the `whole-diff minors` line (both paths).

**Pre-menu amendment funnel (GAPS only).** Before rendering the carried-open menu, `read` and run [`amendment-surface.md` § Conformance entry](../brainstorming/reference/amendment-surface.md) over the inventory once: gaps with `recommended: accept`, verdict `DRIFTED` or `PARTIAL`, not `UNAUTHORIZED`, whose `origin` is not an acceptance criterion are drafted as `accept-into-spec` items (the edit built from `origin` + `evidence`) and sent to the reviewer in one call; cleared items apply and land as one batch commit, the spec is re-audited, the inventory regenerated. Only concerns the re-audit actually closed drop out; sibling concerns in the same gap keep their rows and dispositions. Survivors and every other gap render as ordinary rows below - one menu, never two.

**Carried-open (`status: GAPS (N open)`).** Read `reference/disposition-protocol.md` and follow it for the carried-open render grammar, the response grammar, and the 9-step execute order. Render the human decision menu in the shape below; print the `Conformance: N decisions needed before shipping.` header below the item list, followed by the sentinel's informational lines (`happy-path:`, `Deferred/deviates per spec:`, `whole-diff minors:`) when present, in that order, above the reply instruction - a `failed - attributed to G<n>,...` value names the rows whose evidence is the transcript, a `rescope` recommendation on such a row means the failure lies in code the change never owned - drive the dispositions per that reference, then print the summary render and continue to Step 4. If that reference file cannot be read, stop and surface a blocking error — do **not** improvise the grammar from memory.

Representative carried-open render (multi-concern gap split to `e2e`; single-concern gap `cache`; `UNAUTHORIZED` gap `auth`):

```
1. Source-image E2E validation - not run; blocked (HYDRA1.png, HTTP 401), so the branch ships without its end-to-end evidence.
   The spec requires this validation, but HYDRA1.png is unavailable; decide whether it stays in scope for this branch.
   what: The spec's Verification section gains a line deferring the source-image E2E run until the image is available.
   why: The branch cannot produce that evidence without the image.
   Example: Run the packed-image E2E before merge -> deferred until HYDRA1.png is available
   Reviewer: not reviewed - the pre-menu funnel drafts only recommended-accept items
   Impact: Verification: E2E evidence required before merge -> deferred until the image lands
   A) accept - Ratify shipping without the end-to-end evidence in the spec.
   B) rescope - Defer the validation requirement in the spec until the image is available.
   C) follow-up - Transfer validation to separately owned work with a tracked ticket.
   Custom: <your own answer> - Execute your disposition after clarifying its effect.
   Recommended: B - Defer until the image is available.
   Not available: fix-now - needs HYDRA1.png

2. Cache coverage - implemented but the spec is silent on it, leaving the intended contract unclear.
   Spec and code disagree; decide whether the implemented behavior is in scope.
   what: The spec's Design section gains a clause ratifying the implemented cache coverage.
   why: The behavior is intentional and the spec is silent.
   Example: spec silent on cache coverage -> Design states the cache covers the rendered menu path
   Reviewer: not reviewed - origin quotes an acceptance criterion
   Impact: Design: no cache-coverage contract -> cache coverage is ratified as specified behavior
   A) fix-now - Align the implementation with the current spec.
   B) accept - Ratify the implemented cache behavior in the spec.
   C) rescope - Explicitly remove or defer the origin requirement in the spec.
   D) follow-up - Transfer the concern to separately owned work with a tracked ticket.
   Custom: <your own answer> - Execute your disposition after clarifying its effect.
   Recommended: B - The behavior is intentional.

3. Unrequested admin bypass - adds an unlisted route, expanding the workflow beyond approved scope.
   Should this unrequested behavior become part of the current workflow?
   A) fix-now - Remove the unrequested admin bypass.
   B) accept - Ratify the bypass as approved scope in the spec.
   C) follow-up - Transfer the decision or removal task to separately owned work with a tracked ticket.
   Custom: <your own answer> - Execute your disposition after clarifying its effect.
   Recommended: A - Remove the unrequested behavior.
   Not available: rescope - scope creep

Conformance: 3 decisions needed before shipping.

Reply with one line per item: `1. C`, `2. A`. Bare `1` takes every recommendation and re-asks items without one by number.
```

A single-concern render is identical minus the split: one numbered item, no siblings.

Execute the chosen dispositions per `reference/disposition-protocol.md` (Execute order), then print the closure summary and continue to Step 4:

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
| Heavy | Council edit, reverted at finish | Rewrites the already-ratified contract that drove the plan and code | Amend spec per brainstorming's [Amending an approved spec](../brainstorming/SKILL.md#amending-an-approved-spec) → regenerate affected plan/code → re-run verify before ship |

A **heavy** revert is not a menu toggle — say so explicitly to the user before proceeding, and do not present it as equivalent-effort to the light tier. The council audit that lets the human identify revert candidates lives in the `brainstorming` spec commit message body (not a committed spec section).

### Step 4: Present Options

**Amendment digest (both variants).** Before the options, read `git -C "$WORKTREE" log <base-branch>..HEAD --extended-regexp --grep '^(amend:|loop: cut row [0-9]+|loop: amend)'` and take the `auto-apply` and `granted` records from those commit bodies. Render, then the options:

```
Amendments auto-applied (N):
- <title> - <what changed>
```

Omit the block when N = 0.

**PR subject - preflight and six-row menu.** Fetch origin with `git -C "$WORKTREE" fetch origin`; stop on failure. Run these proofs in order, against this worktree's HEAD:
| Proof | Exit 0 | Exit 1 |
|---|---|---|
| `git merge-base --is-ancestor <PRE_REWORK_HEAD> HEAD` | Continue | Stop: `PR branch history was rewritten: <PRE_REWORK_HEAD7> is not an ancestor of HEAD; the rework must be re-merged, not rebased.` |
| `git merge-base --is-ancestor origin/<headRefName> HEAD` | Offer push | Withhold push: `push withheld: origin/<headRefName> is at <sha7>, local HEAD at <sha7>; a non-force push cannot land` |
Run each proof with `git -C "$WORKTREE"`. Treat every exit other than 0 or 1 as a command error and stop with its output. For a withheld push only, separately prove `git -C "$WORKTREE" merge-base --is-ancestor <PRE_REWORK_HEAD> origin/<headRefName>`: exit 0 appends `(origin moved past the rework's base <PRE_REWORK_HEAD7>)`; exit 1 adds nothing; other exits stop as command errors. Divergence alone proves no origin advance.
Read and apply [menu-layout](../brainstorming/reference/menu-layout.md) for rendering and numeric replies. Present:
```
Implementation complete. What would you like to do?

1. Push to the PR branch (PR #N, <headRefName>; appends the rework block to its description)
2. Push and create a Pull Request (PR #N already exists on this branch; gh refuses a second one)
3. Push and create a draft Pull Request (same: PR #N already exists)
4. Squash-merge to <base-branch> (no PR, no surviving branch; orphans PR #N - close it by hand)
5. Keep the branch as-is (I'll handle it later; nothing is pushed)
6. Discard this work (removes the worktree and local branch; the PR branch on origin is untouched)

Which option?
```
Withhold row 1 by omitting it and placing `Withheld: push - <reason>` under the list; retain numbers 2-6. On that withheld menu read a bare reply by its displayed label: `2`-`6` select those rows; `1` or any other number gets the clarifying question naming `2`-`6` (this one menu overrides menu-layout's count-based `1`-`N` range). Recompute preflight on return to the menu. Add no approval gate. Map rows 2-6 to the existing Options 1-5 below, including their confirmation and cleanup rules; row 6 never deletes origin's branch.
**Normal repo and named-branch worktree — present exactly these 5 options:**

Read and apply [menu-layout](../brainstorming/reference/menu-layout.md) before presenting these options and before acting on a numeric reply.

```
Implementation complete. What would you like to do?

1. Push and create a Pull Request
2. Push and create a draft Pull Request
3. Squash-merge to <base-branch> (no PR, no surviving branch)
4. Keep the branch as-is (I'll handle it later)
5. Discard this work

Which option?
```

**Detached HEAD — present exactly these 4 options:**

Read and apply [menu-layout](../brainstorming/reference/menu-layout.md) before presenting these options and before acting on a numeric reply.

```
Implementation complete. You're on a detached HEAD (externally managed workspace).

1. Push as new branch and create a Pull Request
2. Push as new branch and create a draft Pull Request
3. Keep as-is (I'll handle it later)
4. Discard this work

Which option?
```

Rows 1-2 run the Option 1/2 blocks; row 3 runs the Keep block and row 4 the Discard block.

**Don't add explanation** - keep options concise. When the minors line lists findings and the block has no `whole-diff minors fix:` line, add only this line under the menu: `Or reply "fix minors" (or "fix minors F3, F9") for one Minor fix round.` This line is the only addition to the exact numbered options.

**Standalone extra reply - `fix minors`.** When the rendered `whole-diff minors` line lists findings, `fix minors` (all) or `fix minors F3, F9` (a subset by `Fn`) is a valid reply beside the numbered options. It dispatches one `implementer` round (`cwd` = the worktree; task = the selected finding lines verbatim; `SCOPED_TEST_COMMANDS` = for PR subjects, the executable scoped union captured in Step 1, excluding `none - PR subject, scoped`; for other subjects, the plan-header verification set). For a ledger, supply its `verification:` command instead. For PR subjects, require successful evidence for every supplied command after the fix; failed or missing evidence stops before returning to the menu. Commit `whole-diff minors fix` and return to Step 3.5, where the freshness rule re-audits conformance as for any working-tree change and the regenerated block records the spent round (`whole-diff minors fix: <full SHA>`); Step 4 then re-renders. No code review follows this round: the whole-diff review is an unscoped first review, so its Minors are graded Minors. A block that already carries `whole-diff minors fix:` refuses the reply with "minors round already spent". Any numbered choice ships without them.

### Step 5: Execute Choice

#### Strip the plan, seal the record (Options 1-3)

Run this on the feature branch before any landing path. The spec and its telemetry record (`<telemetry.dir>/<spec path with .md -> .yaml>`, default `.pi/gauntlet/telemetry/doc/specs/<spec>.yaml`) are deliverables and ship in the squash; only the plan is stripped. The record is an untracked, git-excluded file until this step commits it (in a plain jj workspace there is no commit; jj snapshots the stamped record into the working-copy change). `<bin>` is `<directory of this skill's SKILL.md>/../../bin`, resolved from the skill's `<location>` in the system prompt.

Read the existing artifact's path-only `**Spec:**` header (repo-relative, backticks stripped) before removal; pass that value as `--spec`, including for a line-1 ledger. Resolve the spec dirs with `gauntlet_setting({ key: "flowGuards" })` and use their sibling `plans` dirs for plan paths. Enumerate both PLAN_PATH candidates: the task plan paired by basename and `<sibling plans dir>/<spec stem>-ledger.md`. Preserve the spec and telemetry.

```bash
# Plans are ephemeral - if one was committed on this branch, remove it before landing.
for PLAN_PATH in <basename-task-plan-path> <sibling-plans-dir>/<spec-stem>-ledger.md; do
if git -C "$WORKTREE" ls-files --error-unmatch "$PLAN_PATH" >/dev/null 2>&1; then
  git -C "$WORKTREE" rm "$PLAN_PATH" && git -C "$WORKTREE" commit -m "Remove ephemeral plan doc"
elif [ -f "$WORKTREE/$PLAN_PATH" ] && jj -R "$WORKTREE" root >/dev/null 2>&1; then
  # Plain jj workspace (no .git): the removal lands in the working-copy change; there is no commit step.
  # root: anchors the path at the workspace root - jj resolves bare paths against cwd, not -R.
  jj -R "$WORKTREE" restore --from <base-branch> -- "root:\"$PLAN_PATH\""
fi
done

# Seal the telemetry record: stamp shipped, compute the diff, commit it once.
# The bin detects a plain jj workspace (no .git) itself: jj diff, no commit step.
# --option is pr for Options 1-2 and squash for Option 3; --spec is the artifact header's **Spec:** value (omit when no artifact is known).
node <bin>/gauntlet-telemetry-seal.mjs --worktree "$WORKTREE" --option <pr|squash> --base <base-branch> --spec <spec path>
```

The seal prints one line per record (`sealed <path>`, `already sealed <path>`) or one bare outcome (`no telemetry run`, `telemetry disabled`) and exits 0; print its stdout verbatim in the ship completion message. Any nonzero exit stops the flow before the first landing command, quoting the bin's line: exit 2 (`no record at <path>`, `unparseable record <path>: <reason>`) means this gauntlet run's recorder never armed or its record is corrupt; exit 1 is a usage, environment, or git/jj failure (`seal failed <path>: <reason>` restored the pre-seal bytes). The user decides; never land without the seal.
#### PR-subject row 1: Push to the PR branch
Capture the scoped verification set and thread evidence before the strip. Refetch unresolved threads with the query owned by [pr-head](../using-git-worktrees/reference/pr-head.md); preserve recorded dispositions, use the table below, and omit threads now resolved on GitHub. Use the query's location rendering.
| Refetched thread / evidence | Resolution |
|---|---|
| Recorded `fix`, matching task title carries id, task accepted by spec and code review and `complete`, exactly one naming commit | `fixed in <sha7>` |
| Same accepted-complete task, zero or multiple naming commits | `fixed (task "<title>" complete; no single commit names <thread id>)` |
| Missing or incomplete task; recorded `keep open`; newly opened thread | `still open` |
| Recorded `decline` | `declined - <reason>` |
| Successful fetch, empty set | `Threads: none` |
| Fetch failure | `Threads: not fetched (<reason>)` |
Count naming commits with `git -C "$WORKTREE" log --first-parent --format=%h --grep '<thread id>' <merge-sha | PRE_REWORK_HEAD>..HEAD` (merge SHA from the record when present). A touched file, grep match, or first-parent filter alone is not completion proof.
Run the existing strip-and-seal block with `--option pr --base origin/<baseRefName>` and the selected spec; retain its stop-on-error behavior. This seal measures the whole PR, not rework-only; never use PRE_REWORK_HEAD as its base. Then:
```bash
git -C "$WORKTREE" update-ref refs/gauntlet/pre-rework/pr-<N> <PRE_REWORK_HEAD>
git -C "$WORKTREE" push --no-follow-tags origin HEAD:refs/heads/<headRefName>
```
Stop on update-ref failure. Report a rejected push once, skip body editing, and return to the menu without retrying or forcing. Preserve the worktree.
After a successful push, fetch the description fresh with `gh pr view <N> --json body` in the record's repository. Decode the JSON body without trimming or shell command substitution (which loses trailing newlines). Create a scratch body file with `mktemp` outside the repo; write the existing body bytes exactly, then one blank line, then this block:
```markdown
## Rework

Before: <PRE_REWORK_HEAD> (local ref `refs/gauntlet/pre-rework/pr-<N>` in the rework checkout; the SHA is the portable handle and stays on origin because the push was not forced)
Spec: <spec path> at <HEAD7>
Keeps: <from the record>
Changes: <from the record>
Dropped claims: <none | one "No longer true: <claim>" line per dropped claim>
Verification: scoped - <commands>; CI on this push holds the full run. Telemetry: whole PR against <baseRefName>.
Threads:
- <path>:<line> - <resolution from the table>
```
Put `supersedes the description above` on the block's second line only when every original claim is dropped. Use `Threads: none` or `Threads: not fetched (<reason>)` instead of the list for those outcomes. Run `gh pr edit <N> --body-file <scratch-file>` in the record's repository without another approval. On body fetch/edit failure, keep the push and print the block for manual paste with the error; never replace the description with just the block. Post no review-thread replies, merge no PR, and change no ticket state.
#### Option 1: Push and Create PR

Run the strip-and-seal block above first (plan stripped, telemetry record sealed), then:

```bash
# Push branch
git -C "$WORKTREE" push -u origin "$FEATURE"
```

```bash
# Create PR
(cd "$WORKTREE" && gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<2-3 bullets of what changed>

## Test Plan
- [ ] <verification steps>
EOF
)")
```

When the spec's `## Acceptance criteria` has at least one `venue:`, `deferred:`, or `elsewhere:` row, append this block after `## Test Plan`, listing those rows verbatim with their disposition, so the reader knows what `/skill:check-delivery` verifies before the prod deploy and what a follow-up or another repo owns. With no such rows the body ends at `## Test Plan`, byte-identical to today. Option 3's squash commit message is unchanged.

```markdown
## Acceptance criteria
- [ ] <row text verbatim> - venue: <env> - <observation>
- [ ] <row text verbatim> - deferred: <where>
- [ ] <row text verbatim> - elsewhere: <repo>
```

**Do NOT clean up worktree** — user needs it alive to iterate on PR feedback.

#### Option 2: Push and Create Draft PR

Run the strip-and-seal block above first (plan stripped, telemetry record sealed), then Option 1's push and `gh pr create` commands with `--draft` added. The PR body is unchanged. Do not clean up the worktree.

#### Option 3: Squash-merge to base

Run the strip-and-seal block above first (plan stripped, telemetry record sealed), then:

```bash
git -C "$PRIMARY" checkout <base-branch>
git -C "$PRIMARY" pull
git -C "$PRIMARY" merge --squash "$FEATURE"
git -C "$PRIMARY" commit -m "<imperative summary> (ref <ticket-id>)"
(cd "$PRIMARY" && <the Step 1 set>)
```

The plan was already removed and the telemetry record sealed on the branch, so the staged squash tree carries the spec, the telemetry record, and the implementation - never the plan.

The post-squash re-verify is not optional - `git merge --squash` can surface conflict-resolution mistakes the worktree-side run couldn't catch.

Cleanup worktree (Step 6), then, if Step 6 removed the worktree, `git -C "$PRIMARY" branch -D "$FEATURE"`.

**No push. No PR.** The squashed commit stays local on `<base-branch>` unless the user explicitly asks to push.

#### Option 4: Keep As-Is

Report: "Keeping branch <name>. Worktree preserved at <path>." The telemetry record stays untracked and in_progress in the worktree; a later finishing run on this worktree seals it.

**Don't cleanup worktree.**

#### Option 5: Discard

**Confirm first:**
```
This will permanently delete:
- Branch <name>
- All commits: <commit-list>
- Worktree at <path>

Type 'discard' to confirm.
```

Wait for exact confirmation.

If confirmed: Cleanup worktree (Step 6), then, if Step 6 removed the worktree, `git -C "$PRIMARY" branch -D "$FEATURE"`. The record is git-excluded, so git worktree remove needs no --force; it goes with the worktree.

### Step 6: Cleanup Workspace

**Only runs for the Squash-merge and Discard options (3 and 5).** The PR, draft PR, and Keep options always preserve the worktree.

Read the gauntlet overrides file now (ladder in Project overrides) and its `## using-git-worktrees` section; nothing from creation time is carried - the file is the contract (keys written like `## cleanup` items: `using-git-worktrees/SKILL.md` Step 1a).

**Keyed contract** - the section has at least one of `- home:`, `- create:`, `- destroy:`:

1. Resolve `home:` against `$PRIMARY` (absent -> `$PRIMARY/.worktrees/<name>`; an absolute value is used as-is). `<name>` must appear exactly once, inside one path segment that may carry a literal prefix or suffix; otherwise stop and name the line.
2. Ownership match: canonicalize both sides (`realpath`) and compare `$WORKTREE` to the resolved pattern, treating the `<name>` segment as `<prefix>*<suffix>` where `*` matches the remainder of that one segment. The text `*` matched is `NAME` - the creation identifier (`jacek/fix-x` was created as `jacek-fix-x`; `home: ../acme-mono-<name>` recovers `fix-x` from `acme-mono-fix-x`). A pattern that cannot isolate one segment -> stop and report.
3. Match and `destroy:` set -> run it from `$PRIMARY` with `<name>` -> `'NAME'` and `<branch>` -> `'$FEATURE'`, each value one single-quoted shell word (`'...'`, an embedded `'` escaped), any other `<token>` resolved from context or asked once, never executed raw. Non-zero exit -> print its output, keep the branch, end this step; never fall back to `git worktree remove --force`. On success, run no `git worktree remove` or `prune`; continue to `git -C "$PRIMARY" branch -D "$FEATURE"`.
4. Match and no `destroy:` -> `git -C "$PRIMARY" worktree remove "$WORKTREE"` then `git -C "$PRIMARY" worktree prune`; after success, continue to `git -C "$PRIMARY" branch -D "$FEATURE"`.
5. No match -> the host environment owns this workspace: remove nothing, skip the branch deletion that follows, report that the host-owned worktree still holds `$FEATURE`.

**Legacy path** - no overrides file, no section, or a keyless section:

**If the worktree was created by a project-native script** (e.g. `script/worktree create`, `bin/worktree`): defer to its destroy command, run against the primary: `"$PRIMARY/script/worktree" destroy "${WORKTREE##*/}"`.

**If `$WORKTREE` is under `$PRIMARY/.worktrees/` or `~/.worktrees/<project>/`:** gauntlet created it - we own cleanup:

```bash
git -C "$PRIMARY" worktree remove "$WORKTREE"
git -C "$PRIMARY" worktree prune
```

Removal precedes branch deletion in both options; `git branch -d`/`-D` fails while the worktree still references the branch.

**Otherwise:** the host environment owns this workspace. Do NOT remove it, and skip the branch deletion that follows - report that the host-owned worktree still holds `$FEATURE`.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch | Plan strip + record seal |
|---|---|---|---|---|---|
| PR row 1. Push to PR branch | - | yes (non-force) | yes | - | yes (whole PR; see row 1 recipe) |
| 1. Create PR | - | yes | yes | - | yes (guarded, on the branch before push) |
| 2. Create draft PR | - | yes | yes | - | yes (guarded, on the branch before push) |
| 3. Squash-merge locally | yes (squash) | - | - | yes (after Step 6 removal) | yes (guarded, on the branch before squash) |
| 4. Keep as-is | - | - | yes | - | - |
| 5. Discard | - | - | - | yes (force, after Step 6 removal) | - |

A host-owned worktree (Step 6: no `home:` match, or the legacy "Otherwise") keeps both the worktree and the branch.

## Common Mistakes

**Skipping test verification**
- **Problem:** Merge broken code, create failing PR
- **Fix:** Verify, or apply the Step 1 skip rule, before offering options

**Open-ended questions**
- **Problem:** "What should I do next?" is ambiguous
- **Fix:** Use the Step 4 subject-specific menu

**Cleaning up worktree for a PR option (1 or 2)**
- **Problem:** Remove worktree user needs for PR iteration
- **Fix:** Only cleanup for the Squash-merge and Discard options (3 and 5)

**Deleting branch before removing worktree**
- **Problem:** `git branch -d` fails because worktree still references the branch
- **Fix:** Merge first, remove worktree, then delete branch

**Removing the worktree with the wrong `-C`**
- **Problem:** `git worktree remove` run against the worktree itself fails
- **Fix:** `git -C "$PRIMARY" worktree remove "$WORKTREE"`

**Cleaning up harness-owned worktrees**
- **Problem:** Removing a worktree the harness created causes phantom state
- **Fix:** Only clean up worktrees that match the `home:` pattern of `## using-git-worktrees`, or - on the legacy path - under `.worktrees/`, `~/.worktrees/<project>/`, or paths produced by a project-native worktree script

**No confirmation for discard**
- **Problem:** Accidentally delete work
- **Fix:** Require typed "discard" confirmation

**Skipping the strip-and-seal block in Options 1-3 (any path that lands on base)**
- **Problem:** Plan docs are ephemeral and shouldn't land on `<base-branch>`; the telemetry record is a deliverable and must. Skipping the block ships the plan, or drops the record the spec index reads.
- **Fix:** Run the block on `$WORKTREE` before the squash or the push. The plan stays in the branch's git history (`git -C "$PRIMARY" log --all -- doc/plans/...`). Spec and telemetry record stay on `<base-branch>`; plan does not.

**Widening the plan strip to the telemetry record**
- **Problem:** `.pi/gauntlet/telemetry/**` looks like scaffolding next to the plan and gets deleted in the same commit - main then has no record for the run.
- **Fix:** Never `git rm` under the telemetry dir. Until the seal the record is untracked and git-excluded, so a plan strip cannot reach it; after the seal it is a committed deliverable.

## Completion

Once the chosen option (Options 1-4 or PR-subject row 1 - not Discard) is executed successfully, mark the ship phase complete:

```
phase_tracker({ action: "complete", phase: "ship" })
```

Once the merge (and any deploy) has landed, `/skill:check-delivery <ticket-ref>` is the explicit follow-up that proves delivery before the ticket's status advances - not run automatically here.

## Red Flags

**Never:**
- Proceed with failing tests
- Merge without verifying tests on result
- Delete work without confirmation
- Force-push without explicit request
- Force-push a PR-subject rework; follow its row 1 recipe
- Remove a worktree before confirming merge success
- Clean up worktrees you didn't create (provenance check)
- Retry a failed `destroy:` with `git worktree remove --force`
- Run any step without the `<worktree-path>` argument
- Auto-proceed past an undispositioned carried-open gap
- Skip the strip-and-seal block before the Option 3 squash or the Option 1/2 push
- Delete the telemetry record (`.pi/gauntlet/telemetry/**` or the configured `telemetry.dir`) on any path

**Always:**
- Verify, or apply the Step 1 skip rule, before offering options
- Print the `gauntlet-telemetry-seal.mjs` output verbatim in the ship completion message
- Derive `$PRIMARY` and `$FEATURE` from `<worktree-path>` before presenting the menu
- Use the Step 4 subject-specific menu
- Get typed confirmation for Option 5 (Discard)
- Clean up worktree for Options 3 & 5 (Squash-merge, Discard) only
- Target `$PRIMARY` with `git -C` for merge, worktree removal, and branch deletion
- Run `git -C "$PRIMARY" worktree prune` after removal
- Match `$WORKTREE` against the `home:` pattern of `## using-git-worktrees` before removing anything when the keyed contract is active
- Surface the closure / conformance verdict as its own section before the options menu

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
