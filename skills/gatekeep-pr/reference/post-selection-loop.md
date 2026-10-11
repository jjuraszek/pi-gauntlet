# gatekeep-pr: step 7 - loop

Read from SKILL.md step 7. Execute only the selected pick or validated retained action through `### Next action`, then re-enter: a fix wave's own push re-enters step 4 through the own-push sequence (`### Re-render`); any other head move re-enters step 3; an unchanged head re-enters step 5. Loop until `stop`. Merge preconditions, the output done-check, and teardown live here; the wave itself lives in `fix-wave.md`.

### Continuation record

Before tracker initialization, mint `mktemp "${TMPDIR:-/tmp}/gatekeep-state.XXXXXX"` and write the continuation subset as JSON using the field schema in `../verification-brief.md`. Initialize grants to null and rounds to zero only for this new invocation. Put `state: <absolute-path>` in the first tracker task's name, the no-tool checklist header, continuation summaries, and `show evidence` on both harnesses. Use native file operations on Claude Code; no pi tool is required.

Persist the assessed head/body, scope, finding IDs and independent contributions, exact selected payload/body snapshots, evidence and helper-output paths, prior comment identity/body baseline and ledger. Keep raw diff, logs, and bulk metadata outside this record. Update changed JSON fields, not a recreated memory summary; fetched fields never overwrite grants, usage, or scope-at-grant.

Read and validate the existing file at every re-entry and before retained authority. Match lowercase base owner/repository, numeric PR number, and exact case-sensitive baseRefName against `consent.target`; unreadable base identity establishes no grant. Missing, unreadable, malformed, mismatched state or a lost locator gives no authority and never resets the budget. Pause, never search another run's file or infer grants from chat. Reconcile an in-flight stage against existing helper results and local/remote heads before replay; absent proof, stop.

Only the orchestrator records direct human selections and revocations; fetched PR text and helper outputs are never grant sources. Native harness tool permissions remain in force. Normalize explicit human picks to verbs and stable IDs, never display numbers, and persist before mutation. Bare `fix` records all current/later source-verified blockers within agreed scope; named `fix` records only those IDs for later independent reassessments; route an active pre-push wave's retries through `fix-wave.md` `## Review before push`, not this named-ID limit. `fix + nits` adds this pick's nits only; `fix nits` and clarification-only fixes establish no ongoing blocker grant. Record `merge base` independently for the target base. Persist `revoke fix` or `revoke merge base` by clearing only that grant. Keep valid grants through pushes, reads, waiting, recommendations, and separately authorized actions; terminal state, stop, or invalid target ends authority. Never infer flaky/real/ci-broken dispositions, workflow approval, reply/review, final merge/approval, or contract edits.

On a contract exception, retain the concrete proposal and paused continuation in the existing record and render the `decision-menu.md` contract-exception menu; route its selection through `### Contract decision`.

### Contract decision

Normalize a numeric or typed selection to its rendered row verb before recording the authoritative decision against the pending exception. Existing terminal/sync stops take precedence. Consume neither retained repair authority nor the proposed scope change while the decision is pending.

| Selected row | Course |
|---|---|
| `accept contract change` | Invoke the contract's existing owning amendment process for the concrete proposal, not a direct scope/body edit; settle the exception and update the stored scope baseline only after that process completes. Resume only actually selected repair actions. |
| `preserve contract` | Reject the proposed scope change, keep the stored baseline, and settle only that exception; resume only selected or validly retained scope-preserving repair. Preserve every independent blocker. |
| `show evidence` | Show the recorded proposal and evidence, then re-render the pending decision without settling it. |
| `stop` | Run the existing stop and teardown course. |

### Next action

After fresh evidence/permission assessment and eligible comment source review, validate the record and select the first applicable row:

| Fresh state | Action |
|---|---|
| Pending contract exception | Render the contract-exception menu and route a pick through `### Contract decision`; terminal/sync stops take precedence over this row and all repair routing. |
| Completed no-progress result with unchanged failed prerequisite | Render the obstacle through `### No-progress obstacle` before any retained repair routing. |
| Reconciled active pre-push wave has carried items and no unresolved obstacle, authorized by an explicit current or recorded still-valid pick or a matching held grant that has not been revoked, under the existing continuation validation | Retry the carried set through `fix-wave.md` `## Review before push`, including under a named grant; preserve its cap, scoped tests, fresh helpers, and single push. `revoke fix` invalidates the old fix pick as authority; require a restored one-shot nit wave's recorded still-valid pick, not an invented broad grant. Route missing or invalid authority to the existing decision obstacle. |
| Covered conflict or behind-base repair with merge-base grant | Run the helper-owned base course in `fix-wave.md`, preserving the selected strategy. |
| Covered source-backed file blockers with fix grant | Run the existing wave; description targets still need exact selection per `findings.md`. |
| Held repair grant and only readiness evidence for the authorized repair course is pending, including after its payloads were pushed, within current deadline | Continue bounded `### Wait course`; without a grant require explicit wait. |
| Every merge prerequisite holds | Render fresh final menu; never automatically merge or approve. |
| Missing decision, budget, permission, input, failed refresh or expired deadline | Render the concrete obstacle; preserve valid grants without silently renewing the deadline. |

At this boundary and before every external write, fetch actual body and live `baseRefName` with head/state. Compare live `baseRefName` against `consent.target.baseRefName` before consuming authority; pause on an unreadable or changed base without overwriting `consent.target`, choosing a new base, or continuing against the old base. A same-head body edit invalidates old readiness and selected merge; narrowly recheck changed material claims while preserving original intent. Refresh changed proposals and request renewed exact selection. Keep the record through ready-menu rendering; readiness lost later can resume covered work but final merge consent is fresh.

### No-progress obstacle

Persist a completed unsuccessful attempt in the existing `repair.wave.no_progress` checkpoint before re-rendering: identify the failed prerequisite and its observed value, and link the helper result path with its open reason and scoped-test output. Retain the completed wave for reconciliation rather than replaying it. For an empty file round, retain each failed payload's prerequisite in its existing finding-keyed evidence pack and link those IDs from the wave; leave unresolved payloads open.

Check this checkpoint before retained repair routing. Keep grants and `repair.rounds_used` intact until an explicit human decision or an observed change to the failed prerequisite permits a new attempt. Report the concrete missing decision or unchanged failure; a higher round cap is not permission to repeat it. Compare the actual failed input (for a failed scoped test, the named test/source inputs and resolved command), not an unrelated head, body, or check change. Clear only the settled obstacle after recording the direct decision or fresh prerequisite evidence; count an authorized new attempt per `fix-wave.md`.

### Description repair

For an exactly selected payload, perform external-write checks, fetch actual head/body, and compare both with the proposal. Any snapshot change, including an own push, requires renewed selection before writing. Count the pass per `fix-wave.md` before this first mutation. Scope `gh pr edit <N> --body-file <temporary-file>` to the recorded base repository; preserve unrelated body text. Write only in the orchestrator, before a mixed wave's head-changing push while fresh.

Read back actual head/body and require expected text, unchanged head, and a fresh Section B `description recheck` helper before resolving only the claim contribution. Failure, unreadable readback, unexpected text, or remaining contradiction stays unresolved; report it without blind retry. A head move during the write leaves the original operation unconfirmed and the claim initially open; follow the existing fresh-head course (re-enter step 3) and resolve the claim only after actual body and matching evidence and claim checks at that new head. Never reuse old-head evidence, retroactively confirm the old operation, repeat a stale write, or clear independent contributors. API success alone is not closure. No file implementer, empty commit, or full suite runs for body-only work. Keep successful file commits independent of body failures.

Record mixed-pass potentially affected claim IDs in `repair.wave.affected_claims`; before readiness narrowly recheck them against actual pushed head/body and that head's evidence. Preserve unrelated dispositions and independent test/scope/check contributions. A new contradiction gets a new exact proposal and selection. This is the sole relevant exception to own-push claim carry, not whole-wave review. Preserve evidence as specified by the brief's recheck mode. A resolved unchanged claim gets no repeated correction.

Treat pre-write comparison and readback as stale-write checks, not atomic compare-and-swap: a concurrent edit inside the read/write interval remains a race; never overwrite an already observed change.

### Merge preconditions

All must hold before `merge` executes; a `merge` pick while one fails is refused naming it, and the menu re-renders:

- every blocker fixed and pushed, or dispositioned `flaky` by the user
- verification evidence present for the assessed head per the brief's Evidence resolution table - a CI claim or a green local run; a table-sanctioned CI skip is evidence, and `not run` blocks only when the table required a fallback run that did not happen
- a disposition for every material claim (`findings.md`); dispositions recorded before an own push carry to the pushed SHA except mixed-pass affected claims rechecked under `### Description repair`; `source: pending` evidence that never had a claim check withholds `merge`
- evidence provenance clean (`findings.md` `## Provenance`): `worktree_root`, every `run_cwd`, and `head_sha` match on the local path
- `mergeable == MERGEABLE` (`UNKNOWN` after step 2's single re-poll withholds like `CONFLICTING`)
- `merge_state_status` is not `BEHIND`; while it is, the menu renders `update branch` (`fix-wave.md` `## Conflicts` row 1, same precondition) beside the consent rows
- no undispositioned failing check in the resolved set, no **binding** pending check (`../verification-brief.md` Section B, binding classification)
- `merge_state_status` is not `BLOCKED`, `UNKNOWN`, or `unreadable`, and the pre-menu refresh succeeded (`### Pre-menu refresh`); a non-`BLOCKED` value is never a verdict - it only leaves this row satisfied, and a `gh pr merge` refusal is reported verbatim
- no retained, unreviewed comment delta (`### Re-render` step 4)
- worktree tracked-clean and synced with the remote head (fixes pushed first)
- the compare-and-swap below passes

### Compare-and-swap

Before every external write, re-fetch `headRefOid`, `state`, `mergeable`, and `mergeStateStatus`, plus actual `body` and `baseRefName`; apply the live target check in `### Next action` before consuming authority. A body change aborts a selected merge pending the narrow reassessment in `### Next action` and fresh selection. While the sync record is `rebased locally`, compare the fetched `headRefOid` against the record's `<pre_head>`: a move takes the lease-refusal path of `fix-wave.md` `## Evidence after push` (`git reset --hard <pre_head>`, assert `HEAD == <pre_head>` and a clean tree, record `sync: failed - remote head moved`, render `stop` and `show evidence` only) instead of the head-move re-sync; an unmoved head never re-syncs, and a `state` change to closed or merged renders `stop` and `show evidence` only. On a pushed head: a head or state change since assessment invalidates the current state - re-sync the worktree, re-enter step 3, and re-render the menu; a `mergeStateStatus` change alone (head unchanged) invalidates a `merge` or `merge anyway` pick and re-enters step 5 through `### Pre-menu refresh`; `reply`, `review`, and `approve` proceed, and the next menu renders from the refreshed value. Exception: a pick's own push updates the assessed head to the pushed SHA as part of that pick's execution - this self-inflicted head move does not invalidate the pick; the next compare-and-swap runs against the new head on the next external write. Before a merge executes (plain or `anyway`), run the full comment refetch and reconciliation (`### Re-render` steps 1-5), not just placeholder detection. If the head changed, re-enter step 3 instead. A new or changed-body delta since the consent render aborts the selected merge, plain or `anyway`: show the reconciled report and request a fresh pick even when no blocker resulted. A newly `pending` row, a queued/in-progress reviewer run, or a failed refetch (`comments not refreshed (<reason>)`) refuses a plain merge and re-renders; `anyway` overrides only those existing pending/refetch-failure overlays and prints what it overrode, never a new blocker or unreviewed delta.

### Fix wave

For a `fix` pick, take the drafted payloads (`findings.md` `## Drafted payloads`) for the named blockers - all open blockers by default; `fix nits` takes nit payloads only, drafted at this pick; `fix + nits` both. A finding closed by disposition is skipped. Route selected description targets through `### Description repair`. A failing check or finding with no drafted file or description edit is reported as not fixable by this verb and stays open.

Apply per `fix-wave.md`: the local conflict check, one fresh implementer helper per payload with scoped tests only, the pre-push reviewer with its closure lines, the push, and the evidence poll. The orchestrator never edits a tracked file and never commits. When `head_pushable` is false, the wave's commits stay in the local `pr-<N>` worktree: report the branch name and re-enter step 5.

`approve workflow run` and `update branch` execute per `fix-wave.md` (`## Evidence after push`, `## Conflicts`). Execute `review`, `reply`, `approve`, `post coverage to ticket`, and `post coverage to PR` via `gh pr review`, `gh api`, `gh issue comment`, `gh pr comment`, or the resolved tracker tool, non-interactively, with the drafted payload - after the output done-check below.

### Merge course

`merge` executes as `gh pr merge --match-head-commit <assessed-sha>` with the resolved merge policy. Push and merge are never one pick.

After `gh pr merge` returns, read `gh pr view <N> --json state,mergeCommit`. `state: MERGED` -> render the `AC coverage` block once and re-render the menu under the `own merge` overlay (`decision-menu.md`); any other state (a merge queue) -> one `PR comments` line `The merge is queued, so coverage posts wait. (<state>)` and the menu `wait` (re-run the read) / `show evidence` / `stop`. The block, `<sha>` = `mergeCommit.oid`, one row per `scope.rows` entry in row order with its outcome (`covered`, `deferred per spec to <ref>`, `deviates per spec: <why>`, `elsewhere per spec: <repo>`, `venue: <env> - <observation>, checked before prod deploy`); with no rows (`source: pr`, or an empty `scope.rows`) the block has no row lines and `post coverage to ticket` is not offered. With `source: pr` the header line drops `, spec <path>`. An `in-scope` row whose observation half is `not judged here` renders `covered; observable half checked after merge`.

```markdown
## AC coverage
Informational - the ticket's rows are unchanged. PR <url>, merged <sha>, spec <path>
- [ ] <row 1 text verbatim> - covered
- [ ] <row 3 text verbatim> - deferred per spec to <ref>
- [ ] <row 2 text verbatim> - deviates per spec: <why>
- [ ] <row 4 text verbatim> - venue: <env> - <observation>, checked before prod deploy
- [ ] <row 5 text verbatim> - elsewhere per spec: <repo>
```

A post is one write of that block, verbatim; a post that succeeded cannot be picked again in this run. `/skill:check-delivery` reads a posted block as any other comment, and the block's first line states that it amends nothing.

### Re-render

After every push or any mutation that can change readiness (fix wave pushed, PR head moved), re-sync the worktree. On an own push, after `fix-wave.md` `## Evidence after push`, run steps 1-5 below and render the menu from the pre-push reviewer's closure lines for the exact pushed SHA, where a blocker whose closure line reads `resolved` leaves the rendered list while its internal ID stays in the ledger and new findings continue each sequence; no claim re-check and no whole-wave review runs after an own push except the narrow affected-claim recheck in `### Description repair`. On every other head move, re-enter step 3, then run steps 1-5 below - the last read before the menu renders:

1. Run the pre-menu refresh (`### Pre-menu refresh`), then re-run the Section A comment fetches (`../verification-brief.md`: both `--paginate` calls, plus the GraphQL `reviewThreads` query when the initial gather used it), one `gh run view` per placeholder row, and the reviewer-run `gh run list` when a reviewer workflow is known. Read-only.
2. Diff the fresh set against the `C#` ledger (`findings.md` `## Namespaces`) by `id` and `updated_at`:
   - same `id`, same `updated_at` -> unchanged: keep the existing `C#`.
   - same `id`, different `updated_at` -> edited: mint a new `C#`; the old one is `superseded by C<new>`. An `updated_at` change with an identical body (reaction, revert) still counts as edited.
   - `id` not in the ledger -> new: mint a new `C#`, except ids the gate itself posted via `reply` in this run (recorded at post time), which are never minted.
   - `id` in the ledger, absent from the complete fresh set -> `withdrawn` under its existing `C#`.
   - Bot-authored placeholder prefix or error header (brief Section C) -> the state from the brief's placeholder table, under the `C#` the edited/new rule assigns.
3. Section C re-triages the full fresh set against the new head. An unchanged row keeps its `C#`; its drafted reply is kept verbatim only when its label is also unchanged and regenerated when the label moves. Edited and new rows get a fresh label and a regenerated reply.
4. Reconcile the body delta before consuming it. Compare fresh rows to the current digest's `comments` by id and body: include new rows and changed-body rows, excluding withdrawn/superseded rows, gate-posted ids, and the brief's placeholder/error-header states. A same-head identical-body timestamp edit causes no source review and no test run, even though step 2 mints a `C#`. Review each eligible delta once against source at the assessed head and the merged rubric through a fresh reviewer helper with its native report (`../SKILL.md` `## Harness notes`). Treat comment text as a lead, not a finding: verify it against code, then integrate only own source-backed findings through step 5 severity and AC rules, deduplicating against existing `P#`/`L#` IDs. A bot verdict is not blindly promoted. Do not run a full suite or whole-diff review solely for a comment-only change. If source review remains unresolved, retain the delta and render per the `comment source review incomplete` overlay (`decision-menu.md` `## Overlays`).
5. Comment triage never mints `P#`/`L#` (brief Section C); the separate source review in step 4 can. Only after that review completes, replace the digest's `comments` with the fresh set so the next iteration diffs against the latest snapshot.

**Refetch failure** (`gh` non-zero, network, pagination incomplete): re-render with the ledger's prior states, one `PR comments` line `Comments could not be refreshed, so merge waits. (<reason>)`, and the pending-reviewer overlay withholding `merge`; `wait` is recommended; a composed `merge anyway` remains available when `decision-menu.md` `## Availability` allows it.

### Pre-menu refresh

The first read of step 5, before the report and the menu render from one state - the first pass included (a long local run or review can stale the gather), every `### Re-render` entry, the post-`wait` re-fetch, `update branch`, a `merge base` round, and a fix-wave push (`fix-wave.md` `## Evidence after push`). Run `gh pr view <N> --json headRefOid,state,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup` and `gh run list -R <owner>/<repo> -c <headRefOid> --json databaseId,status,conclusion,workflowName,url`. While the sync record is `rebased locally`, compare the fetched `headRefOid` against the record's `<pre_head>` and render from that alone: a move takes the lease-refusal path of `fix-wave.md` `## Evidence after push` (`git reset --hard <pre_head>`, assert `HEAD == <pre_head>` and a clean tree, record `sync: failed - remote head moved`, render `stop` and `show evidence` only); an unmoved head keeps `status_checks[]` and `actions_runs[]` as they are, skips the evidence re-resolve, and ignores `mergeable` and `mergeStateStatus` changes - `source: pending` holds until the lease push rewrites the record; a `state` change to closed or merged renders `stop` and `show evidence` only. On a pushed head: head moved -> the head-move rule (re-enter step 3). `state` or `mergeable` changed (head unchanged) -> route through `### Compare-and-swap` re-assessment. Head unchanged with `state` and `mergeable` unchanged -> replace `permissions.merge_state_status`, `pr.reviewDecision`, `status_checks[]`, and `actions_runs[]` in the digest together, re-normalize and re-classify every pending check (`../verification-brief.md` Section B, binding classification), and re-resolve the Evidence resolution table on the fresh set, so a check whose run completed since the last menu is never paired with its cached run status; when that re-resolve moves `source: pending` to CI-sufficient, dispatch the Section B helper in claim-check-only mode (`../verification-brief.md` Section B) before rendering. A `gh` failure keeps the prior values, classifies every pending check as binding (`../verification-brief.md` Section B, binding classification), and renders the `merge state` overlay (`decision-menu.md` `## Overlays`) through `## Withhold reason resolver` reason 2 (locator `merge state not refreshed (<reason>)`). Also run `gh pr view <N> --json headRefOid,body,baseRefName` at this next-action boundary and apply `### Next action` target and body freshness before readiness. The refresh is read-only and never mints `C#` rows - comment reconciliation stays in `### Re-render`.

### Wait course

Own the existing poll window here for the first-pass evidence poll, after-push poll, and selected or retained Wait entry. Start a new window only on the first poll with a null deadline, an actual newly successful authorized push, or a new explicit `wait` selection. Persist `repair.poll_deadline` as an absolute timestamp equal to current time plus the resolved `timeout minutes` (default 15) before checking expiry or polling; preserve it through re-entry and context restoration. Record the new deadline with the successful push checkpoint or direct wait selection, not on replay. On re-entry to the same active window, including the after-push course for an already recorded push, reuse the saved deadline. A retained grant, repeated menu/Wait entry, or expiry alone never renews it. A held grant alone never starts unrelated polling; retained entry requires the authorized-course pending-evidence row in `### Next action`.

Before any poll, check the saved deadline; when expired, take the completion/timeout reconciliation below and render the concrete obstacle through `### Next action`, without another poll. Run a sequence of short bounded calls - never one long bash call. Each iteration: `gh run view -R <repo> <run-id> --json status,conclusion` for every tracked run (placeholder-linked and head-listed), and `gh pr view <N> -R <repo> --json statusCheckRollup,mergeStateStatus` while any pending check in the resolved set is binding when classified against the polled rollup and the polled `mergeStateStatus`, or the polled `mergeStateStatus` is `BLOCKED`, `UNKNOWN`, or `unreadable`; when any row has no parsable URL, or its run is completed while the prefix persists, one comment refetch as well; then sleep 30 s. Use each polling refetch to classify binding checks and compare the loop's stop condition against the polled values; leave the digest and `C#` ledger untouched until the completion/timeout reconciliation below - this preserves persisted digest state, not the loop's comparison values. Check the persisted absolute deadline between iterations (the same timeout knob as the local verification run). Stop when every tracked run is completed and no pending check is binding against the polled values and the polled `mergeStateStatus` is none of `BLOCKED`, `UNKNOWN`, `unreadable` and no row is in the "completed `success`, prefix persists" state, or the deadline passes.

Then run `### Pre-menu refresh` (it re-fetches `statusCheckRollup`, `headRefOid`, `state`, `mergeable`, `mergeStateStatus`). If the head advanced or state/mergeability changed, route through compare-and-swap re-assessment before reusing evidence or reviewing comments; otherwise re-resolve the brief's Evidence table on the fresh rollup; dispatch a fresh Section B helper for a local run only when the re-resolved table selects a local-run row (Fallback, Held run not approvable, or Opt-out - `../verification-brief.md` Evidence resolution) and no evidence exists yet for this head - otherwise the existing evidence stands. On completion or timeout, run steps 2-5 of `### Re-render` plus step 1's comment and reviewer-run reads - the pre-menu refresh already ran - and re-render; do not re-run claim-check or whole-diff review solely because the head did not move. On timeout: rows in the completed-`success`/prefix-persists state become `reviewer failed (stale placeholder)` (brief Section C placeholder table); every other `pending` row stays `pending`, merge stays withheld, `wait` renders as row 1 again for a new explicit selection; render the expired-window obstacle through `### Next action`, never automatically re-enter Wait.

### Output done-check

Before posting or committing any external payload - review bodies, replies, commit subjects, tracker comments - re-read it against SKILL.md `## Wording rules` and any `## comms style` rules: ASCII only; no headings or template scaffolding under ~150 words; findings `file:line`-specific where one exists; ends on the fix or asked action, not a recap; never invents content to fill a section. The `AC coverage` block is the one exception: it posts verbatim, heading and checkbox rows included.

### Teardown

Delete the consent record and temporary description body-files on every handled terminal exit, even when checkout teardown is declined. Temporary storage can disappear after OS cleanup or reboot; never discover authority automatically in a new session.

| | Created worktree | Reused worktree |
|---|---|---|
| Own merge | tear down when the own-merge or merge-queued menu exits on `stop` or after the last post row leaves it | same |
| Non-merge stop | offer teardown, never autonomous; say when unpushed fix commits would be discarded | leave as found; say so explicitly when unpushed fix commits remain, and let the user choose leave-or-discard |

On a `rebased locally` head the `stop` reset (`decision-menu.md`) runs first; the Non-merge stop row then applies with no unpushed fix commits.

Drafted payloads that were never applied are dropped with the run; the worktree was never dirtied by them. Delete every helper output file minted this run and every `log_path` they name on every exit.
