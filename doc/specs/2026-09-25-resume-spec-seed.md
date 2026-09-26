# Resume from a spec seed

**Goal:** `/skill:gauntlet-resume <spec>.md` starts a flow at plan creation from a spec already tracked on main, creating or reusing the worktree through `/skill:using-git-worktrees` and pinning the spec so reconstruction skips its candidate scan. Flows started this way remain resumable by every existing route.

Supersedes `doc/specs/2026-09-17-gh-31-gauntlet-resume.md`, scope: the "never runs `git worktree add`" boundary and the argument classification table. Supersedes `doc/specs/2026-09-20-gh-40-gauntlet-handoff-shared-brief-contract.md`, scope: the "`.md` token is a brief-file, never widened to a scan" classification rule only.

## Problem

A spec approved and merged on main cannot enter the gauntlet at the plan phase. `skills/gauntlet-resume/reference/reconstruction.md` "Candidates" sees only post-base additions and untracked files under `flowGuards.specDirs`; a file tracked from main matches neither, so every worktree resume stops with "no spec". The Arguments table classifies every `.md` token as a handoff brief, so the spec path cannot be passed either. The only workaround is duplicating the spec under a new untracked name in a hand-made worktree - a throwaway artifact plus a manual step brainstorming already automates.

The "never `git worktree add`" boundary that blocks the fix has no safety rationale on record: the gh-31 spec justifies it as ownership only, `scripts/ci.mjs` does not assert it, and v4.7.0's `writing-plans` "spec in hand" gesture did create the worktree before v5.7.0 moved the gesture into resume.

## Acceptance criteria

none - no ticket

## Design

### Scope

One skill changes: `skills/gauntlet-resume/`. No new skill, no new settings key, no extension or bin change. `disable-model-invocation: true` stays.

### Argument classifier

Replace the Arguments table and its restating prose in `SKILL.md` with one table. Count tokens first; then first match wins. Spec dirs resolve per `reference/reconstruction.md` "Candidates" (`flowGuards.specDirs` precedence).

| Input | Route |
|---|---|
| no tokens, no pasted text | discovery (unchanged) |
| pasted text, line 1 starts `# Handoff:` | brief |
| two tokens, first an existing file with line 1 `# Handoff:` | brief with worktree override (unchanged) |
| two tokens, first a spec seed | stop: `a spec seed takes no worktree: <second token>` |
| one token, existing regular file, line 1 starts `# Handoff:` | brief |
| one token, existing regular file ending `.md`, `realpath` under `<primary>/<specDir>` | spec seed |
| one token, existing regular file, anything else | stop: `not a handoff brief and not under <specDirs>: <path>` |
| one token, existing directory that is a git worktree root (`git -C <dir> rev-parse --show-toplevel` equals its `realpath`) other than `<primary>` | worktree |
| one token, missing path (ends `.md` or contains a separator) | stop: `not found: <path>` |
| one token, bare name | worktree at `<primary>/.worktrees/<name>`; missing -> unchanged stop |
| anything else | stop: "this is a new idea - run /skill:brainstorming" |

A relative token resolves against the session cwd; a bare `name.md` that does not exist there is tried at `<primary>/<specDir>/name.md` per resolved spec dir in order, first hit wins. `<primary>` derives from `--git-common-dir` as today. Carry: "A pasted brief that needs an override uses the file form."

Deleted: "an absolute worktree path is given only in the two-token form"; "a token ending `.md` or containing a separator is a brief-file, never widened to a scan". Old rows map to one or more new rows: `<brief-file>` -> brief / spec seed / two stops; `<worktree>` alone -> directory / bare name.

### Surface rewrite in `SKILL.md`

Every clause below changes in the same edit; nothing else in the file is touched:

| Clause | New text |
|---|---|
| frontmatter `description` | add "or from a spec tracked on main (creates or reuses its worktree via `/skill:using-git-worktrees`)"; drop "never creates a worktree" |
| frontmatter `argument-hint` | `"[<brief-file> | <spec>.md | <worktree-name-or-path>]"` |
| Overview "Two inputs" | "Three inputs: a handoff brief, a bare worktree, a spec seed (`reference/seed.md`)" |
| Boundaries "Writes: ... Nothing on disk" | "Writes: tracker state after every check passes; on the seed route, what `/skill:using-git-worktrees` writes. Never a spec copy, rename, or marker commit." |
| Boundaries "Never: `git worktree add`" | "Never: `git worktree add` directly; worktree creation by resume itself only on the seed route, only through `/skill:using-git-worktrees`" |
| Entry checks intro | append "A spec seed runs check 1 here, then `reference/seed.md`, which runs check 3 itself; checks 2, 4, 5 do not apply." |
| Red flag "before entry checks 1-5 pass" | "before the route's entry checks pass" |
| Red flag "Running `git worktree add`" | "Running `git worktree add` directly" |
| Dispatch table | add row `spec seed | reference/seed.md` |

Keep both `--git-common-dir` tokens and never write `restart pi in <worktree>`: `scripts/ci.mjs` "gauntlet-resume worktree path discipline" asserts them.

### `reference/seed.md` (new, imperative, ~40 lines)

Entry: check 1 (idle session) first. Then, in order:

1. **Primary session.** `git rev-parse --git-dir --git-common-dir` in the session cwd must agree (after `realpath`); a linked worktree -> stop: `seed from the primary checkout`.
2. **Tracked.** `git -C <primary> ls-files --error-unmatch <rel>` must succeed -> stop otherwise: `not tracked: <path> - commit it first`. Line 1 equal to `# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing` -> stop: `context draft, not a spec: <path> - finish brainstorming`.
3. **Not shipped.** Telemetry record `<telemetry.dir>/<rel with .md -> .yaml>` in the primary carrying `shipped_at` or `abandoned_at` -> stop: `spec already shipped at <ts> - write a superseding spec`. No record, or `in_progress`: continue; the extension folds this run into the existing record on `plan_check` pass, as it does for any resumed flow.
4. **Name.** Spec basename minus `.md`, minus a leading `YYYY-MM-DD-` (`2026-09-17-gh-31-gauntlet-resume.md` -> `gh-31-gauntlet-resume`). Same shape as brainstorming's Filename Convention slug; consumer wrappers receive it as `<name>`.
5. **Reuse or create.** `git -C <primary> worktree list --porcelain`; an entry whose `branch` is `refs/heads/<name>` or ends in `/<name>` -> `<full-path>` is its `worktree` line, creation skipped (layout-agnostic: covers wrapper sibling dirs, wrapper branch prefixes such as `<user>/<name>`, and `.worktrees/`); more than one match -> the human picks. None -> invoke `/skill:using-git-worktrees` with `<name>` and carry its `Worktree ready at <full-path>`. Its Step 1a applies project `## using-git-worktrees` overrides; wrapper arguments beyond `<name>` are that skill's ask, never inferred here. Its Step 3 clean-base check and dirty ask apply. Any stop or error it raises is this route's stop, verbatim; never invent a second name.
6. **Entry check 3** against `<full-path>` (same repository).
7. **Pinned copy.** `<full-path>/<rel>` must exist, be readable, and not be a context draft -> stop naming that path otherwise. Never copy the primary file in.
8. **Continue** in `reconstruction.md` with the spec pinned at `<full-path>/<rel>`: skip Candidates; `<full-path>/<sibling plans dir>/<basename>` exists -> "Spec with plan", else "Spec without plan". Prompts say "no brief context available".

### `reference/reconstruction.md`

- Candidates: "A pinned spec (seed route) skips this section." Pairing rule gains: a candidate plan pairs with `<worktree>/<specDir>/<same basename>` whether that spec is a candidate or tracked from base; the pair then routes "Spec with plan". `brief-contract.md` `planPath` restates the pairing literally; rewrite its sentence to: the single plan added after base, paired with `<specDir>/<same basename>` whether that spec was added after base or tracked from base (`reconstruction.md` "Candidates"); keep "Zero pairs -> stop; more than one -> human picks."
- "no spec" stop: append "or pass the spec: `/skill:gauntlet-resume <specDir>/<name>.md`".
- "Spec with plan" step 1: plan commit at or before base -> skip the log query, show `plan predates base; no post-base task evidence`, every task proposed `pending`.

### Spec file handling

The seed route adds no spec copy, rename, or marker commit. The spec stays where main tracks it; amends during the flow are ordinary modifications carried by the squash; `finishing-a-development-branch` strips only the plan. `gauntlet-telemetry-salvage` prints `no spec on branch` for an unamended seed throughout the flow - it selects specs from `git diff --name-only <base>...HEAD`, which never lists a file tracked at base - so the extension's live ship stamp is the only writer of `shipped_at` for such a flow; the record still binds on `plan_check` pass. Once the plan exists beside the spec, plain `<worktree>` resume and `gauntlet-handoff` -> `gauntlet-resume <brief>` both restore the flow through the pairing rule above; before the plan exists, re-pass the seed.

### Out of scope

A `spec:` prefix syntax; bare-name spec lookup without `.md`; a separate seed skill; a brainstorming bypass for approved specs; a fresh-run telemetry treatment for shipped specs (supersede instead); changes to `scripts/brief-contract-lint.mjs`.

## Verification

- `npm test`: skill lint, AGENTS core, and `scripts/ci.mjs` "gauntlet-resume worktree path discipline" (the check that binds this change; stage-skill lint does not cover resume).
- Review check: every old Arguments row maps to one or more new rows or is listed under Deleted.
- README "Smoke walkthrough" gains steps 6-8, run by a human before the release: (6) primary session, spec tracked on main: `/skill:gauntlet-resume doc/specs/<x>.md` creates the worktree and asks the approval question; approval leaves `phase_tracker` at plan in_progress with brainstorm `⊘ (resume: ...)`. (7) Rerun the same seed: the registered worktree is reused, the question repeats; run once on a wrapper layout (sibling dir) and once on `.worktrees/`. (8) After writing-plans commits the plan there: `/skill:gauntlet-handoff` then `/skill:gauntlet-resume <brief>` restores plan phase; plain `/skill:gauntlet-resume <worktree>` reaches "Spec with plan".

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (gauntlet-resume one-liner: seed form, drop "never creates a worktree"; Smoke walkthrough steps 6-8); `CHANGELOG.md` `## Unreleased`; `doc/specs/2026-09-17-gh-31-gauntlet-resume.md` and `doc/specs/2026-09-20-gh-40-gauntlet-handoff-shared-brief-contract.md` (supersession banners)
- Derived / memory docs invalidated: none

`reference/documentation-impact.md` applies. `AGENTS.md` Routing row for resume stays true ("the sole resume path"). Skill bodies are implementation surface, not doc-impact entries.

## Open questions

none
