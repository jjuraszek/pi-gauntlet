---
name: gauntlet-resume
description: Use when a human wants to continue an interrupted gauntlet flow in a fresh session - from a gauntlet-handoff brief (file, pasted, or picked from the default handoff directory), from a bare worktree that already holds a spec, or from a spec tracked on main (creates or reuses its worktree via `../gauntlet/worktrees.md`). Human-only; the sole resume entry point. Restores phase/plan tracker state through the legal arming sequence, never infers approval.
disable-model-invocation: true
argument-hint: "[<brief-file> | <spec>.md | <worktree-name-or-path>]"
---

> After restoration, follow the route in [Post-restore continuation](#post-restore-continuation).

# Gauntlet Resume

## Overview

Re-enter an interrupted gauntlet flow in a fresh session. Three inputs: a handoff brief
produced by `/skill:gauntlet-handoff` (grammar in `reference/brief-contract.md`), a bare
worktree whose spec/plan artifacts are reconstructed into tracker state
(`reference/reconstruction.md`), a spec seed (`reference/seed.md`). Every check runs
before any tracker mutation; every stop names the offending path, field, or line.
`Read` each reference in full at the step that names it, never from memory; a missing
or unreadable reference stops the route, naming its path.

**Announce at start (after the marker on marked messages):** "I'm using the gauntlet-resume skill to continue an interrupted flow."

## Boundaries

- Reads: anything.
- Writes: `phase_tracker` / `plan_tracker` state after every check passes and every
  human question is answered; the plan file, only through the plan repair that
  `reference/restore-plan.md` enters on a `plan_check` FAIL; the ledger through `reference/restore-loop.md` "Pending recovery" and the loop driver's admission/repair contract; on the seed route, what `../gauntlet/worktrees.md` writes. Never a spec copy, rename, or marker commit.
- Never: `git worktree add` directly; worktree creation by resume itself only on
  the seed route, only through `../gauntlet/worktrees.md`; infer approval from
  artifact presence; restore
  gate history, closure-review evidence, or fix rounds; start a later phase directly
  (that does not arm the flow).

## Arguments

`/skill:gauntlet-resume [<token>] [<worktree>]` - zero to two positional tokens, plus
optional pasted text after the command line. Count tokens first; then first match wins.
Spec dirs resolve per `reference/reconstruction.md` "Candidates" (`flowGuards.specDirs`
precedence).

Read and apply [menu-layout](../gauntlet/menu-layout.md) before presenting these options and before acting on a numeric reply.

For the discovery menu, start the message with the marker specified below. Start the message with `gauntlet: gate=gauntlet-resume/discovery`.
For no briefs and every stop route in the table, end without mutation. Start the message with `gauntlet: stuck` followed by the existing reason on that line.

| Input | Route |
|---|---|
| no tokens, no pasted text | discovery: `<tmpdir>` via `node -p "require('os').tmpdir()"`; candidates are the regular files directly under `<tmpdir>/pi-handoff/` ending `.md` (non-recursive) whose line 1 starts `# Handoff:`; sorted by mtime, newest first; displayed one per line as `<n>. <title line> - <worktree: field value> - <mtime ISO-8601>` with `worktree: unavailable` when the field is absent; the human picks `<n>` (a single candidate is still confirmed); none -> STOP "no handoff briefs found under <tmpdir>/pi-handoff" |
| pasted text, line 1 starts `# Handoff:` | brief |
| two tokens, first an existing file with line 1 `# Handoff:` | brief with worktree override: required when the brief's worktree field is `no`/`unavailable`/not a git repo; must equal the brief's worktree after `realpath` otherwise |
| two tokens, first a spec seed | stop: `a spec seed takes no worktree: <second token>` |
| one token, existing regular file, line 1 starts `# Handoff:` | brief |
| one token, existing regular file ending `.md`, `realpath` under `<primary>/<specDir>` | spec seed - `reference/seed.md` |
| one token, existing regular file, anything else | stop: `not a handoff brief and not under <specDirs>: <path>` |
| one token, existing directory that is a git worktree root (`git -C <dir> rev-parse --show-toplevel` equals its `realpath`) other than `<primary>` | worktree |
| one token, missing path (ends `.md` or contains a separator) | stop: `not found: <path>` |
| one token, bare name | worktree at `<primary>/.worktrees/<name>`; missing or not a git worktree -> entry check 2 stop |
| anything else | stop: "this is a new idea - run /skill:gauntlet" |

A relative token resolves against the session cwd; a bare `name.md` absent there is
tried at `<primary>/<specDir>/name.md` per resolved spec dir in order, first hit wins.
`<primary>` is the checkout owning `.worktrees/`:
`dirname "$(git rev-parse --path-format=absolute --git-common-dir)"` run in the session
cwd - absolute from any primary subdirectory and from inside a linked worktree
(`--show-toplevel` would return the linked worktree there). A pasted brief that needs
an override uses the file form. A brief then runs entry checks 1-6, so a stale or
foreign-repo brief stops there.

## Entry checks

For an entry-check stop, retain the offending path, field, or line. Start the message with `gauntlet: stuck` followed by the reason on that line.

In order. All before any tracker mutation; entry check 1 is read-only. A spec
seed runs check 1 here, then `reference/seed.md`, which runs check 3 itself;
checks 2, 4, 5 do not apply; check 6 runs on the seed's pinned spec path.

For a brief, `Read` `reference/brief-contract.md` in full before check 2.

**Membership test.** A brief that carries a `legs:` block is multi-repo: `Read` `reference/coordinated.md` in full before check 3 and apply it at
checks 3, 3b and 4, before any tracker write. Without that block, read nothing from
that file.

1. **Idle session.** `phase_tracker({ action: "status" })`. Read no phase file from status. Any phase not pending ->
   stop: "session already carries flow state - reset is your call".
2. **Target worktree.** Resolve from the brief's `worktree:` field, the override, or the
   bare argument. Stops: path missing or `git -C <path> rev-parse --is-inside-work-tree`
   fails; override and brief worktree differ after `realpath`; brief has no
   `## Repo state` heading (prefix match); brief worktree is `no`, `unavailable`, or
   `not a git repo` and no override was given - except a `worktree: no` brief **without**
   process state, which is the brainstorming route in Dispatch, not a stop. Other
   `unavailable` fields inside `## Repo state` are legal.
3. **Same-repository binding.** Settings and flow guards come from the repository in
   the extension's session cwd. Compare
   `realpath "$(git rev-parse --path-format=absolute --git-common-dir)"` in the session
   cwd with
   `realpath "$(git -C <worktree> rev-parse --path-format=absolute --git-common-dir)"`.
   If they differ, stop, name both paths, and say the resolved worktree belongs to a
   different repository; restart pi in that repository's primary checkout and re-run.
   Same-repository worktrees proceed by path: use `git -C <worktree>` for
   worktree Git commands and absolute artifact paths for `Read` and `plan_check`.
4. **Drift notice.** Compare the brief's `HEAD` and `dirty` fields in `## Repo state`
   with the live worktree (`git -C <worktree> rev-parse HEAD`, `git -C <worktree>
   status --porcelain`). Announce differences. Informational, never a stop.
5. **Skills loaded.** For each name in `## Skills loaded` (none for
   `## Skills loaded: none`): match against the frontmatter `name` of every
   `skills/*/SKILL.md` in this package; `Read` each match's complete file into the
   transcript; list non-matches as skipped. Loaded bodies are context only - no skill's
   entry actions run until Dispatch names one.
6. **Grant field.** Run deferred-header admission whenever a route resolves an existing spec, including brainstorm-stage process-state restore and reconstruction's unapproved-draft handoff, before any tracker mutation or brainstorming invocation. Carry the resolved `<spec path>` without re-resolving it: use the restore reference's path, `reference/reconstruction.md`, or the seed's pinned `<full-path>/<rel>` (`reference/seed.md`).
   Read the spec's header block (between the H1 and the first `##`). An exact `**Engine:** deferred` stops with `spec approved for handoff only - run brainstorming #N`; make no phase_tracker or plan_tracker mutation. After deferred-header admission, apply the grant predicate only for an approved spec in
   [Standing grants](../gauntlet/amendment-surface.md#standing-grants): no
   `**Amend-grant:**` line -> no grant;
   exactly one line whose trimmed value is `none` -> no grant;
   exactly one line whose trimmed value is any other non-empty single-line text ->
   grant active, the sentence is that value;
   two or more lines, one line with an empty value, or a value continued onto the next physical line ->
   malformed, stop, print the offending line(s), no tracker call. Skip only grant decoding for routes that resolve no
   approved spec (hotfix, `worktree: no`, a brief whose active phase is brainstorm,
   reconstruction's unapproved-draft brainstorming handoff); print no grant line.
   Resume reports the line; it never writes it.

## Dispatch

For the `worktree: no` brainstorming offer, keep the explicit-selection wait. Start the message with exactly `gauntlet: question` on its own line, with no suffix.

| Input | Route |
|---|---|
| brief with `## Process state` and a `Ledger:` field | `reference/reconstruction.md`, then `reference/restore-loop.md`: "Ledger admission", "Spec with ledger" |
| brief with `## Process state` and no `Ledger:` field, at any stage | `reference/reconstruction.md`, then `reference/restore-plan.md`: "Process-state restore" |
| brief without process state, `## Skills loaded` names `chase-bug` | hotfix route below, before any artifact reconstruction, no tracker calls |
| brief without process state, `worktree: no` | offer `/skill:gauntlet` with `## Intent` as the idea and wait for explicit selection; then invoke [`/skill:gauntlet`](../gauntlet/SKILL.md) in the current directory; resume creates no worktree - brainstorming's own Worktree First applies (a plain handoff is a new flow) |
| brief without process state, worktree present | `reference/reconstruction.md` |
| bare worktree | `reference/reconstruction.md` |
| spec seed | `reference/seed.md` |

**Engine test.** The two process-state rows above select by the `Ledger:` field alone,
whatever the spec's `**Engine:**`. On the other routes, after "Candidates" has classified
the artifacts: one spec with a ledger (a plan-dir file whose line 1 is
`# Ledger - loop engine`; takes precedence over a task plan) -> `reference/restore-loop.md`;
one spec with a task plan only, or seed step 8 finding a plan beside the pinned spec ->
`reference/restore-plan.md` "Spec with plan"; no spec, more than one spec, or one spec
without a plan -> no restore reference, the route stays in `reference/reconstruction.md`.

**Hotfix route.** `skills/chase-bug/hotfix.md` consumes only a hotfix record at
`$TMPDIR/hotfix-<slug>.md`. If `## Decisions` or `## Intent` names an existing record
path, hand it to hotfix.md and skip its worktree-create step when the brief's worktree
exists (reuse it). Otherwise invoke `/skill:chase-bug` triage with `## Intent` to
re-derive the record.

## Restore rules

Facts that fix the arming order:

- Arming happens only on `start brainstorm`; `reset` disarms; `skip` and `complete`
  preserve it.
- `plan_check` stamps only inside an armed flow; unarmed it returns
  `PASS (no flow to stamp)`.
- `start implement` is rejected without a current `plan_check` stamp.
- `skip` has no state precondition and takes a `reason`; one phase is active at a time.
- `complete verify` is blocked without a fresh `conformance-reviewer` dispatch when
  closure review is enforced.
- `plan_tracker init` on an in-progress implement with every task `complete`/`skipped`
  auto-completes implement.

"Exact" restoration binds: the active phase identity and substep, and the plan task list
(names, order, statuses) verbatim. Prior phases show `⊘ (resume: ...)` regardless of the
brief's glyph - skip-arming is the mechanism and completing priors would fabricate gated
history. `No plan active.` -> no `init` call.

Before `init`, validate feasibility against the tracker's own rules:

- pending-suffix order - every `○` task must trail every non-pending task;
- the implement auto-complete edge - an implement brief whose tasks are all
  complete/skipped is infeasible as stated; propose verify as the target and ask.

Every restore ends with the closing line:

```
Gate history not restored; re-validating `<task>` before any stage advance
```

`<task>` is `ledger rows` for a ledger; for a task plan it is the brief's `Active task`,
else the first in-progress task, else `none` (whole-deliverable re-validation).

## Post-restore continuation

A successful restore is an automatic handoff, not a terminal report; let the resumed skill own the next ask and its marker. Keep the brief fields unchanged and infer no approval. After plan repair of a plan that was dirty or untracked before repair, state explicitly that the repair stays in the working copy and lands with the next task commit; run no `git add` or repair commit.

After a successful restore, print the closing line, then on its own line exactly one of `Standing grant active: <sentence>` or `No standing grant.` from check 6 (nothing when grant decoding was skipped), then continue in the stage's
owning skill **without** its reset-bearing entry:

| Active after restore | Continue in | Entry point |
|---|---|---|
| brainstorm | [brainstorming checklist](../gauntlet/SKILL.md#checklist) | on-disk state decides the step: draft marker on line 1 of the spec file -> step 4; spec title -> step 8. Never `/skill:gauntlet` entry (it resets both trackers) |
| approved spec with `**Engine:** loop`, no ledger | `../gauntlet/implement/loop/loop.md` | Entry steps 1-5, carried and labeled as `reference/reconstruction.md` "Spec without plan" states; a restored plan-stage brief makes no second arming call |
| plan with task engine | `../gauntlet/plan/plan.md` body | skip its `start plan` call (already in_progress) |
| implement with a ledger | `../gauntlet/implement/loop/loop.md` | `reference/restore-loop.md` "Spec with ledger" step 9: `Before each dispatch`; reuse the existing ledger |
| implement with task plan | `../gauntlet/implement/waves/waves.md` | re-validate `<task>` first (re-run its `Tests:`), then the task loop from the first non-complete task |
| verify with `Ledger:` (including ship-stage ledger briefs restored at verify) | `../gauntlet/implement/loop/loop.md` | `reference/restore-loop.md` "Spec with ledger" step 9: `After the loop` step 1; never start implement |
| verify without `Ledger:` | `../gauntlet/verify/verify.md` | full conformance gate; nothing carried over |

## Red flags — STOP

- Any `phase_tracker` or `plan_tracker` mutation before the route's entry checks pass and
  every human question is answered.
- `start <phase>` for anything other than brainstorm as the first arming call.
- `complete` on a prior phase during restore (priors are `skip`ped with a `resume:` reason).
- Running `git worktree add` directly, or `cd`-ing to "fix" a cwd mismatch.
- Accepting a free-form prompt as a brief.

## Project overrides
If a gauntlet overrides file exists - checked in order:
`.pi/gauntlet.md`, `<repo root>/gauntlet.md`,
`<repo root>/doc/gauntlet.md`; first found wins - read it once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it. Read
and apply `## conventions` whenever present, without a relevance
judgment.
Give this skill's named section precedence over conflicting
`## conventions` rules. Use other relevant sections - by name match,
by topic (routing,
verification, worktrees, etc.), or by workflow convention - to override or
extend the instructions above. Project-local `AGENTS.md` is already in
context - check it for project-specific routing tables, service paths, and
verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
