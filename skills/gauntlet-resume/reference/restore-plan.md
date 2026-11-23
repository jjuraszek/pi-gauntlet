# Task-plan restore (gauntlet-resume supplementary)

Read for a brief with `## Process state` and no `Ledger:` field at any stage, for a worktree whose spec pairs with a task plan only, and from `seed.md` step 8, after `reconstruction.md`.

## Process-state restore

Use `R = resume: <brief file or "pasted brief">` for plan/implement/verify skips and `S = resume: <spec path>` for brainstorm skips. Resolve `<spec path>` as `reconstruction.md` "Candidates" does, to an absolute path under the worktree: the single `*.md` spec added after the candidate base under `flowGuards.specDirs`, or a spec tracked from that base when a plan added after base pairs with it by basename. Zero specs -> stop; more than one -> human picks. Carry this path to entry check 6 and the post-restore announcement without re-resolving it.

Honor SKILL.md entry check 6's deferred stop before any arming call below. For brainstorm-stage briefs, resolve any existing spec through these candidate rules and run entry check 6's deferred-header admission before `start brainstorm`; with zero specs, restore brainstorm without a spec. Keep grant decoding exempt for this stage. A handoff after row 4's push succeeded but PR creation failed still has brainstorm in_progress; its deferred header stops restoration, not the ordinary gate.

Calls in order, keyed by the brief's active phase (`→`):

| Active | Calls, in order |
|---|---|
| brainstorm | `start brainstorm`; `substep` if the brief shows one |
| plan | `start brainstorm`; `skip brainstorm S`; `start plan`; `substep` if shown |
| implement | `start brainstorm`; `skip brainstorm S`; `start plan`; `plan_check({ planPath })`; on FAIL `Read` `plan-repair.md` in full and run its `## Plan repair`; on PASS `skip plan R`; `start implement`; `substep` if shown; `plan_tracker init` |
| verify | as implement through `skip plan R`, then `skip implement R`; `start verify`; `substep` if shown; `plan_tracker init`. Never call `start implement`. |
| ship | as verify, except that a brief with a `legs:` block and a correctly stripped plan takes `coordinated.md` "Coordinated admission"'s fully receipt-validated retry instead of plan repair. Restoration stops at verify in_progress: `complete verify` needs a fresh conformance dispatch and `skip verify` would bypass a real gate. Announce that the closure review re-runs before ship |

Apply SKILL.md "Restore rules" at every `plan_tracker init`, restoring the brief's task names, order and statuses verbatim.

`planPath`: the brief carries none. Resolve as "Candidates" does: the single plan added after the candidate base, paired with `<specDir>/<same basename>` whether that spec was added after base or tracked from base; resolve it to an absolute path under the worktree before `plan_check`. Zero pairs -> stop; more than one -> human picks.

## Spec with plan

Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../gauntlet/menu-layout.md).

Show, and ask the human to confirm or edit both in one reply:

1. Per task, in plan order: the commits after the plan commit that touch any path in
   the task's declared `Files:` block, taking the union of the block in the working
   copy and in `git -C <worktree> show <plan-commit>:<plan path relative to the worktree>`
   (an object path inside the repository, never the absolute `planPath`; a `Modify:` row
   dropped by plan repair still yields its `complete` evidence).
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

Validate the confirmed snapshot against SKILL.md "Restore rules" (pending-suffix order; the implement auto-complete edge) before any tracker call. Reject an infeasible edit by citing the offending rows and re-asking. Confirmation
edits override proposals; never rewrite confirmed state silently.

After confirmation:

1. Run SKILL.md entry check 6 on `<spec path>` (a malformed `**Amend-grant:**` line stops here, no tracker call); then `start brainstorm`; `skip brainstorm resume: <spec path>`; `start plan`.
2. `plan_check` with `planPath` = the plan's absolute path. FAIL -> `Read` `plan-repair.md` in full and
   run its `## Plan repair`; its PASS continues at step 3, its stop ends the restore with plan
   in_progress, no `init`.
3. PASS -> `skip plan` with the same `resume:` reason; for stage verify also
   `skip implement`; `start <stage>`.
4. `init` the confirmed non-empty task list as `{name, status}` elements.
5. `phase_tracker status` and `plan_tracker status` must match the confirmed active
   stage and task list exactly; a mismatch is reported verbatim, not patched.

End with SKILL.md's closing line. There is no brief `Active task` on this route, so `<task>` is the first confirmed
`in_progress` task, else `none`.
