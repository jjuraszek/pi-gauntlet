# Spec seed (gauntlet-resume supplementary)

Consumed only by `SKILL.md` in this directory, for a one-token `.md` argument classified
as a spec seed. `<seed>` is its `realpath`; `<rel>` is `<seed>` relative to `<primary>`.
Entry check 1 (idle session) runs first. Then, in order; every stop names the path.

1. **Primary session.** `git rev-parse --git-dir --git-common-dir` in the session cwd
   prints two paths; their `realpath`s must agree. Otherwise stop:
   `seed from the primary checkout`.
2. **Tracked.** `git -C <primary> ls-files --error-unmatch <rel>` exits 0; otherwise
   stop: `not tracked: <seed> - commit it first`. Line 1 of `<seed>` equal to
   `# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing` -> stop:
   `context draft, not a spec: <seed> - finish brainstorming`.
3. **Not shipped.** Read `<primary>/<telemetry.dir>/<rel with .md -> .yaml>`
   (`piGauntlet.telemetry.dir`, default `.pi/gauntlet/telemetry`). A `shipped_at:` or
   `abandoned_at:` line carrying a value -> stop:
   `spec already shipped at <ts> - write a superseding spec`. No record, or
   `in_progress`: continue; the extension folds this run into the record on
   `plan_check` pass.
4. **Name.** `<name>` = basename of `<rel>` minus `.md`, minus a leading `YYYY-MM-DD-`:
   `2026-09-17-gh-31-gauntlet-resume.md` -> `gh-31-gauntlet-resume`. Same shape as
   brainstorming's Filename Convention slug; wrappers receive it as `<name>`.
5. **Reuse or create.** `git -C <primary> worktree list --porcelain`. A block whose
   `branch` line is `refs/heads/<name>` or ends in `/<name>` -> `<full-path>` is that
   block's `worktree` line; skip creation (layout-agnostic: wrapper sibling dirs,
   wrapper branch prefixes such as `<user>/<name>`, and `.worktrees/` alike); more than
   one match -> the human picks. No block -> invoke `/skill:using-git-worktrees` with branch `<name>` and carry its
   `Worktree ready at <full-path>`; its Step 1a applies project `## using-git-worktrees`
   overrides, its Step 3 runs the clean-base check and dirty ask. Wrapper arguments
   beyond `<name>` are that skill's ask, never inferred here. Any stop it raises is this
   route's stop, verbatim. Never invent a second name.
6. **Same repository.** Entry check 3 against `<full-path>`.
7. **Pinned copy.** `<full-path>/<rel>` exists, is readable, and its line 1 is not the
   context-draft marker; otherwise stop naming that path. Never copy `<seed>` in.
8. **Continue** in `reconstruction.md` with the spec pinned at `<full-path>/<rel>`,
   skipping Candidates: `<full-path>/<sibling plans dir>/<basename of rel>` exists ->
   "Spec with plan"; otherwise "Spec without plan". Prompts say "no brief context
   available".

The seed route writes no spec copy, rename, or marker commit: the spec stays where main
tracks it, amends ride the squash as ordinary diffs, and `finishing-a-development-branch`
strips only the plan. `gauntlet-telemetry-salvage` prints `no spec on branch` for an
unamended seed throughout the flow (it selects specs from `git diff --name-only
<base>...HEAD`, which never lists a file tracked at base), so the extension's live ship
stamp is the only writer of `shipped_at`; the record still binds on `plan_check` pass.
Before a plan exists beside the spec, re-pass the seed to resume; after, plain `<worktree>` resume and
`gauntlet-handoff` -> `gauntlet-resume <brief>` restore the flow.
