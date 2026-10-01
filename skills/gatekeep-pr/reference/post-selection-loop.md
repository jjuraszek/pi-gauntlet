# gatekeep-pr: step 7 - loop

Read from SKILL.md step 7. Execute only the selected pick, then re-enter: a fix wave's own push re-enters step 4; any other head move re-enters step 3; an unchanged head re-enters step 5. Loop until `merge` or `stop`. Merge preconditions, the output done-check, and teardown live here.

### Merge preconditions

All must hold before `merge` executes; a `merge` pick while one fails is refused naming it, and the menu re-renders:

- every blocker fixed and pushed, or dispositioned `flaky` by the user; no `impossible` row in `drafted` or `proposed` unless the pick is `merge anyway - accept AC<n> as impossible`
- verification evidence present for the assessed head per the brief's Evidence resolution table - a CI claim or a green local run; a table-sanctioned CI skip is evidence, and `not run` blocks only when the table required a fallback run that did not happen
- evidence provenance clean (`findings.md` `## Provenance`): `worktree_root`, every `run_cwd`, and `head_sha` match on the local path
- `mergeable == MERGEABLE` (`UNKNOWN` after step 2's single re-poll withholds like `CONFLICTING`)
- no undispositioned failing check in the resolved set, no pending required check
- no retained, unreviewed comment delta (`### Re-render` step 4)
- worktree tracked-clean and synced with the remote head (fixes pushed first)
- the compare-and-swap below passes

### Compare-and-swap

Before every external write, re-fetch `headRefOid`, `state`, and `mergeable`. Any change since assessment invalidates the current state - re-sync the worktree, re-enter step 3, and re-render the menu. Exception: a pick's own push updates the assessed head to the pushed SHA as part of that pick's execution - this self-inflicted head move does not invalidate the pick; the next compare-and-swap runs against the new head on the next external write. Before a merge executes (plain or `anyway`), run the full comment refetch and reconciliation (`### Re-render` steps 1-5), not just placeholder detection. If the head changed, re-enter step 3 instead. A new or changed-body delta since the consent render aborts the selected merge, plain or `anyway`: show the reconciled report and request a fresh pick even when no blocker resulted. A newly `pending` row, a queued/in-progress reviewer run, or a failed refetch (`comments not refreshed (<reason>)`) refuses a plain merge and re-renders; `anyway` overrides only those existing pending/refetch-failure overlays and prints what it overrode, never a new blocker or unreviewed delta.

### Fix wave

For a `fix` pick, take the drafted payloads (`findings.md` `## Drafted payloads`) for the named blockers - all open blockers by default, the nit payloads when no blocker is open; `fix nits` takes nit payloads only, `fix + nits` both. A finding closed by disposition is skipped. A finding whose payload touches no file (a failing check, a claim with no drafted edit) is reported as not fixable by this verb and stays open.

Batch payloads by the union of files each touches; payloads that share a file share a batch. At two payloads or fewer, apply inline. Past that, dispatch `implementer` children with `subagent({ agent: "implementer", context: "fresh", cwd: <PR worktree> })`, one per batch, in parallel when more than one batch results; each child is edit-only (no git commands, no verification runs) and applies the consented payload rather than re-solving the finding; `worktree: true` is forbidden (`assessment.md` `## Inline first; dispatch when pi-cohort is present`). The orchestrator owns commit, verification, and push.

Once every batch returns, commit as one local commit set (one commit, or one per batch; subjects name the fixes, doc and code alike). Run the verification pass once at the resulting SHA - one verification pass per wave, never per fix or per batch; this is the retained contract. On green, push once; the evidence is now current for the pushed head, so the loop re-enters step 4 after its own push (claim re-check, comment refresh, review of the delta), never step 3. On red, do not push: leave the commits local, re-render with the blockers still open, and say that unpushed fix commits sit in the worktree (`### Teardown`). On a fork PR, `push` is not available: commit locally, report the branch name, and re-enter step 5.

Execute `review`, `reply`, `approve`, and `propose ticket change` via `gh pr review`, `gh api`, `gh issue comment`, or the resolved tracker tool, non-interactively, with the drafted payload - after the output done-check below.

### Merge course

`merge` executes as `gh pr merge --match-head-commit <assessed-sha>` with the resolved merge policy. Push and merge are never one pick.

### Re-render

After every push or any mutation that can change readiness (fix wave pushed, PR head moved), re-run the claim-check and the review on the synced worktree: claims are re-checked against the new head and findings re-rendered without a second verification pass - the wave's single pass already covered this head; a blocker confirmed resolved leaves the rendered list while its internal ID stays in the ledger; new findings continue each sequence. Then refetch comments - the last read before the menu renders:

1. Re-run the Section A comment fetches (`../verification-brief.md`: both `--paginate` calls, plus the GraphQL `reviewThreads` query when the initial gather used it), one `gh run view` per placeholder row, and the reviewer-run `gh run list` when a reviewer workflow is known. Read-only.
2. Diff the fresh set against the `C#` ledger (`findings.md` `## Namespaces`) by `id` and `updated_at`:
   - same `id`, same `updated_at` -> unchanged: keep the existing `C#`.
   - same `id`, different `updated_at` -> edited: mint a new `C#`; the old one is `superseded by C<new>`. An `updated_at` change with an identical body (reaction, revert) still counts as edited.
   - `id` not in the ledger -> new: mint a new `C#`, except ids the gate itself posted via `reply` in this run (recorded at post time), which are never minted.
   - `id` in the ledger, absent from the complete fresh set -> `withdrawn` under its existing `C#`.
   - Bot-authored placeholder prefix or error header (brief Section C) -> the state from the brief's placeholder table, under the `C#` the edited/new rule assigns.
3. Section C re-triages the full fresh set against the new head. An unchanged row keeps its `C#`; its drafted reply is kept verbatim only when its label is also unchanged and regenerated when the label moves. Edited and new rows get a fresh label and a regenerated reply.
4. Reconcile the body delta before consuming it. Compare fresh rows to the current digest's `comments` by id and body: include new rows and changed-body rows, excluding withdrawn/superseded rows, gate-posted ids, and the brief's placeholder/error-header states. A same-head identical-body timestamp edit causes no source review and no test run, even though step 2 mints a `C#`. Review each eligible delta once against source at the assessed head and the merged rubric, inline first; optionally dispatch the existing code-reviewer with its native report, falling back inline on failure. Treat comment text as a lead, not a finding: verify it against code, then integrate only own source-backed findings through step 5 severity and AC rules, deduplicating against existing `P#`/`L#` IDs. A bot verdict is not blindly promoted. Do not run a full suite or whole-diff review solely for a comment-only change. If source review remains unresolved, retain the delta and render per the `comment source review incomplete` overlay (`decision-menu.md` `## Overlays`).
5. Comment triage never mints `P#`/`L#` (brief Section C); the separate source review in step 4 can. Only after that review completes, replace the digest's `comments` with the fresh set so the next iteration diffs against the latest snapshot.

**Refetch failure** (`gh` non-zero, network, pagination incomplete): re-render with the ledger's prior states, one `PR comments` line `Comments could not be refreshed, so merge waits. (<reason>)`, and the pending-reviewer overlay withholding `merge`; `wait` is recommended; a composed `merge anyway` remains available.

### Wait course

For a `wait` pick, run a sequence of short bounded calls - never one long bash call. Each iteration: `gh run view -R <repo> <run-id> --json status,conclusion` for every tracked run (placeholder-linked and head-listed), and `gh pr view <N> -R <repo> --json statusCheckRollup` when a required check is pending; when any row has no parsable URL, or its run is completed while the prefix persists, one comment refetch as well; then sleep 30 s. Use each polling refetch only to observe run/placeholder state; leave the digest and `C#` ledger untouched until the completion/timeout reconciliation below. Check the deadline between iterations: the resolved `timeout minutes` (default 15, the same knob as the local verification run). Stop when every tracked run is completed and no required check is pending and no row is in the "completed `success`, prefix persists" state, or the deadline passes.

Then re-fetch `statusCheckRollup`, `headRefOid`, `state`, `mergeable`. If the head advanced or state/mergeability changed, route through compare-and-swap re-assessment before reusing evidence or reviewing comments; otherwise re-resolve the brief's Evidence table on the fresh rollup; run the verification command only when the re-resolved table selects the Fallback row and no evidence exists yet for this head - otherwise the existing evidence stands. On completion or timeout, run the refetch (steps 1-5 above) and re-render; do not re-run claim-check or whole-diff review solely because the head did not move. On timeout: rows in the completed-`success`/prefix-persists state become `reviewer failed (stale placeholder)` (brief Section C placeholder table); every other `pending` row stays `pending`, merge stays withheld, `wait` renders as row 1 again.

### Output done-check

Before posting or committing any external payload - review bodies, replies, commit subjects, tracker comments - re-read it against SKILL.md `## Wording rules` and any `## comms style` rules: ASCII only; no headings or template scaffolding under ~150 words; findings `file:line`-specific where one exists; ends on the fix or asked action, not a recap; never invents content to fill a section.

### Teardown

| | Created worktree | Reused worktree |
|---|---|---|
| Merge success | tear down | tear down (the sync precondition guarantees no local-only work is stranded, and the branch is gone remotely) |
| Non-merge stop | offer teardown, never autonomous; say when unpushed fix commits would be discarded | leave as found; say so explicitly when unpushed fix commits remain, and let the user choose leave-or-discard |

Drafted payloads that were never applied are dropped with the run; the worktree was never dirtied by them.
