---
name: gauntlet-resume
description: Use when a human wants to continue an interrupted gauntlet flow in a fresh session - from a gauntlet-handoff brief (file, pasted, or picked from the default handoff directory), from a bare worktree that already holds a spec, or from a spec tracked on main (creates or reuses its worktree via `/skill:using-git-worktrees`). Human-only; the sole resume entry point. Restores phase/plan tracker state through the legal arming sequence, never infers approval.
disable-model-invocation: true
argument-hint: "[<brief-file> | <spec>.md | <worktree-name-or-path>]"
---

> **Related skills:** Continues into `/skill:writing-plans`, `/skill:subagent-driven-development`, or `/skill:verification-before-completion` depending on the restored stage. `/skill:brainstorming` is where new ideas go - a free-form prompt is not a resume input.

# Gauntlet Resume

## Overview

Re-enter an interrupted gauntlet flow in a fresh session. Three inputs: a handoff brief
produced by `/skill:gauntlet-handoff` (grammar in `reference/brief-contract.md`), a bare
worktree whose spec/plan artifacts are reconstructed into tracker state
(`reference/reconstruction.md`), a spec seed (`reference/seed.md`). Every check runs
before any tracker mutation; every stop names the offending path, field, or line.

**Announce at start:** "I'm using the gauntlet-resume skill to continue an interrupted flow."

## Boundaries

- Reads: anything.
- Writes: `phase_tracker` / `plan_tracker` state after every check passes and every
  human question is answered; on the seed route, what `/skill:using-git-worktrees`
  writes. Never a spec copy, rename, or marker commit.
- Never: `git worktree add` directly; worktree creation by resume itself only on
  the seed route, only through `/skill:using-git-worktrees`; infer approval from
  artifact presence; restore
  gate history, closure-review evidence, or fix rounds; start a later phase directly
  (that does not arm the flow).

## Arguments

`/skill:gauntlet-resume [<token>] [<worktree>]` - zero to two positional tokens, plus
optional pasted text after the command line. Count tokens first; then first match wins.
Spec dirs resolve per `reference/reconstruction.md` "Candidates" (`flowGuards.specDirs`
precedence).

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
| anything else | stop: "this is a new idea - run /skill:brainstorming" |

A relative token resolves against the session cwd; a bare `name.md` absent there is
tried at `<primary>/<specDir>/name.md` per resolved spec dir in order, first hit wins.
`<primary>` is the checkout owning `.worktrees/`:
`dirname "$(git rev-parse --path-format=absolute --git-common-dir)"` run in the session
cwd - absolute from any primary subdirectory and from inside a linked worktree
(`--show-toplevel` would return the linked worktree there). A pasted brief that needs
an override uses the file form. A brief then runs entry checks 1-5, so a stale or
foreign-repo brief stops there.

## Entry checks

In order. All before any tracker mutation; entry check 1 is read-only. A spec
seed runs check 1 here, then `reference/seed.md`, which runs check 3 itself;
checks 2, 4, 5 do not apply.

1. **Idle session.** `phase_tracker({ action: "status" })`. Any phase not pending ->
   stop: "session already carries flow state - reset is your call".
2. **Target worktree.** Resolve from the brief's `worktree:` field, the override, or the
   bare argument. Stops: path missing or `git -C <path> rev-parse --is-inside-work-tree`
   fails; override and brief worktree differ after `realpath`; brief has no
   `## Repo state` heading (prefix match: `## Repo state` or
   `## Repo state: not a git repo`); brief worktree is `no`, `unavailable`, or
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

## Dispatch

| Input | Route |
|---|---|
| brief with `## Process state` | process-state restore - `reference/brief-contract.md` "Process-state restore" |
| brief without process state, `## Skills loaded` names `chase-bug` | hotfix route below, before any artifact reconstruction, no tracker calls |
| brief without process state, `worktree: no` | invoke `/skill:brainstorming` with `## Intent` as the idea, in the current directory; resume creates no worktree - brainstorming's own Worktree First applies (a plain handoff is a new flow) |
| brief without process state, worktree present | `reference/reconstruction.md`, with `## Intent` and `## Decisions` carried into every confirmation prompt |
| bare worktree | `reference/reconstruction.md`; prompts state that no brief context is available (never invent Intent/Decisions) |
| spec seed | `reference/seed.md` |

**Hotfix route.** `skills/chase-bug/hotfix.md` consumes only a hotfix record at
`$TMPDIR/hotfix-<slug>.md`. If `## Decisions` or `## Intent` names an existing record
path, hand it to hotfix.md and skip its worktree-create step when the brief's worktree
exists (reuse it). Otherwise invoke `/skill:chase-bug` triage with `## Intent` to
re-derive the record.

## Post-restore continuation

After a successful restore, print the closing line from `reference/brief-contract.md`
(gate history not restored; the task to re-validate), then continue in the stage's
owning skill **without** its reset-bearing entry:

| Active after restore | Continue in | Entry point |
|---|---|---|
| brainstorm | brainstorming checklist | on-disk state decides the step: draft marker on line 1 of the spec file -> step 4; spec title -> step 8. Never `/skill:brainstorming` entry (it resets both trackers) |
| plan | writing-plans body | skip its `start plan` call (already in_progress) |
| implement | subagent-driven-development | re-validate `<task>` first (re-run its `Tests:`), then the task loop from the first non-complete task |
| verify | verification-before-completion | full conformance gate; nothing carried over |

## Red flags — STOP

- Any `phase_tracker` or `plan_tracker` mutation before the route's entry checks pass and
  every human question is answered.
- `start <phase>` for anything other than brainstorm as the first arming call.
- `complete` on a prior phase during restore (priors are `skip`ped with a `resume:` reason).
- Running `git worktree add` directly, or `cd`-ing to "fix" a cwd mismatch.
- Accepting a free-form prompt as a brief.

## Project overrides
If a gauntlet overrides file exists - checked in order:
`.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`,
`<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read
and apply `## conventions` whenever present, without a relevance
judgment.
Give this skill's named section precedence over conflicting
`## conventions` rules. Use other relevant sections - by name match,
by topic (routing,
verification, worktrees, etc.), or by workflow convention - to override or
extend the instructions above. Project-local `AGENTS.md` is already in
context - check it for project-specific routing tables, service paths, and
verification commands.
