# Bare-worktree reconstruction (gauntlet-resume supplementary)

Consumed only by `SKILL.md` in this directory, for a resolved worktree with no
`## Process state` to restore from - a bare worktree argument, or a brief without
process state whose worktree exists. Artifact presence never implies approval; task
commits never imply review acceptance. Every question below is a human question, and
no tracker call happens before the human answers.

Brief context: when the input was a brief, carry its `## Intent`/`## Decisions` verbatim
into every prompt below. When the input was a bare worktree, say so - "no brief context
available" - and never invent Intent or Decisions.

## Base

```bash
git -C <worktree> merge-base HEAD origin/HEAD 2>/dev/null \
  || git -C <worktree> merge-base HEAD main 2>/dev/null \
  || git -C <worktree> merge-base HEAD master 2>/dev/null
```

Base = `git -C <worktree> merge-base HEAD origin/HEAD`, else `main`/`master`. Empty -> ask the human
for a base ref before reading any artifact.

## Candidates

A pinned spec (seed route, `seed.md`) skips this section.

Spec/plan directories: `piGauntlet.flowGuards.specDirs` plus each one's sibling `plans` directory. Resolve with the precedence `doc/configuration.md` documents for every `piGauntlet.*` key: the session cwd's `.pi/settings.json` if it defines `flowGuards`,
else the active pi profile's `settings.json`, else the default `["doc/specs"]` (sibling
`doc/plans`). An empty array is the default. `<dirs>` below is that resolved list,
space-separated - never the literal defaults when a setting is present.

```bash
git -C <worktree> diff --diff-filter=A --name-only <base>..HEAD -- <dirs>
git -C <worktree> ls-files --others --exclude-standard -- <dirs>
```

Candidates are files under those directories added after base, plus untracked files
there. Paths returned by these commands are relative to `<worktree>`; resolve them to
absolute paths under `<worktree>` before reading artifacts, showing paths in prompts,
or calling `plan_check`. A candidate plan pairs with
`<worktree>/<specDir>/<same basename>` whether that spec is a candidate or tracked
from base; count a base-tracked spec so paired as a spec in the route table below.
The plan commit is the first
post-base commit that added the plan file: `git -C <worktree> log --diff-filter=A
--format=%H --reverse <base>..HEAD -- <plan>`, first line. An uncommitted plan has no
plan commit; treat every task as `pending`.

| Candidates | Route |
|---|---|
| no spec | stop; offer `/skill:brainstorming` or pass the spec: `/skill:gauntlet-resume <specDir>/<name>.md`; no tracker call |
| more than one spec | the human picks one, then continue below with that spec |
| one spec, no plan | "Spec without plan" |
| one spec with plan | "Spec with plan" |

## Spec without plan

Ask exactly one question: is this spec approved? Show the spec path (and the brief's
`## Intent`/`## Decisions` when present).

- Approved: `start brainstorm`; `skip brainstorm resume: <spec path>`; `start plan`;
  continue in writing-plans (its own `start plan` is skipped - plan is already
  in_progress).
- Not approved: invoke `/skill:brainstorming` with the spec as the draft; arm nothing.
  using-git-worktrees Step 0 detects the existing worktree and creates none.

## Spec with plan

Show, and ask the human to confirm or edit both in one reply:

1. Per task, in plan order: the commits after the plan commit that touch any path in
   the task's declared `Files:` block. Strip a trailing `:digits[-digits]` range from
   each `Modify:` path before matching `git -C <worktree> log -- <path>`:
   `git -C <worktree> log --format=%h --oneline <plan-commit>..HEAD -- <path>`.
   Uncommitted plan (no
   plan commit): skip this query entirely - there is no range to search - and show
   "plan uncommitted; no task evidence" in its place; every task is proposed `pending`.
   Plan commit lookup empty while `git -C <worktree> cat-file -e <base>:<plan>` exits 0
   (plan at or before base): skip the log query, show
   `plan predates base; no post-base task evidence`, every task proposed `pending`.
2. Uncommitted files: `git -C <worktree> status --porcelain`.
3. Proposed task statuses: `complete` iff at least one matching commit, else `pending`.
4. Proposed stage: `implement` if any task is `pending`, else `verify`.

Validate the confirmed snapshot before any tracker call:

- pending-suffix order - every `pending` task trails every non-pending one;
- all tasks complete/skipped with stage `implement` is infeasible (implement would
  auto-complete on `init`).

Reject an infeasible edit by citing the offending rows and re-asking. Confirmation
edits override proposals; never rewrite confirmed state silently.

After confirmation:

1. `start brainstorm`; `skip brainstorm resume: <spec path>`; `start plan`.
2. `plan_check` with `planPath` = the plan's absolute path. FAIL -> print the findings, stop with plan
   in_progress, no `init`.
3. PASS -> `skip plan` with the same `resume:` reason; for stage verify also
   `skip implement`; `start <stage>`.
4. `init` the confirmed non-empty task list as `{name, status}` elements.
5. `phase_tracker status` and `plan_tracker status` must match the confirmed active
   stage and task list exactly; a mismatch is reported verbatim, not patched.

End with the standard line from `brief-contract.md`. `<task>` follows the same rule as
there: there is no brief `Active task` on this route, so it is the first confirmed
`in_progress` task, else `none` (whole-deliverable re-validation).
