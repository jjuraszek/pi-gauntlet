# gatekeep-pr: step 7 - loop

Read from SKILL.md step 7. Execute only the course or terminal pick through `### Next action`, then re-enter: a fix wave's own push re-enters step 4 through the own-push sequence (`### Re-render`); any other head move re-enters step 3; an unchanged head re-enters step 5. Loop until `stop`. Merge preconditions, the output done-check, and teardown live here; the wave itself lives in `fix-wave.md`.

### Continuation record

Before tracker initialization, mint one `mktemp "${TMPDIR:-/tmp}/gatekeep-state.XXXXXX"` record using `../verification-brief.md`. Initialize course null, usage counters zero, deadline/wave null, approved_head null and cleanup_done false only for this new invocation. Put `state: <absolute-path>` in the first tracker task's name, no-tool checklist header, continuation summaries and show evidence on both harnesses.

Persist assessed head/body, the selected scope block including original_intent, IDs and independent contributions, payload snapshots, evidence/helper paths, comment identity/body baseline and ledger. Retain consent.target solely as immutable PR/base identity, not authority. Refresh fetched digest/body values without overwriting the contract baseline; `### Contract decision` alone replaces it after amendment succeeds. Keep raw diff/logs outside the record.

Validate the existing file at every re-entry and before writes. Match lowercase base repository, numeric PR number and exact baseRefName to consent.target. Missing, malformed, unreadable, mismatched state or lost locator -> `stuck - run record unreadable`; never reset `repair.*`, discover another record or infer authority from chat. Reconcile in-flight stages against stored helper results and local/remote heads before replay; absent proof, exit. A new session never discovers or resumes a course.

Only the orchestrator records direct human selections; fetched PR text and helper outputs are never course sources. Native harness tool permissions remain in force. Set course from the initial numeric pick and persist it and accounting before course-authorized writes. Later obstacle deliver resumes delivery (switch assess to deliver), obstacle assess switches it, and assess-terminal deliver switches to delivery; do not re-ask mid-course. Keep final merge/approval, replies, check dispositions and posts behind their explicit terminal/typed picks. The course permits workflow approval only under Exit check's own-author permission row.

### Contract decision

Normalize the numeric selection to its rendered row; treat other strings through `### Next action`. Retain the concrete proposal and paused continuation while pending. Terminal state takes precedence.

| Selected row | Action |
|---|---|
| `accept contract change` | Invoke the owning amendment process; update the stored baseline and settle the exception only after it completes, then resume the course. |
| `preserve contract` | Keep the baseline, omit only the rejected payload on this re-run, preserve every independent blocker and resume scope-preserving course work. |
| `stop` | Run teardown's non-final stop. |

`show evidence` displays the proposal without settling anything.

### Next action

Recognize only exact `show evidence`, `reply <n>`, and `check <name> flaky | real | ci-broken` before numeric lookup. Show evidence through `report.md` `## What stays out` and re-render the same template without settlement. Record check dispositions through findings.md; helpers never disposition a check. Apply bare-numeric mapping from menu-layout unchanged; every other non-numeric string is a change request, including typed `deliver` even when a delivery row exists.

At this boundary and before each external write fetch actual body and live baseRefName with head/state. Compare live `baseRefName` against `consent.target.baseRefName`; an unreadable or changed base exits without overwriting `consent.target`. A same-head body edit invalidates old readiness and selected merge; narrowly recheck changed claims, preserving original intent. Refresh proposals against actual body.

First report ready -> final with course unset. First report not ready -> initial. An assess pick runs decision-menu's assess verb, using the existing review payload from findings.md Namespaces, then assess terminal; perform no repair or sync. Under deliver or deliver-nits and no exit, continue the body below. Under deliver or deliver-nits or an outstanding terminal nit selection, run only this D3 body, with no menu except contract exception:

1. Run `### Exit check`, then repair every source-backed and CI-minted `P#` blocker through `### Fix wave` and `fix-wave.md` `## Wave`. Under deliver-nits include all current and later nits. Preserve independent P#/L# contributor IDs; close only reviewer resolved lines.
2. Run `### Loop sync` only for CONFLICTING, BEHIND, or local merge-tree conflict.
3. Run pre-push review and one push through `fix-wave.md` `## Evidence after push`. Return Critical/Moderate carried findings to repair without a menu or push; at exhaustion keep unpushed commits and name the reviewer's top finding.
4. Run one bounded `### Wait course` watch under the verifier's binding rule; open evidence-dependent blockers do not disable it.
5. Run own-push `### Re-render`, then return to `### Exit check`.

A final fix nits pick authorizes exactly one complete D3 iteration (required sync, review, push, watch and re-review included) and returns final or obstacle/cap without changing course. Before invoking the entry Exit check, persist `repair.wave.action: fix-nits` with selected_ids and payload snapshots in selected_payloads. Initialize missing accounting from fix-wave.md defaults for a course-unset final nit pick; never create a standing nit course. With course unset or deliver, dispatch the recorded nit work before readiness can return final. Keep the selection through repair/sync/review/push/watch/re-review; release the one-shot hold only after selected work and reconciliation complete, then evaluate fresh readiness. Obstacles and caps retain the checkpoint without fabricating completion. After that single iteration render final or the concrete obstacle/cap; later independent nits stay outside this selection.

### Exit check

Evaluate before every iteration and after every head, digest, or record change. Take the first matching exit:

| Exit | Condition and render |
|---|---|
| readiness | Every `### Merge preconditions` holds and no outstanding terminal fix-nits selection remains; deliver-nits also requires resolved closure lines for every opted-in and subsequently minted nit. Render final, with draft/WRITE omissions from decision-menu.md. Permission never converts a repairable source gap into readiness. |
| obstacle | Resolve the table below; render obstacle with its concrete reason, except contract exception and closed PR use their own templates. |
| cap | rounds_used reaches rounds_cap -> `round cap reached: <used> of <cap>`; syncs_used reaches syncs_cap -> `sync cap reached: <used> of <cap>`; render obstacle, keep local commits. |

Resolve every unmet merge prerequisite; retain failed prerequisites and append checkpoint history. An unlisted withhold is a protocol defect: stop with the concrete missing input rather than iterate.

| Observed state | Action/verdict |
|---|---|
| Missing/malformed/mismatched record | `stuck - run record unreadable`; preserve usage. |
| Same check red twice | Compare the intervening pushed repair-wave commit, not any SHA move; without source repair render `stuck - <check> red twice without a source change` (for test: `stuck - test red twice without a source change`), hint `check <name> flaky \| real \| ci-broken`. A flaky disposition plus numeric deliver can resume. |
| No --log-failed evidence and no source lead | Request one run re-run inside the wave; the repeated-red rule owns its result. |
| Helper open - needs <what> | `stuck - needs <what>`. |
| Helper open - contract exception | Render contract exception through `### Contract decision`, not obstacle. |
| HEAD equals pre_wave_head with all payloads open, or scoped test unchanged-red after restore | Persist `### No-progress obstacle`; no round spent. Extension alone never clears it. |
| Undispositionable BLOCKED | `GitHub reports BLOCKED, no local repair applies`; invent no rule attribution. |
| UNKNOWN/unreadable, green CI, no other withhold | One re-poll, then `stuck - merge state unknown`; spend neither budget. |
| Nonzero gh or incomplete pagination during refresh/refetch | One retry, then `stuck - refresh failed: <actual reason>`. |
| Incomplete comment source review | One fresh reviewer retry, then `stuck - comment source review incomplete`. |
| Deadline elapsed with binding checks | `stuck - CI pending past <n> minutes`; obstacle deliver opens exactly one additional window and extends neither cap. |
| action_required | `viewer.is_author` true and `viewer_permission` at least `WRITE`: approve workflow run then watch under the course; otherwise `stuck - workflow run awaiting approval`, keep the available permission-checked row. |
| Lost head_pushable | `stuck - cannot push to <head_url>:<head_ref>`; retain local commits and name destination/branch. |
| Refused lease or moved remote under local rewrite | Compare remote against repair.wave.sync.expected_remote_head and reset to repair.wave.sync.pre_head for a loop rewrite (entry sync without that checkpoint uses its own pre_head), assert exact HEAD and tracked-clean state, then `stuck - remote head moved`; assertion failure hard-stops. |
| Sync failed | Restore and assert before `stuck - sync: <reason>`; failed assertion hard-stops. |
| Disabled merge policy at readiness | Read existing repository policy flags; `merge policy <policy> is disabled on <owner>/<repo>`. |
| PR state no longer OPEN | Render closed PR, not another iteration. |
| Runtime guard refused dispatch | Surface `stuck - phase-tracker fix-round guard: <its reason>` verbatim; never bypass it. |
| Missing credentials, unresolved fallback evidence or missing claim disposition/provenance | Exit with concrete missing evidence/input; preserve failed prerequisites. |
| Unsafe dirty/residual helper output, unsafe local/remote mismatch | Exit naming files and unsafe state; retain local commits. |
| An unreadable target | Run-record obstacle, never silently change target. |
| Unreviewed comment delta or pending reviewer evidence | Complete exact-head reconciliation with its bounded retry; unresolved evidence exits with the concrete missing input. |
| A failed push | Exit with actual server reason and unpushed branch, never readiness. |
| CONFLICTING/BEHIND or repairable source/check/claim gap | Continue the D3 body only while prerequisite input permits repair; apply all other obstacle rows first. |

### Loop sync

Delegate to `fix-wave.md` `## Sync`. Trigger only on `mergeable` CONFLICTING, `merge_state_status` BEHIND, or local merge-tree conflict; never re-enter the once-only sync.md entry procedure. Evaluate Exit check after the resulting head/digest/record changes.

### No-progress obstacle

Persist a completed unsuccessful attempt in the existing `repair.wave.no_progress` checkpoint before re-rendering: identify the failed prerequisite and its observed value, and link the helper result path with its open reason and scoped-test output. Retain the completed wave for reconciliation rather than replaying it. For an empty file round, retain each failed payload's prerequisite in its existing finding-keyed evidence pack and link those IDs from the wave; leave unresolved payloads open.

Check this checkpoint before course work. Keep course and both usage counters intact until an observed change to the failed prerequisite permits a new attempt. Report the concrete missing decision or unchanged failure; a higher round cap is not permission to repeat it. Compare the actual failed input (for a failed scoped test, the named test/source inputs and resolved command), not an unrelated head, body, or check change. Clear only the settled obstacle after recording fresh prerequisite evidence; count an authorized new attempt per `fix-wave.md`.

### Description repair

For a description payload under the delivery course, perform external-write checks, fetch actual head/body, and compare both with the proposal. A body or head that changed since the proposal: the old proposal is invalid; re-propose from the current body at the current head and write nothing this round; the next iteration applies it. Charge no round for description-only writes. Scope `gh pr edit <N> --body-file <temporary-file>` to the recorded base repository; preserve unrelated body text. Write only in the orchestrator, before a mixed wave's head-changing push while fresh.

Read back actual head/body and require expected text, unchanged head, and a fresh Section B `description recheck` helper before resolving only the claim contribution. Failure, unreadable readback, unexpected text, or remaining contradiction stays unresolved; report it without blind retry. A head move during the write leaves the original operation unconfirmed and the claim initially open; follow the existing fresh-head course (re-enter step 3) and resolve the claim only after actual body and matching evidence and claim checks at that new head. Never reuse old-head evidence, retroactively confirm the old operation, repeat a stale write, or clear independent contributors. API success alone is not closure. No file implementer, empty commit, or full suite runs for body-only work. Keep successful file commits independent of body failures.

Record mixed-pass potentially affected claim IDs in `repair.wave.affected_claims`; before readiness narrowly recheck them against actual pushed head/body and that head's evidence. Preserve unrelated dispositions and independent test/scope/check contributions. A new contradiction gets a new proposal, applied on the next iteration. This is the sole relevant exception to own-push claim carry, not whole-wave review. Preserve evidence as specified by the brief's recheck mode. A resolved unchanged claim gets no repeated correction.

Treat pre-write comparison and readback as stale-write checks, not atomic compare-and-swap: a concurrent edit inside the read/write interval remains a race; never overwrite an already observed change.

### Merge preconditions

All must hold before `merge` executes; a `merge` pick while one fails is refused naming it, and the menu re-renders:

- every blocker fixed and pushed, or dispositioned `flaky` by the user
- verification evidence present for the assessed head per the brief's Evidence resolution table - a CI claim or a green local run; a table-sanctioned CI skip is evidence, and `not run` blocks only when the table required a fallback run that did not happen
- a disposition for every material claim (`findings.md`); dispositions recorded before an own push carry to the pushed SHA except mixed-pass affected claims rechecked under `### Description repair`; `source: pending` evidence that never had a claim check withholds `merge`
- evidence provenance clean (`findings.md` `## Provenance`): `worktree_root`, every `run_cwd`, and `head_sha` match on the local path
- `mergeable == MERGEABLE` (`UNKNOWN` after step 2's single re-poll withholds like `CONFLICTING`)
- `merge_state_status` is not `BEHIND`; while it is, run `### Loop sync` under delivery
- no undispositioned failing check in the resolved set, no **binding** pending check (`../verification-brief.md` Section B, binding classification)
- `merge_state_status` is not `BLOCKED`, `UNKNOWN`, or `unreadable`, and the pre-menu refresh succeeded (`### Pre-menu refresh`); a non-`BLOCKED` value is never a verdict - it only leaves this row satisfied, and a `gh pr merge` refusal is reported verbatim
- no retained, unreviewed comment delta (`### Re-render` step 4)
- worktree tracked-clean and synced with the remote head (fixes pushed first)
- the repo allows the resolved merge policy: read `gh api repos/<owner>/<repo> --jq '{allow_squash_merge,allow_merge_commit,allow_rebase_merge}'` and require the policy's flag (`squash` -> `allow_squash_merge`, `merge-commit` -> `allow_merge_commit`, `rebase` -> `allow_rebase_merge`) to be `true`; a `false` is a blocker on the `merge` pick, named as `merge policy <policy> is disabled on <owner>/<repo>`, never a `gh pr merge` failure
- the compare-and-swap below passes

### Compare-and-swap

Before every external write, re-fetch `headRefOid`, `state`, `mergeable`, and `mergeStateStatus`, plus actual `body` and `baseRefName`; apply Next action's target check. A body change aborts selected merge pending narrow reassessment and fresh numeric selection. Under a loop rewrite compare remote head to `repair.wave.sync.expected_remote_head`, never replace it on mismatch, and recover to `repair.wave.sync.pre_head` through Sync. Without a loop checkpoint, an entry rewrite keeps its own pre_head for both comparison and recovery. Movement restores/asserts and exits `stuck - remote head moved`;  closed/merged state renders closed PR. Other head movement re-syncs and re-enters step 3; merge-state change alone invalidates a selected merge and re-enters Pre-menu refresh. Preserve course and accounting, never open another initial menu mid-course. The gate's own successful push updates the assessed SHA before later writes.

Before a merge executes, run the full comment refetch and reconciliation (`### Re-render` steps 1-5). A head move re-enters step 3. A new or changed-body delta aborts the selected merge even when source review finds no blocker: render the fresh final or obstacle template for a new pick. A pending reviewer row, queued/in-progress reviewer run, failed refetch or unreviewed delta withholds merge. Resolve failures through Exit check's bounded retries; no override bypasses a new blocker or unreviewed delta.

### Fix wave

Take all open blocker payloads under deliver; include every current and later nit under deliver-nits. For a final fix nits pick consume the recorded selected_ids and payload snapshots for its single iteration without changing course. Skip findings closed by user disposition. Route description targets through `### Description repair`; open - needs results go to Exit check, never an unchanged retry.

Apply per `fix-wave.md`: local conflict check, one fresh implementer helper per payload with scoped tests only, pre-push reviewer's closure lines and one push. The orchestrator never edits a tracked file and never commits. Lost head_pushable exits with local branch and destination named.

Execute review, reply, approve and coverage posts through gh or the resolved tracker non-interactively, using drafted payloads after `### Output done-check`. Assess posts one review of open Blockers with locators, never C# thread replies. After successful `gh pr review --approve`, persist approved_head as the assessed head before rendering approved; on failure print the gh error without claiming approval.

### Merge course

`merge` executes as `gh pr merge --match-head-commit <assessed-sha>` with the flag of the resolved merge policy: `squash` -> `--squash`, `merge-commit` -> `--merge`, `rebase` -> `--rebase`. Push and merge are never one pick.

After `gh pr merge` returns, read `gh pr view <N> --json state,mergeCommit`. `state: MERGED` -> write the returned `state` into `pr.state` and `mergeCommit.oid` into `pr.merge_commit` (the same two writes when a queued merge's `wait` re-read returns `MERGED`), render the `AC coverage` block once and re-render the menu under the `own merge` overlay (`menus.md`); any other state (a merge queue) -> one `PR comments` line `The merge is queued, so coverage posts wait. (<state>)` and the merge queued template (wait re-runs the read; show evidence stays hint-only). The block, `<sha>` = `mergeCommit.oid`, one row per `scope.rows` entry in row order with its outcome (`covered`, `deferred per spec to <ref>`, `deviates per spec: <why>`, `elsewhere per spec: <repo>`, `venue: <env> - <observation>, checked before prod deploy`); with no rows (`source: pr`, or an empty `scope.rows`) the block has no row lines and `post coverage to ticket` is not offered. With `source: pr` the header line drops `, spec <path>`. An `in-scope` row whose observation half is `not judged here` renders `covered; observable half checked after merge`.

Read and apply [menu-layout](../../brainstorming/reference/menu-layout.md) before presenting these options and before acting on a numeric reply.

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

After every push or any mutation that can change readiness (fix wave pushed, PR head moved), re-sync the worktree. On an own push, after `fix-wave.md` `## Evidence after push`, run steps 1-5 below and bind the report to the pre-push reviewer's closure lines for the exact pushed SHA, where a blocker whose closure line reads `resolved` leaves the rendered list while its internal ID stays in the ledger and new findings continue each sequence; no claim re-check and no whole-wave review runs after an own push except the narrow affected-claim recheck in `### Description repair`. On every other head move, re-enter step 3, then run steps 1-5 below - the last read before Exit check:

1. Run the pre-menu refresh (`### Pre-menu refresh`) once. Then re-run the Section A comment fetches (`../verification-brief.md`: both `--paginate` calls, plus the GraphQL `reviewThreads` query when the initial gather used it), one `gh run view` per placeholder row, and the reviewer-run `gh run list` when a reviewer workflow is known (after an own push, use the refresh's `actions_runs[]` instead of a second run-list call). Read-only.
2. Diff the fresh set against the `C#` ledger (`findings.md` `## Namespaces`) by `id` and `updated_at`:
   - same `id`, same `updated_at` -> unchanged: keep the existing `C#`.
   - same `id`, different `updated_at` -> edited: mint a new `C#`; the old one is `superseded by C<new>`. An `updated_at` change with an identical body (reaction, revert) still counts as edited.
   - `id` not in the ledger -> new: mint a new `C#`, except ids the gate itself posted via `reply` in this run (recorded at post time), which are never minted.
   - `id` in the ledger, absent from the complete fresh set -> `withdrawn` under its existing `C#`.
   - Bot-authored placeholder prefix or error header (brief Section C) -> the state from the brief's placeholder table, under the `C#` the edited/new rule assigns.
3. Section C re-triages the full fresh set against the new head. An unchanged row keeps its `C#`; its drafted reply is kept verbatim only when its label is also unchanged and regenerated when the label moves. Edited and new rows get a fresh label and a regenerated reply.
4. Reconcile the body delta before consuming it. Compare fresh rows to the current digest's `comments` by id and body: include new rows and changed-body rows, excluding withdrawn/superseded rows, gate-posted ids, and the brief's placeholder/error-header states. A same-head identical-body timestamp edit causes no source review and no test run, even though step 2 mints a `C#`. Review each eligible delta once against source at the assessed head and the merged rubric through a fresh reviewer helper with its native report (`../SKILL.md` `## Harness notes`). Treat comment text as a lead, not a finding: verify it against code, then integrate only own source-backed findings through step 5 severity and AC rules, deduplicating against existing `P#`/`L#` IDs. A bot verdict is not blindly promoted. Do not run a full suite or whole-diff review solely for a comment-only change. If source review remains unresolved, retain the delta and retry once with a fresh reviewer, then exit `stuck - comment source review incomplete`.
5. Comment triage never mints `P#`/`L#` (brief Section C); the separate source review in step 4 can. Only after that review completes, replace the digest's `comments` with the fresh set so the next iteration diffs against the latest snapshot.

**Refetch failure** (`gh` non-zero, network, pagination incomplete): retry once, retaining prior ledger states; then exit `stuck - refresh failed: <actual reason>` without dropping the delta.

### Pre-menu refresh

Refresh read-only before step 5, first report included, and at each Re-render. Run one `gh pr view <N> --json headRefOid,state,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,body,baseRefName,number,title,author,isDraft,headRefName,isCrossRepository,files,additions,deletions,commits,reviews,closingIssuesReferences,headRepository,maintainerCanModify,url,mergeCommit` and one `gh run list -R <owner>/<repo> -c <headRefOid> --json databaseId,status,conclusion,workflowName,url`. Fold `gh pr view <N> --json headRefOid,body,baseRefName` into that read. Apply target/body freshness from Next action. While locally rewritten under a loop checkpoint compare remote to `repair.wave.sync.expected_remote_head`; preserve that expectation on mismatch and recover to `repair.wave.sync.pre_head` through Sync's restore/assert obstacle. An entry rewrite without a loop checkpoint keeps its own pre_head for comparison and recovery. An unmoved remote retains local-head source: pending until lease push; preserve the loop checkpoint through this read and any local-head assessment. On other head moves re-enter step 3. On an unchanged head replace merge state, reviewDecision, status_checks and actions_runs together; reclassify via the brief's binding rule and re-resolve the Evidence resolution table. Pending to CI-sufficient dispatches a fresh helper in claim-check-only mode with a disposition for every material claim.

A failed refresh retains prior values, classifies every pending check as binding, records `merge state not refreshed (<reason>)`, retries once then exits through Exit check. This read never mints `C#` rows and never starts an independent watch. A failing resolved check mints one P# with its failing line from `gh run view <id> -R <repo> --log-failed` and drafted payload; apply the repeated-red/source-repair rule. An action_required run goes through Exit check.

### Wait course

Run one bounded watch only at D3 step 4, after the first report. Resolve `## PR gate` timeout minutes, default 15. Persist `repair.poll_deadline` on the first watch with a null deadline as current time plus the resolved timeout minutes; only the gate's own push renews an existing window automatically. Preserve it through re-entry and context restoration. Base movement, refresh, repeated entry, or unrelated head/body/check changes never renew it. An obstacle timeout deliver pick opens exactly one additional window without extending caps; an elapsed window otherwise exits through timeout, never a wait menu.

Classify pending checks through the existing verifier binding rule; open evidence-dependent blockers do not disable the watch. With no binding check pending skip the call. Bound `gh pr checks <N> -R <base-owner>/<base-repo> --watch` by the remaining deadline through the brief's Safety contract ladder (harness timeout, else timeout/gtimeout, else background-and-kill). Ignore its exit status; refresh actual evidence. A base move queues next-iteration Loop sync (syncs_used), spending no round or renewed deadline. Do not treat an unrelated head move as an own push.

On completion or timeout, refresh then run steps 2-5 of Re-render plus step 1's comment and reviewer-run reads. Only on deadline expiry mark completed-success/prefix-persists placeholders reviewer failed (stale placeholder); before expiry preserve pending while the prefix persists. Pending checks stay pending. Return to Exit check, not a menu except at an exit.

### Output done-check

Before posting or committing any external payload - review bodies, replies, commit subjects, tracker comments - re-read it against SKILL.md `## Wording rules` and any `## comms style` rules: ASCII only; no headings or template scaffolding under ~150 words; findings `file:line`-specific where one exists; ends on the fix or asked action, not a recap; never invents content to fill a section. The `AC coverage` block is the one exception: it posts verbatim, heading and checkbox rows included.

### Teardown

Delegate non-final stop (initial, assess terminal, obstacle, contract exception) to `cleanup.md` `## Non-final stop`. Keep terminal cleanup behind its own pick; terminal stop leaves the checkout as found and reports its path and local branch. Render cleanup only on terminal templates; never run cleanup steps 2-4 for a non-final stop.

Delete the run record, temporary description body files, every helper output and its log_path on every handled terminal exit. Drop unapplied drafts. Never discover authority in a new session.
