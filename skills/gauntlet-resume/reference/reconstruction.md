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

When the brief carries PR pairs, use its full `Rework base:` SHA as `<base>` when present, else the first pair's full `Pre-rework head:` SHA for spec
and plan candidate scans instead of the merge-base from "Base"; the PR's earlier
spec remains input, not an added candidate, so it does not trigger a multi-spec pick.
Keep pairing, untracked candidates, task evidence, and human confirmation below.
Without the optional pairs, including a bare worktree, use the ordinary base.

Resolve with `gauntlet_setting({ key: "flowGuards" })`; `<dirs>` below is its `specDirs` plus `planDirs` (each spec dir's sibling `plans` dir), space-separated.

```bash
git -C <worktree> diff --diff-filter=A --name-only <base>..HEAD -- <dirs>
git -C <worktree> ls-files --others --exclude-standard -- <dirs>
```

Take files under those directories added after base, plus untracked files there, as candidates. For a brief with PR pairs, also admit the spec whose run-worktree `## Rework record` lists the brief's `PR:` identities, even when tracked at `<base>`; pair it with a task plan at `<planDir>/<same basename>` or a ledger whose `**Spec:**` header resolves to it, whether or not either file was added after `<base>`. Paths returned by these commands are relative to `<worktree>`; resolve them to
absolute paths under `<worktree>` before reading artifacts, showing paths in prompts,
or calling `plan_check`. Read candidate contents before choosing. For a PR-list brief,
read the rework candidate's `## Rework record` and the member-carried spec paths listed
under each member in `## Problem`; exclude exactly those paths from new-rework spec
candidates before the multi-spec prompt. Keep this explicit exclusion set authoritative through plan/ledger pairing: when a task plan's basename or a ledger's `**Spec:**` header resolves to an excluded member spec, skip that pair in route candidates. Never promote an excluded member spec through its carried plan or ledger. Keep all other plan/spec pairing below, including
base-tracked specs. Artifact presence never supplies approval. Never choose by filename
when remaining candidates are genuinely ambiguous; ask the human.
Read every plan-directory candidate's first line. A line exactly `# Ledger - loop engine` pairs by its path-only `**Spec:**` header, not basename; resolve that spec under the worktree's configured spec dirs, including a spec tracked from base. Stop on a missing or foreign spec. A task-plan candidate pairs with
`<worktree>/<specDir>/<same basename>` whether that spec is a candidate or tracked
from base; count a base-tracked spec so paired as a spec in the route table below.
The plan commit is the first
post-base commit that added the plan file: `git -C <worktree> log --diff-filter=A
--format=%H --reverse <base>..HEAD -- <plan>`, first line. For a brief with `Rework base:`, when that lookup is empty and `git -C <worktree> cat-file -e <base>:<plan>` exits 0, use the `Rework base:` commit itself as the plan commit. An uncommitted plan has no
plan commit; treat every task as `pending`.

| Candidates | Route |
|---|---|
| no spec | stop; offer `/skill:brainstorming` or pass the spec: `/skill:gauntlet-resume <specDir>/<name>.md`; no tracker call |
| more than one spec | the human picks one, then continue below with that spec |
| one spec, no plan | "Spec without plan" |
| one spec with ledger | "Spec with ledger" (takes precedence over a task plan) |
| one spec with task plan only | "Spec with plan" |

## Spec without plan

Run SKILL.md entry check 6's deferred-header admission on the resolved spec before the approval/handoff question below; apply it to both routes, including the unapproved-draft brainstorming handoff. Keep grant decoding exempt for the unapproved route.

Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../brainstorming/reference/menu-layout.md).

Ask exactly one question: is this spec approved, or do you select `/skill:brainstorming`
with this unapproved spec as the draft? Show the spec path (and the brief's
`## Intent`/`## Decisions` when present).

- Approved: honor SKILL.md entry check 6's deferred stop before any arming; run SKILL.md entry check 6 on `<spec path>` first (a malformed `**Amend-grant:**` line stops here, no tracker call). Read the spec's `**Engine:**` line and take the matching route:
  - `loop`: call `start brainstorm`, then `skip brainstorm` with reason `resume: <spec path>` to arm the flow before `plan_check`. Carry absolute worktree/spec paths and the resolved plan directory into `/skill:loop-implementation` Entry steps 1-5: resolve settings at step 1 and verification at step 2, retain the driver's `skip plan` at step 3, create the ledger at step 4, then check/commit it and start implement at step 5. Never enter the writing-plans body or initialize a task tracker.
  - `waves` or absent: `start brainstorm`; `skip brainstorm resume: <spec path>`; `start plan`; continue in writing-plans, skipping its `start plan` call.
- Selected unapproved-draft brainstorming handoff: invoke [`/skill:brainstorming`](../../brainstorming/SKILL.md) with
  the spec as the draft; arm nothing. using-git-worktrees Step 0 detects the existing
  worktree and creates none. A bare "not approved" answer is not consent; wait for
  explicit handoff selection.

## Spec with ledger

Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../brainstorming/reference/menu-layout.md).

Show the spec and ledger paths, current rows, iterations, last decision, and `git -C <worktree> status --porcelain`. Ask the human to confirm the approved spec and continuation; carry brief Intent/Decisions when present. Keep entry and same-repository checks.

After confirmation:

1. Read ledger line 1: require `# Ledger - loop engine`. Resolve its path-only `**Spec:**` header to an absolute spec path under the worktree's configured spec directories, not by basename. Run SKILL.md entry checks 1-6 in order, including check 6, **Grant field**, on that spec, before any tracker mutation.
2. Call `phase_tracker({ action: "start", phase: "brainstorm" })`, then `phase_tracker({ action: "skip", phase: "brainstorm", reason: "resume: <spec path>" })`, then `phase_tracker({ action: "start", phase: "plan" })`.
3. Call `plan_check({ planPath: <absolute ledger path> })`. On FAIL, stop with findings, retaining plan in_progress. Start the message with `gauntlet: stuck` followed by the findings reason on that line; never enter `## Plan repair` or writing-plans. On PASS, call `phase_tracker({ action: "skip", phase: "plan", reason: "resume: <spec> (loop engine)" })`, then `phase_tracker({ action: "start", phase: "implement" })`. Use the resolved absolute spec path as `<spec>` in the reason. Never call `plan_tracker init`.
4. **Shared cap boundary (every ledger restore, before phase continuation).** Read `/skill:loop-implementation`. Skip Entry step 1 entirely; settings resolution and its unavailable-tool stop apply only to fresh seeding. Restore base, verification, iterations, `cap:`, row attempts, funding and retry allowances from the ledger/spec and branch without overwriting it. Render `cap: <n>`, rows, iterations, attempts, funding, retry allowances and all decisions; distinguish the latest operational `row <n> ...` decision from the last physical history line. A dirty tree takes the driver's discard-authorization stop without offering a cap grant. On a clean ledger missing `cap:`, stop with `ledger has no cap: line - seeded under the old loopEngine contract`, even when every row is closed. Use the driver's legacy `cap +N` grant (durable iterations + N), never settings. After the grant continue the original phase: implement at `Before each dispatch`; verify/ship at `After the loop` step 1, never reseed.
5. Continue at loop step 5, the delivered driver's `Before each dispatch`, with durable iterations and retry data. Never reset counters or reseed a validated seed.

## Spec with plan

Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../brainstorming/reference/menu-layout.md).

Show, and ask the human to confirm or edit both in one reply:

1. Per task, in plan order: the commits after the plan commit that touch any path in
   the task's declared `Files:` block, taking the union of the block in the working
   copy and in `git -C <worktree> show <plan-commit>:<plan path relative to the worktree>`
   (an object path inside the repository, never the absolute `planPath`; a `Modify:` row
   dropped by `brief-contract.md` "Plan repair" still yields its `complete` evidence).
   Strip a trailing `:digits[-digits]` range from
   each `Modify:` path before matching `git -C <worktree> log -- <path>`:
   `git -C <worktree> log --format=%h --oneline <plan-commit>..HEAD -- <path>`.
   Uncommitted plan (no
   plan commit): skip this query entirely - there is no range to search - and show
   "plan uncommitted; no task evidence" in its place; every task is proposed `pending`.
   For a plan tracked at the `Rework base:` with no post-base add commit, use that base as the plan commit and query post-base task evidence as above. Otherwise, when the lookup is empty but `git -C <worktree> cat-file -e <base>:<plan>` exits 0, skip the log query, show
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

1. Run SKILL.md entry check 6 on `<spec path>` (a malformed `**Amend-grant:**` line stops here, no tracker call); then `start brainstorm`; `skip brainstorm resume: <spec path>`; `start plan`.
2. `plan_check` with `planPath` = the plan's absolute path. FAIL -> run `brief-contract.md`
   `## Plan repair`; its PASS continues at step 3, its stop ends the restore with plan
   in_progress, no `init`.
3. PASS -> `skip plan` with the same `resume:` reason; for stage verify also
   `skip implement`; `start <stage>`.
4. `init` the confirmed non-empty task list as `{name, status}` elements.
5. `phase_tracker status` and `plan_tracker status` must match the confirmed active
   stage and task list exactly; a mismatch is reported verbatim, not patched.

End with the standard line from `brief-contract.md`. `<task>` follows the same rule as
there: there is no brief `Active task` on this route, so it is the first confirmed
`in_progress` task, else `none` (whole-deliverable re-validation).
