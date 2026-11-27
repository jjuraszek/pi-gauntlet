# Reconstruction (gauntlet-resume supplementary)

Read by worktree routes, the spec seed and every brief with `## Process state`. Artifact presence never implies approval; task commits never imply review acceptance. Every question below is a human question, and no tracker call happens before the human answers.

Carry a brief's `## Intent`/`## Decisions` verbatim into every prompt below. For a bare worktree say "no brief context available" and never invent Intent or Decisions.

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
| no spec | stop; offer `/skill:gauntlet` or pass the spec: `/skill:gauntlet-resume <specDir>/<name>.md`; no tracker call |
| more than one spec | the human picks one, then continue below with that spec |
| one spec, no plan | "Spec without plan" |
| one spec with ledger | `restore-loop.md` (takes precedence over a task plan) |
| one spec with task plan only | `restore-plan.md` "Spec with plan" |

For a coordinated brief, use `coordinated.md` "Coordinated admission" before tracker writes. Resolve the home spec, never a companion leg file, and retain every approval question. For a ship-stage retry whose plan is stripped, use that section's receipt-validated exception rather than proposing a new plan.

## Spec without plan

Run ../SKILL.md entry check 6's deferred-header admission on the resolved spec before the approval/handoff question below; apply it to both routes, including the unapproved-draft brainstorming handoff. Keep grant decoding exempt for the unapproved route.

Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../gauntlet/menu-layout.md).

Ask exactly one question: is this spec approved, or do you select `/skill:gauntlet`
with this unapproved spec as the draft? Show the spec path (and the brief's
`## Intent`/`## Decisions` when present).

- Approved: run ../SKILL.md entry check 6 on `<spec path>` first (its deferred stop or a malformed `**Amend-grant:**` line stops here, no tracker call). Read the spec's `**Engine:**` line and take the matching route:
  - `loop`: after check 6, call `start brainstorm`, then `skip brainstorm resume: <spec path>` with `engine: "loop"` before driver admission. Carry absolute worktree/spec paths and plan directory into `../../gauntlet/implement/loop/loop.md` Entry steps 1-5 and label Entry steps 1-5 explicitly in the response as Entry step 1: resolved settings; Entry step 2: verification; Entry step 3: driver's plan skip; Entry step 4: clean named-branch check and ledger creation; Entry step 5: `plan_check`, commit and implement start. Use no `../../gauntlet/plan/plan.md` body or task tracker initialization.
  - `waves` or absent: `start brainstorm`; `skip brainstorm resume: <spec path>` with `engine: "waves"`; `start plan`; continue in `../../gauntlet/plan/plan.md`, skipping its `start plan` call.
- Selected unapproved-draft brainstorming handoff: invoke [`/skill:gauntlet`](../../gauntlet/SKILL.md) with
  the spec as the draft; arm nothing. `../../gauntlet/worktrees.md` Step 0 detects the existing
  worktree and creates none. A bare "not approved" answer is not consent; wait for
  explicit handoff selection.

## PR pairs

Before any tracker write, read the optional ordered PR pairs. Fetch branch identity
from the first pair only (home) with
`gh pr view <N> --repo <owner/repo> --json headRefName`. Compare `headRefName` with
`git -C <worktree> branch --show-current`. A mismatch stops with
`brief names PR #N on <headRefName>, worktree is on <branch>`, substituting the observed PR number and both actual branch names, never literal placeholders; a failed fetch stops
with its error. Do not fetch later pairs' branches for this identity check.
Read the worktree spec's `## Rework record` and compare its top-level `PR:` identities
(without titles) with the brief identities in order. A mismatch stops with
`brief lists <brief order>, record lists <record order>`, substituting both observed
ordered lists, before any tracker call. Resolve the spec through "Candidates" before this comparison.
Carry all paired full pre-rework heads downstream in their original order.
Carry the optional full rework base downstream; "Candidates" prefers it over the first pair's head as its scan base. Without optional pairs,
retain ordinary restoration.
Preserve the entry checks, standing-grant validation, plan repair, and task snapshot;
PR identity implies no approval or gate evidence.
