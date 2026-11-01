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

**Announce at start (after the marker on marked messages):** "I'm using the gauntlet-resume skill to continue an interrupted flow."

## Boundaries

- Reads: anything.
- Writes: `phase_tracker` / `plan_tracker` state after every check passes and every
  human question is answered; the plan file, only through `reference/brief-contract.md`
  `## Plan repair`; the ledger through `reference/reconstruction.md` pending recovery and the loop driver's admission/repair contract; on the seed route, what `/skill:using-git-worktrees` writes. Never a spec copy, rename, or marker commit.
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

Read and apply [menu-layout](../brainstorming/reference/menu-layout.md) before presenting these options and before acting on a numeric reply.

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
| anything else | stop: "this is a new idea - run /skill:brainstorming" |

A relative token resolves against the session cwd; a bare `name.md` absent there is
tried at `<primary>/<specDir>/name.md` per resolved spec dir in order, first hit wins.
`<primary>` is the checkout owning `.worktrees/`:
`dirname "$(git rev-parse --path-format=absolute --git-common-dir)"` run in the session
cwd - absolute from any primary subdirectory and from inside a linked worktree
(`--show-toplevel` would return the linked worktree there). A pasted brief that needs
an override uses the file form. A brief then runs entry checks 1-6, so a stale or
foreign-repo brief stops there.

## Entry checks

For an entry-check stop, start with the terminal marker and retain the offending path, field, or line. Start the message with `gauntlet: stuck` followed by the reason on that line.

In order. All before any tracker mutation; entry check 1 is read-only. A spec
seed runs check 1 here, then `reference/seed.md`, which runs check 3 itself;
checks 2, 4, 5 do not apply; check 6 runs on the seed's pinned spec path.

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
   different repository; restart pi in that repository's primary checkout and re-run. For member-primary entry on a coordinated brief, also print `home is <repo>; restart there`, naming the run home.
   Same-repository worktrees proceed by path: use `git -C <worktree>` for
   worktree Git commands and absolute artifact paths for `Read` and `plan_check`.
3b. **Coordinated admission.** For a multi-member brief, read and apply `reference/brief-contract.md` "Coordinated admission" before any tracker write: resolve the home spec without inferring approval, compare ordered membership, validate each declared primary/common directory, shared branch and full home tuple, and live-validate receipts before admitting any missing tree. Preserve check 3's home binding.
4. **Drift notice.** Compare the brief's `HEAD` and `dirty` fields in `## Repo state`
   with the live worktree (`git -C <worktree> rev-parse HEAD`, `git -C <worktree>
   status --porcelain`). For coordinated briefs apply `reference/brief-contract.md` "Coordinated admission" per leg. Announce differences. Informational, never a stop.
5. **Skills loaded.** For each name in `## Skills loaded` (none for
   `## Skills loaded: none`): match against the frontmatter `name` of every
   `skills/*/SKILL.md` in this package; `Read` each match's complete file into the
   transcript; list non-matches as skipped. Loaded bodies are context only - no skill's
   entry actions run until Dispatch names one.
6. **Grant field.** Run deferred-header admission whenever a route resolves an existing spec, including brainstorm-stage process-state restore and reconstruction's unapproved-draft handoff, before any tracker mutation or brainstorming invocation. Carry the resolved `<spec path>` without re-resolving it: use `reference/brief-contract.md` "Process-state restore", `reference/reconstruction.md`, or the seed's pinned `<full-path>/<rel>` (`reference/seed.md`).
   Read the spec's header block (between the H1 and the first `##`). An exact `**Engine:** deferred` stops with `spec approved for handoff only - run brainstorming #N`; make no phase_tracker or plan_tracker mutation. After deferred-header admission, apply the grant predicate only for an approved spec in
   [Standing grants](../brainstorming/reference/amendment-surface.md#standing-grants): no
   `**Amend-grant:**` line -> no grant (legacy spec);
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
| brief with `## Process state` | process-state restore - `reference/brief-contract.md` "Process-state restore" |
| brief without process state, `## Skills loaded` names `chase-bug` | hotfix route below, before any artifact reconstruction, no tracker calls |
| brief without process state, `worktree: no` | offer `/skill:brainstorming` with `## Intent` as the idea and wait for explicit selection; then invoke [`/skill:brainstorming`](../brainstorming/SKILL.md) in the current directory; resume creates no worktree - brainstorming's own Worktree First applies (a plain handoff is a new flow) |
| brief without process state, worktree present | `reference/reconstruction.md`, with `## Intent` and `## Decisions` carried into every confirmation prompt |
| bare worktree | `reference/reconstruction.md`; prompts state that no brief context is available (never invent Intent/Decisions) |
| spec seed | `reference/seed.md` |

**Hotfix route.** `skills/chase-bug/hotfix.md` consumes only a hotfix record at
`$TMPDIR/hotfix-<slug>.md`. If `## Decisions` or `## Intent` names an existing record
path, hand it to hotfix.md and skip its worktree-create step when the brief's worktree
exists (reuse it). Otherwise invoke `/skill:chase-bug` triage with `## Intent` to
re-derive the record.

## Post-restore continuation

A successful restore is an automatic handoff, not a terminal report; let the resumed skill own the next ask and its marker. Keep the brief fields unchanged and infer no approval. After citation repair of a plan that was dirty or untracked before repair, state explicitly that the repair stays in the working copy and lands with the next task commit; run no `git add` or repair commit, per `reference/brief-contract.md` "Citation repair".

After a successful restore, print the closing line from `reference/brief-contract.md`
(gate history not restored; the task to re-validate), then on its own line exactly one of `Standing grant active: <sentence>` or `No standing grant.` from check 6 (nothing when grant decoding was skipped), then continue in the stage's
owning skill **without** its reset-bearing entry:

| Active after restore | Continue in | Entry point |
|---|---|---|
| brainstorm | [brainstorming checklist](../brainstorming/SKILL.md#checklist) | on-disk state decides the step: draft marker on line 1 of the spec file -> step 4; spec title -> step 8. Never `/skill:brainstorming` entry (it resets both trackers) |
| approved spec with `**Engine:** loop`, no ledger | loop-implementation | after check 6, arm with `start brainstorm`, then `skip brainstorm resume: <spec path>` before driver admission; carry absolute worktree/spec paths and plan directory through Entry steps 1-5 per `reference/reconstruction.md` "Spec without plan": label Entry steps 1-5 explicitly in the response as Entry step 1: resolved settings; Entry step 2: verification; Entry step 3: driver's plan skip; Entry step 4: clean named-branch check and ledger creation; Entry step 5: `plan_check`, commit and implement start; no writing-plans body or task tracker initialization; refresh by ledger path after implement starts |
| plan with task engine | writing-plans body | skip its `start plan` call (already in_progress) |
| implement with line-1 ledger | loop-implementation | complete `reference/reconstruction.md` "Spec with ledger" ordered restore, cited by `reference/brief-contract.md`'s call table: entry checks 1-6, brainstorm start/skip, plan start/check/skip with reason `resume: <spec> (loop engine)`, implement start, pending recovery, then one ledger-path refresh, no `init`; state the entire ordered sequence explicitly even when entry checks are already reported as passed; then continue at step 5 (`Before each dispatch`), applying the shared cap boundary in reconstruction step 4 before continuation and preserving ledger cap, iterations/retry data; recover home or companion returns before refresh and any unresolved dirty-tree stop; reuse the existing ledger |
| implement with task plan | subagent-driven-development | re-validate `<task>` first (re-run its `Tests:`), then the task loop from the first non-complete task |
| verify with `Ledger:` (including ship-stage ledger briefs restored at verify) | /skill:loop-implementation | after `start verify`, restore the saved mixed task list with `init` as `reference/brief-contract.md` specifies, then pending recovery and one ledger-path refresh through the shared cap boundary in `reference/reconstruction.md` "Spec with ledger" step 4; legacy briefs without tasks go directly to refresh; render cap and observed task/ledger state; read `After the loop` and its references; continue from `After the loop` step 1, the gate set per the loop skill's `## Gate set`; let that skill own execution, with no resume-owned gate run; retain whole-diff code review, happy path when triggered, fresh home conformance review and finishing; never start implement or synthesize Gn completion |
| verify without `Ledger:` | verification-before-completion | full conformance gate; nothing carried over |

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
`<repo root>/doc/gauntlet-overrides.md`; first found wins - read it once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it. Read
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
