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

For a coordinated brief, use `brief-contract.md` "Coordinated admission" before tracker writes. Resolve the home spec, never a companion leg file, and retain every approval question. For a ship-stage retry whose plan is stripped, use that section's receipt-validated exception rather than proposing a new plan.

## Spec without plan

Run SKILL.md entry check 6's deferred-header admission on the resolved spec before the approval/handoff question below; apply it to both routes, including the unapproved-draft brainstorming handoff. Keep grant decoding exempt for the unapproved route.

Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../brainstorming/reference/menu-layout.md).

Ask exactly one question: is this spec approved, or do you select `/skill:brainstorming`
with this unapproved spec as the draft? Show the spec path (and the brief's
`## Intent`/`## Decisions` when present).

- Approved: honor SKILL.md entry check 6's deferred stop before any arming; run SKILL.md entry check 6 on `<spec path>` first (a malformed `**Amend-grant:**` line stops here, no tracker call). Read the spec's `**Engine:**` line and take the matching route:
  - `loop`: call `start brainstorm`, then `skip brainstorm` with reason `resume: <spec path>` to arm the flow before `plan_check`. Carry absolute worktree/spec paths and the resolved plan directory into `/skill:loop-implementation` Entry steps 1-5: resolve settings at step 1 and verification at step 2, retain the driver's `skip plan` at step 3, create the ledger at step 4, then check/commit it, start implement and refresh by ledger path at step 5. Never enter the writing-plans body or initialize a derived task list.
  - `waves` or absent: `start brainstorm`; `skip brainstorm resume: <spec path>`; `start plan`; continue in writing-plans, skipping its `start plan` call.
- Selected unapproved-draft brainstorming handoff: invoke [`/skill:brainstorming`](../../brainstorming/SKILL.md) with
  the spec as the draft; arm nothing. using-git-worktrees Step 0 detects the existing
  worktree and creates none. A bare "not approved" answer is not consent; wait for
  explicit handoff selection.

## Spec with ledger

Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../brainstorming/reference/menu-layout.md).

Show the spec and ledger paths, current rows, iterations, last decision, and `git -C <worktree> status --porcelain`. Ask the human to confirm the approved spec and continuation; carry brief Intent/Decisions when present. Keep entry and same-repository checks.

After confirmation:

1. Read ledger line 1: require `# Ledger - loop engine`. Resolve its path-only `**Spec:**` header to an absolute spec path under the worktree's configured spec directories, not by basename. Run SKILL.md entry checks 1-6 in order, including check 6, **Grant field**, on that spec, before any tracker mutation. Run Pending recovery's read-only admission-evidence check below.
2. Call `phase_tracker({ action: "start", phase: "brainstorm" })`, then `phase_tracker({ action: "skip", phase: "brainstorm", reason: "resume: <spec path>" })`, then `phase_tracker({ action: "start", phase: "plan" })`.
3. Admit exactly one positive safe-integer `cap:` or `allowance:` header; both or neither is `ledger header malformed: <observed header lines>`, requiring human repair by hand. Call `plan_check({ planPath: <absolute ledger path> })` with legacy-compatible admission. On FAIL, stop with findings, retaining plan in_progress. Start the message with `gauntlet: stuck` followed by the findings reason on that line; never enter `## Plan repair` or writing-plans. On PASS, call `phase_tracker({ action: "skip", phase: "plan", reason: "resume: <spec> (loop engine)" })`, then `phase_tracker({ action: "start", phase: "implement" })`. Use the resolved absolute spec path as `<spec>` in the reason. Restore implement through refresh, not `init`.
4. **Shared allowance boundary (every ledger restore, before phase continuation).** Read `/skill:loop-implementation`. Skip Entry step 1 entirely; restore base, verification, iterations, row attempts and decisions from the ledger without reseeding. Apply the following order on bare-worktree and brief routes alike:
   1. Apply pending recovery below against the unmigrated ledger, including home returns whose child commit removed the tuple. Validate the original one-commit `<pre-dispatch HEAD>..HEAD` range against its unchanged before-image. For companions, retain unchanged home HEAD and admit the expected iterations-bump-plus-tuple dirt. On unrecoverable attribution or before-image, stop before refresh. Resolve ambiguous-history admission before tracker calls as required below. Retain every discard/reset and interrupted-dispatch gate; migration changes neither admission ranges nor the home HEAD used for recovery.
   2. Migrate only an admitted, clean, tuple-free ledger with no retained recovery stop. With `cap:` and no `allowance:`, resolve `gauntlet_setting({ key: "loopEngine" })` for this migration only and replace the cap line with `allowance: <maxIterationsPerRow>`. Commit only that header replacement as parent `loop: migrate allowance`; preserve iterations, every attempts cell and all decisions. On an unavailable tool, stop before any write with `cannot migrate allowance: settings tool unavailable (loopEngine.maxIterationsPerRow)`. With an existing allowance, use it without settings resolution or a migration commit. Defer migration through any retained recovery stop or dirty tree; after authorized recovery reaches a clean tuple-free tree, migrate before the next dispatch or verification.
   3. Require `allowance:` and no `cap:` before continuation, including for all-closed ledgers; otherwise stop with `ledger has no allowance: line - resume through /skill:gauntlet-resume`. For a retained recovery stop or unresolved dirty tree, defer this final validation with migration and project the unmigrated ledger solely to report the stop.
   4. Call `plan_tracker({ action: "refresh", path: <absolute ledger path> })` exactly once after phase restoration, recovery and eligible migration/final validation, before any unresolved dirty-tree stop or dispatch. On verify/ship, restore the saved mixed task list first as `brief-contract.md` specifies; on implement, use no `init`. On refresh failure, stop with its findings and leave the existing task list untouched. Read `plan_tracker status` and report its exact observed state, never an inferred list.
   Render the allowance header, rows, iterations, attempts, effective allowances and all decisions; distinguish the latest operational `row <n> ...` decision from the last physical history line. Compute each effective allowance as the header plus one per matching retry decision; ignore the retry's audit ceiling. Keep `cap +N` history as inert text and restore no funded rounds. Report any retained recovery stop now with no redispatch, using the driver's unresolved-row counts and discard-authorization menu for dirty trees. Resume the original phase only after this boundary: implement at `Before each dispatch`; verify/ship at `After the loop` step 1.
5. Continue at loop step 5, the delivered driver's `Before each dispatch`, with durable iterations and retry data; an all-closed ledger completes implement through refresh and takes `After the loop` step 0. A migrated unresolved row at or above its effective allowance stops under rule 2 without an attempt; keep an allowance-stopped row `failed`. Render a row whose `pending:` tuple is restored or retained as `row <n> in_progress (pending tuple restored)`. Never reset counters or reseed a validated seed.

### Pending recovery

Recover before dispatch or verification on every ledger restore. Run the read-only admission-evidence check below before phase/task restoration on every ledger route, including briefs; resolve its human question before any tracker call. Apply recovery writes only at the ordered pending-recovery step. Read the durable `pending:` tuple (target row or seed, repo, pre-dispatch HEAD); the parent's uncommitted iterations bump plus tuple is expected dispatch dirt, not a reason to skip recovery.

With no `pending:` on disk, inspect home commit history before any refresh. Find the latest home child row/seed commit that changed this ledger, even when unrelated commits follow it; read its subject and body with `git -C <worktree> log --format=%H -- <ledger path>` and `git -C <worktree> show -s --format=%B <sha>`. Exclude returns superseded by a parent admission/repair or approved ledger mutation proven by the evidence below; never replay those over the parent's current ledger.

Treat ordinary home admission as a refresh with no parent commit or ledger mutation. Prove a later parent repair or approved mutation from its actual ledger diff, not its subject alone. Use a saved post-admission snapshot only with its observed HEAD and clean `dirty` state: the brief's core fields plus task rows, or existing parent admission/refresh output bound to that checked HEAD. Require the child to be an ancestor of the saved HEAD, that HEAD to be an ancestor of live HEAD, and the ledger to be unchanged from the saved HEAD through live HEAD and the working tree. Match the snapshot's ledger task names/statuses to that HEAD's tuple-free ledger after stripping only the recognized ledger-description suffix or legacy ledger-label prefix defined in `brief-contract.md`; keep Gn and other names byte-identical. Ignore label differences in this comparison; the post-restore refresh recomputes descriptions and allowance labels from the current spec and ledger without duplicating tasks. Treat a matching snapshot as settled evidence and retain the current ledger without replaying the old dispatch. Terminal rows, a verify phase label or the child's attribution alone prove no admission.

For an unsuperseded home return, recover the commit body's first two lines as the exact `pending:` tuple and consumed `iteration:`. Require the tuple's home identity and target to match the spec and subject, its pre-dispatch SHA to be an ancestor of live HEAD, and its consumed count to equal the committed ledger's iterations and pre-dispatch ledger's iterations +1. Read the before-image at that SHA, not at `HEAD^`. On missing, malformed or mismatched attribution, or unavailable pre-dispatch bytes, stop before refresh, dispatch or verification; name the commit and failed check rather than inferring admission from terminal rows. With no home child return to recover, retain the existing ledger restore path.

Revalidate a clean, exactly-one-commit return through the home row below. For later commits or dirty changes, require settled evidence above or a parent return record/human confirmation that admission was still pending when those changes occurred. Without either, history alone cannot distinguish interruption from admitted work followed by verification changes. Start the message with `gauntlet: question` on its own line and ask: `Was home return <sha> admitted before the later commits or dirty changes, or did the session stop before admission?` Name the candidate and live HEAD. Keep ledger bytes, counters and task list unchanged while awaiting the answer: no refresh and no target/tuple restoration.

| Confirmed admission state | Action |
|---|---|
| Confirmed settled | Preserve the current ledger and continue normal restore; require fresh verification/conformance, not historical gate credit. |
| Confirmed interrupted | Validate the entire `<pre-dispatch HEAD>..HEAD` range, never just `HEAD^..HEAD`, through the home row below. Render the interrupted/ambiguous-history answer in one sentence: validate the full `<HEAD_BEFORE>..HEAD` range (using the recovered pre-dispatch SHA, including later commits), restore every row the child changed (target and extras) and remove their unadmitted decisions from the pre-dispatch copy with the tuple before refresh on boundary rejection, state that iterations stay at the recovered count and child commits/changes are kept; use the saved cells for any other pre-dispatch status/attempts, or all dispatched non-cut rows for seed. Use the recovered tuple/count without another bump or a new commit. |
| Still unknown | Stop without mutation; ask for the missing admission evidence, never turn uncertainty into a discard/reset decision. |

| Tuple target | Recovery |
|---|---|
| Home leg or single-member `home` | Reconstruct the pre-dispatch ledger from `HEAD:<ledger path>` when HEAD is the tuple SHA, otherwise from `<pre-dispatch HEAD>:<ledger path>`. Compare live HEAD with that SHA. Admit exactly one new home commit with subject `loop: row <n> <status>` or `loop: seed evidence` only through the driver's `## Validate the return`: require a clean tree and the bounded row/decision result, allowing only the consumed iteration and pending removal header deltas. Clear the tuple through the admitted close or ordinary-miss repair. With zero new commits, keep the tuple and consumed iteration and take the interrupted-dispatch stop. Unrelated movement or multiple commits stop without redispatch or double counting. For a rejected terminal child result, restore every row the child changed (target and extras) and remove their unadmitted decisions in the working-tree ledger from the pre-dispatch copy with the tuple before refresh (all dispatched non-cut rows for seed); preserve other child changes, child commits and consumed iterations for the human's discard/reset decision. |
| Actual multi-member companion | Apply `/skill:loop-implementation` `reference/coordinated-legs.md` `## Resume`: require unchanged home HEAD and exactly one new companion commit with tuple attribution, then validate its result. Record that leg's admitted rows, decisions or seeded state and SHA, removing the tuple in the home-ledger commit; never rerun the recovered row or its admitted extras. Stop preserving state on boundary/attribution failures (zero, unrelated or multiple commits or attribution mismatch); route post-boundary result-validation misses through ordinary `loop: repair row <n>` or seed `loop: repair seed` repair in that protocol, clear `pending:` and preserve the consumed iteration. |

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
