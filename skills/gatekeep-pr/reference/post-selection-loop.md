# gatekeep-pr: post-selection loop

## Post-selection loop

Read from SKILL.md `## Act`. Treat the menu as a state machine: execute only the selected course, re-render, and loop until the user selects merge or an explicit stop/no-action row.

### Compare-and-swap

Before every external write, re-fetch `headRefOid`, `state`, and `mergeable`. Any change since assessment invalidates the current state - re-sync the worktree, re-run Phase 3 per `assessment.md` `## Phase 3 - Verify, then review`, and re-render the menu. Exception: a course's own push updates the assessed head to the pushed SHA as part of that course's execution - this self-inflicted head move does not invalidate the course; the next compare-and-swap check runs against the new head on the next external write. Before a merge executes (plain or `anyway`), also run one comment refetch with placeholder detection and the reviewer-run check (`### Re-render` steps 1-2). A newly `pending` row, a queued/in-progress reviewer run, or a failed refetch (`comments not refreshed (<reason>)`) refuses a plain merge and re-renders; `anyway` proceeds and prints what it overrode.

### Fix wave

For a `fix <set>` selection, filter the selected set to worktree-fixable `P#`s first: drop any `P#` closed by disposition (per `findings.md` `## Dispositions`). Route file-less `P#`s (a claim or a gate command as `source_ref`, no draft touching a file) to run inline and sequentially, never as part of a parallel batch. A claim `P#` with a drafted file edit is worktree-fixable and batches.

Batch the remaining worktree-fixable set by the union of files each finding's drafted edit in `## Drafted fixes / review` touches - fall back to the `source_ref` file only when a finding has no draft. Findings whose drafts share a file share a batch.

Use one child contract for every batch, whether there is one or many: dispatch `implementer` children with `subagent({ agent: "implementer", context: "fresh", cwd: <PR worktree> })`. The orchestrator owns commit, gate, and push - never a child. Every dispatched child gets `cwd` = the PR worktree; `worktree: true` is forbidden per `assessment.md` `## Inline-first execution`. Each child is edit-only - no git commands, no verification runs - and must never delete `.pi/gauntlet/telemetry/**` or anything under the configured telemetry dir (a fix that "cleans up" the run's telemetry record is a defect in the fix, not a cleanup). Each child's task is that batch's `P#` lines plus the drafted edit already keyed to each ID in `## Drafted fixes / review` - the child applies the consented payload, it does not re-solve the finding.

At a cutoff of 2 worktree-fixable findings or fewer, the orchestrator applies the fix inline instead of dispatching - the no-cohort path stays available at any batch count per `assessment.md` `## Inline-first execution`. Past that cutoff, when more than one batch results, dispatch the batches' children in parallel, all under the same contract.

Once every dispatched or inline batch returns, commit the golden course as one local commit set - the code fixes plus any already-applied reviewed doc edits selected alongside them (one commit, or one per batch sequentially; subjects name the fixes). Re-resolve the evidence for the new head once (the brief's stale-head row: prior evidence is stale; the local command executes only on a fallback/opt-out resolution). Before the push, run `node <bin>/gauntlet-telemetry-salvage.mjs --worktree <provisioned path> --base origin/<baseRefName>` (no `--check`); a `restored` or `(marked shipped)` commit rides the wave's single push and the pushed SHA becomes the assessed head under the course's-own-push rule in `### Compare-and-swap`. Print its stdout in the re-rendered report's `## Evidence`. On green, push once - gate and push are per-wave invariants, never per-fix or per-batch. On red, do not push: leave the commit(s) local, re-render with the unresolved `P#`s still open, and warn that unpushed fix commits sit in the worktree exactly like unpushed doc edits (per `### Teardown`).

Doc fixes (`push-docs` alone) follow the same rule: stage and commit (subject names what is documented), re-run the gate, and push only on green. Execute reviews, replies, and tracker actions via `gh pr review` / `gh api` / the tracker tool, non-interactively, with the drafted payload for the selected IDs.

### Merge course

Merge always executes as `gh pr merge --match-head-commit <assessed-sha>`. Push and merge are never bundled into one selection, with one scoped exception: the selected merge course first runs the salvage (no `--check`) via `node <bin>/gauntlet-telemetry-salvage.mjs --worktree <provisioned path> --base origin/<baseRefName>`. `present` -> merge as-is. `restored <path> from <sha>` -> push that single `telemetry: restore` commit as part of this course, re-fetch `headRefOid`, and pass the new SHA to `--match-head-commit`. A line ending `(marked shipped)` (`present` or `restored`) is handled the same way: push that single `telemetry:` commit, re-fetch `headRefOid`, and pass the new SHA. `restore failed` -> merge proceeds, the reason is printed, and the follow-up names recovery from the PR head ref. A merge selection while any precondition (SKILL.md `## Verdict`) fails is refused, naming the failing precondition, and the menu re-renders - never a dead end, never a silent merge.

### Re-render

After any mutation that can change readiness (fix wave pushed, docs pushed, PR head moved), re-run the claim-check and Review on the synced worktree: claims are re-checked against the new head and findings are re-rendered, but do not re-execute the verification command here - the fix wave's evidence re-resolution already was the wave's one gate pass. Annotate each selected `P#`/`L#` confirmed resolved as `(fixed in <sha>)` under its original ID; unresolved ones stay open unchanged; new findings continue the sequence. Then refetch comments - the last read before the menu renders:

1. Re-run the Section A comment fetches (`../verification-brief.md`: both `--paginate` calls, plus the GraphQL `reviewThreads` query when the initial gather used it), one `gh run view` per placeholder row, and the reviewer-run `gh run list` when a reviewer workflow is known. Read-only.
2. Diff the fresh set against the `C#` ledger (`findings.md` `## IDs`) by `id` and `updated_at`:
   - same `id`, same `updated_at` -> unchanged: keep the existing `C#`.
   - same `id`, different `updated_at` -> edited: mint a new `C#`; the old one renders `superseded by C<new>` with no label and no reply. An `updated_at` change with an identical body (reaction, revert) still counts as edited.
   - `id` not in the ledger -> new: mint a new `C#`, except ids the gate itself posted via `reply <C#s>` in this run (recorded at post time), which are never minted.
   - `id` in the ledger, absent from the complete fresh set -> `withdrawn` under its existing `C#`, no label, no reply.
   - placeholder prefix or error header -> the state from the brief's Section C placeholder table, under the `C#` the edited/new rule assigns.
3. Section C re-triages the full fresh set against the new head. An unchanged row keeps its `C#`; its drafted reply is kept verbatim only when its label is also unchanged and regenerated when the label moves (for example `reasonable` -> `already-addressed`). Edited and new rows get a fresh label and a regenerated reply; the pre-push label of an edited comment is not shown.
4. Comment triage never mints `P#`/`L#` (brief Section C). Replace the digest's `comments` with the fresh set so the next iteration diffs against the latest snapshot.

**Refetch failure** (`gh` non-zero, network, pagination incomplete): re-render with the ledger's prior states, add one line `comments not refreshed (<reason>)` to the comment section, and withhold pre-composed merge with that reason. `wait` is the recommended course in refetch-only mode; the custom-row `anyway` override remains available.

Merge, if now available, renders as row 1 unless withheld (`reviewer still running` / `comments not refreshed`).

### Wait course

For a `wait` selection, run a sequence of short bounded calls - never one long bash call. Each iteration: `gh run view -R <repo> <run-id> --json status,conclusion` for every tracked run (placeholder-linked and head-listed); when any row has no parsable URL, or its run is completed while the prefix persists, one comment refetch as well; then sleep 30 s. Check the deadline between iterations: the resolved `timeout minutes` (default 15, the same knob as the local verification run). Stop when every tracked run is completed and no row is in the "completed `success`, prefix persists" state, or the deadline passes.

Then re-fetch `statusCheckRollup`, `headRefOid`, `state`, `mergeable` for the assessed head and re-resolve the brief's Evidence table on the fresh rollup; run the verification command only when the re-resolved table selects the Fallback row and no evidence exists yet for this head (the Pending row never ran it) - otherwise the existing evidence stands: the head is unchanged, so the wave's evidence stays valid and the Stale head row does not fire. Run the refetch (steps 1-4 above) and re-render the comment section, evidence, and menu; no claim-check or Review re-run, because the head did not move. On timeout: rows in the completed-`success`/prefix-persists state become `reviewer failed (stale placeholder)` (brief Section C placeholder table); every other `pending` row stays `pending`, merge stays withheld, `wait` renders as row 1 again, then the cell's courses, then Custom.

### Teardown

| | Created worktree | Reused worktree |
|---|---|---|
| Merge success | tear down | tear down (the sync precondition guarantees no local-only work is stranded, and the branch is gone remotely) |
| Non-merge stop | offer teardown, never autonomous; warn if unpushed doc edits would be discarded | leave as found; say so explicitly when unpushed doc edits or red-gate fix commits remain, and let the user choose leave-or-discard |
