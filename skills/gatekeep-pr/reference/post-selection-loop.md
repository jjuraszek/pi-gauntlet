# gatekeep-pr: step 7 - loop

Read from SKILL.md step 7. Execute only the selected pick, then re-enter: a fix wave's own push re-enters step 4 through the own-push sequence (`### Re-render`); any other head move re-enters step 3; an unchanged head re-enters step 5. Loop until `stop`. Merge preconditions, the output done-check, and teardown live here; the wave itself lives in `fix-wave.md`.

### Merge preconditions

All must hold before `merge` executes; a `merge` pick while one fails is refused naming it, and the menu re-renders:

- every blocker fixed and pushed, or dispositioned `flaky` by the user
- verification evidence present for the assessed head per the brief's Evidence resolution table - a CI claim or a green local run; a table-sanctioned CI skip is evidence, and `not run` blocks only when the table required a fallback run that did not happen
- a disposition for every material claim (`findings.md`); dispositions recorded before an own push carry to the pushed SHA; `source: pending` evidence that never had a claim check withholds `merge`
- evidence provenance clean (`findings.md` `## Provenance`): `worktree_root`, every `run_cwd`, and `head_sha` match on the local path
- `mergeable == MERGEABLE` (`UNKNOWN` after step 2's single re-poll withholds like `CONFLICTING`)
- `merge_state_status` is not `BEHIND`; while it is, the menu renders `update branch` (`fix-wave.md` `## Conflicts` row 1, same precondition) beside the consent rows
- no undispositioned failing check in the resolved set, no **binding** pending check (`../verification-brief.md` Section B, binding classification)
- `merge_state_status` is not `BLOCKED`, `UNKNOWN`, or `unreadable`, and the pre-menu refresh succeeded (`### Pre-menu refresh`); a non-`BLOCKED` value is never a verdict - it only leaves this row satisfied, and a `gh pr merge` refusal is reported verbatim
- no retained, unreviewed comment delta (`### Re-render` step 4)
- worktree tracked-clean and synced with the remote head (fixes pushed first)
- the compare-and-swap below passes

### Compare-and-swap

Before every external write, re-fetch `headRefOid`, `state`, `mergeable`, and `mergeStateStatus`. While the sync record is `rebased locally`, compare the fetched `headRefOid` against the record's `<pre_head>`: a move takes the lease-refusal path of `fix-wave.md` `## Evidence after push` (`git reset --hard <pre_head>`, assert `HEAD == <pre_head>` and a clean tree, record `sync: failed - remote head moved`, render `stop` and `show evidence` only) instead of the head-move re-sync; an unmoved head never re-syncs, and a `state` change to closed or merged renders `stop` and `show evidence` only. On a pushed head: a head or state change since assessment invalidates the current state - re-sync the worktree, re-enter step 3, and re-render the menu; a `mergeStateStatus` change alone (head unchanged) invalidates a `merge` or `merge anyway` pick and re-enters step 5 through `### Pre-menu refresh`; `reply`, `review`, and `approve` proceed, and the next menu renders from the refreshed value. Exception: a pick's own push updates the assessed head to the pushed SHA as part of that pick's execution - this self-inflicted head move does not invalidate the pick; the next compare-and-swap runs against the new head on the next external write. Before a merge executes (plain or `anyway`), run the full comment refetch and reconciliation (`### Re-render` steps 1-5), not just placeholder detection. If the head changed, re-enter step 3 instead. A new or changed-body delta since the consent render aborts the selected merge, plain or `anyway`: show the reconciled report and request a fresh pick even when no blocker resulted. A newly `pending` row, a queued/in-progress reviewer run, or a failed refetch (`comments not refreshed (<reason>)`) refuses a plain merge and re-renders; `anyway` overrides only those existing pending/refetch-failure overlays and prints what it overrode, never a new blocker or unreviewed delta.

### Fix wave

For a `fix` pick, take the drafted payloads (`findings.md` `## Drafted payloads`) for the named blockers - all open blockers by default, the nit payloads when no blocker is open; `fix nits` takes nit payloads only, `fix + nits` both. A finding closed by disposition is skipped. A finding whose payload touches no file (a failing check, a claim with no drafted edit) is reported as not fixable by this verb and stays open.

Apply per `fix-wave.md`: the local conflict check, one fresh implementer helper per payload with scoped tests only, the pre-push reviewer with its closure lines, the push, and the evidence poll. The orchestrator never edits a tracked file and never commits. When `head_pushable` is false, the wave's commits stay in the local `pr-<N>` worktree: report the branch name and re-enter step 5.

`approve workflow run` and `update branch` execute per `fix-wave.md` (`## Evidence after push`, `## Conflicts`). Execute `review`, `reply`, `approve`, `post coverage to ticket`, and `post coverage to PR` via `gh pr review`, `gh api`, `gh issue comment`, `gh pr comment`, or the resolved tracker tool, non-interactively, with the drafted payload - after the output done-check below.

### Merge course

`merge` executes as `gh pr merge --match-head-commit <assessed-sha>` with the resolved merge policy. Push and merge are never one pick.

After `gh pr merge` returns, read `gh pr view <N> --json state,mergeCommit`. `state: MERGED` -> render the `AC coverage` block once and re-render the menu under the `own merge` overlay (`decision-menu.md`); any other state (a merge queue) -> one `PR comments` line `The merge is queued, so coverage posts wait. (<state>)` and the menu `wait` (re-run the read) / `show evidence` / `stop`. The block, `<sha>` = `mergeCommit.oid`, one row per `scope.rows` entry in row order with its outcome (`covered`, `deferred per spec to <ref>`, `deviates per spec: <why>`, `venue: <env> - <observation>, checked after deploy`); with no rows (`source: pr`, or an empty `scope.rows`) the block has no row lines and `post coverage to ticket` is not offered. With `source: pr` the header line drops `, spec <path>`. An `in-scope` row whose observation half is `not judged here` renders `covered; observable half checked after merge`.

```markdown
## AC coverage
Informational - the ticket's rows are unchanged. PR <url>, merged <sha>, spec <path>
- [ ] <row 1 text verbatim> - covered
- [ ] <row 3 text verbatim> - deferred per spec to <ref>
- [ ] <row 2 text verbatim> - deviates per spec: <why>
- [ ] <row 4 text verbatim> - venue: <env> - <observation>, checked after deploy
```

A post is one write of that block, verbatim; a post that succeeded cannot be picked again in this run. `/skill:check-delivery` reads a posted block as any other comment, and the block's first line states that it amends nothing.

### Re-render

After every push or any mutation that can change readiness (fix wave pushed, PR head moved), re-sync the worktree. On an own push, after `fix-wave.md` `## Evidence after push`, run steps 1-5 below and render the menu from the pre-push reviewer's closure lines for the exact pushed SHA, where a blocker whose closure line reads `resolved` leaves the rendered list while its internal ID stays in the ledger and new findings continue each sequence; no claim re-check and no whole-wave review runs after an own push. On every other head move, re-enter step 3, then run steps 1-5 below - the last read before the menu renders:

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

The first read of step 5, before the report and the menu render from one state - the first pass included (a long local run or review can stale the gather), every `### Re-render` entry, the post-`wait` re-fetch, `update branch`, a `merge base` round, and a fix-wave push (`fix-wave.md` `## Evidence after push`). Run `gh pr view <N> --json headRefOid,state,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup` and `gh run list -R <owner>/<repo> -c <headRefOid> --json databaseId,status,conclusion,workflowName,url`. While the sync record is `rebased locally`, compare the fetched `headRefOid` against the record's `<pre_head>` and render from that alone: a move takes the lease-refusal path of `fix-wave.md` `## Evidence after push` (`git reset --hard <pre_head>`, assert `HEAD == <pre_head>` and a clean tree, record `sync: failed - remote head moved`, render `stop` and `show evidence` only); an unmoved head keeps `status_checks[]` and `actions_runs[]` as they are, skips the evidence re-resolve, and ignores `mergeable` and `mergeStateStatus` changes - `source: pending` holds until the lease push rewrites the record; a `state` change to closed or merged renders `stop` and `show evidence` only. On a pushed head: head moved -> the head-move rule (re-enter step 3). `state` or `mergeable` changed (head unchanged) -> route through `### Compare-and-swap` re-assessment. Head unchanged with `state` and `mergeable` unchanged -> replace `permissions.merge_state_status`, `pr.reviewDecision`, `status_checks[]`, and `actions_runs[]` in the digest together, re-normalize and re-classify every pending check (`../verification-brief.md` Section B, binding classification), and re-resolve the Evidence resolution table on the fresh set, so a check whose run completed since the last menu is never paired with its cached run status; when that re-resolve moves `source: pending` to CI-sufficient, dispatch the Section B helper in claim-check-only mode (`../verification-brief.md` Section B) before rendering. A `gh` failure keeps the prior values, classifies every pending check as binding (`../verification-brief.md` Section B, binding classification), and renders the `merge state` overlay (`decision-menu.md` `## Overlays`) through `## Withhold reason resolver` reason 2 (locator `merge state not refreshed (<reason>)`). The refresh is read-only and never mints `C#` rows - comment reconciliation stays in `### Re-render`.

### Wait course

For a `wait` pick, run a sequence of short bounded calls - never one long bash call. Each iteration: `gh run view -R <repo> <run-id> --json status,conclusion` for every tracked run (placeholder-linked and head-listed), and `gh pr view <N> -R <repo> --json statusCheckRollup,mergeStateStatus` while any pending check in the resolved set is binding when classified against the polled rollup and the polled `mergeStateStatus`, or the polled `mergeStateStatus` is `BLOCKED`, `UNKNOWN`, or `unreadable`; when any row has no parsable URL, or its run is completed while the prefix persists, one comment refetch as well; then sleep 30 s. Use each polling refetch to classify binding checks and compare the loop's stop condition against the polled values; leave the digest and `C#` ledger untouched until the completion/timeout reconciliation below - this preserves persisted digest state, not the loop's comparison values. Check the deadline between iterations: the resolved `timeout minutes` (default 15, the same knob as the local verification run). Stop when every tracked run is completed and no pending check is binding against the polled values and the polled `mergeStateStatus` is none of `BLOCKED`, `UNKNOWN`, `unreadable` and no row is in the "completed `success`, prefix persists" state, or the deadline passes.

Then run `### Pre-menu refresh` (it re-fetches `statusCheckRollup`, `headRefOid`, `state`, `mergeable`, `mergeStateStatus`). If the head advanced or state/mergeability changed, route through compare-and-swap re-assessment before reusing evidence or reviewing comments; otherwise re-resolve the brief's Evidence table on the fresh rollup; dispatch a fresh Section B helper for a local run only when the re-resolved table selects a local-run row (Fallback, Held run not approvable, or Opt-out - `../verification-brief.md` Evidence resolution) and no evidence exists yet for this head - otherwise the existing evidence stands. On completion or timeout, run steps 2-5 of `### Re-render` plus step 1's comment and reviewer-run reads - the pre-menu refresh already ran - and re-render; do not re-run claim-check or whole-diff review solely because the head did not move. On timeout: rows in the completed-`success`/prefix-persists state become `reviewer failed (stale placeholder)` (brief Section C placeholder table); every other `pending` row stays `pending`, merge stays withheld, `wait` renders as row 1 again.

### Output done-check

Before posting or committing any external payload - review bodies, replies, commit subjects, tracker comments - re-read it against SKILL.md `## Wording rules` and any `## comms style` rules: ASCII only; no headings or template scaffolding under ~150 words; findings `file:line`-specific where one exists; ends on the fix or asked action, not a recap; never invents content to fill a section. The `AC coverage` block is the one exception: it posts verbatim, heading and checkbox rows included.

### Teardown

| | Created worktree | Reused worktree |
|---|---|---|
| Own merge | tear down when the own-merge or merge-queued menu exits on `stop` or after the last post row leaves it | same |
| Non-merge stop | offer teardown, never autonomous; say when unpushed fix commits would be discarded | leave as found; say so explicitly when unpushed fix commits remain, and let the user choose leave-or-discard |

On a `rebased locally` head the `stop` reset (`decision-menu.md`) runs first; the Non-merge stop row then applies with no unpushed fix commits.

Drafted payloads that were never applied are dropped with the run; the worktree was never dirtied by them. Delete every helper output file minted this run and every `log_path` they name on every exit.
