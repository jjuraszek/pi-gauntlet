# gatekeep-pr: persistent repair consent and description corrections

> **Superseded by:** [doc/specs/2026-10-13-gatekeep-pr-speed-and-fixability.md](./2026-10-13-gatekeep-pr-speed-and-fixability.md) - D5/D6 per-proposal exact-text selection and renewed selection on snapshot change, and the `### Wait course` 30 s poll loop only
> **Superseded by:** [doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md](./2026-10-25-gatekeep-pr-persistent-disposition.md) - the retained-consent grant model (`consent.fix`, `consent.merge_base`, revoke grammar, grant-covered Next-action rows)

**Goal:** Keep authorized blocker fixes and base-conflict resolutions moving through one gatekeep-pr run until a freshly assessed merge-ready menu, and repair false PR-description claims through the same fix course without changing scope or inventing verification status.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Issue:** [#62](https://github.com/jjuraszek/pi-gauntlet/issues/62)
**Baseline:** `c10ba7c5eaf867280a2b21d70d612c2579ecafcf` (7.8.0)

Supersedes `doc/specs/2026-10-08-gatekeep-blocker-only-fix-loop.md`, D1's fix-availability predicate for description targets, D2's file-level blocker-payload restriction (also implemented by `reference/post-selection-loop.md` `### Fix wave`), and D4's unchanged-round-accounting assumption only. Preserve D1's blocker/nit selection policy, D2's lazy nit drafting, D3's scoped tests, and D4's carried-set review.

Supersedes `doc/specs/2026-10-02-gh-57-gatekeep-pr-production-gate.md`, D3/D5 repair-round accounting and repeat conflict-menu selection, and the corresponding Phase 4 conflict-menu behavior. Its D8 tracker-only split rule is already superseded elsewhere and is not changed here.

## Problem

A busy base can advance after the gate has resolved conflicts and pushed. The next conflict check asks for the same `merge base` selection again. Post-push review can identify another source-backed blocker and require another `fix` selection. A description-only blocker is worse: `fix` is offered, but the file-only payload path reports that it cannot fix the description.

These failures were observed in local session records and checked against the owning source. Only the anonymized failure sequences inform this spec and its evals; no consumer identity, transcript, or private reference is retained. Recorded tool results establish conflict/head transitions and the description dead end, not every historical explanation about forge conflict detection or the total number of merges.

The existing pre-push loop already repairs its carried set automatically: open closures, new in-delta Critical/Moderate findings, and new outside-delta Critical findings. The gap is continuity across conflict checks and later assessments, not a missing inner repair loop (`skills/gatekeep-pr/reference/fix-wave.md`, `## Review before push`). The blocker-only change deliberately excludes unsolicited nits. The scope contract is the assessed spec, or the PR's original stated intent without a spec; editing the description cannot make an unmet obligation disappear (`reference/assessment.md`, `## Select the scope contract`).

Framing: pivoted to bounded action-specific repair grants. The human chose separate `fix` and `merge base` grants rather than replaying whichever row is recommended. Recommendation changes reflect authorship and readiness, not authorization. Conflict resolution can require a scope exception, so a familiar action label is not permission for every possible resolution.

The approved architecture uses one file-backed consent block on both pi and Claude Code. File retention survives conversation compaction within the same run; it is not a hard tool-call enforcement mechanism or permission for a later independent run.

## Acceptance criteria

Ticket #62, `Acceptance Criteria`, rows verbatim:

- [ ] Given a contradicted factual description claim that can be corrected without narrowing the agreed scope, the gate offers an exact description correction through the existing fix consent. Unrelated description text is preserved; declining the correction writes nothing.
  in-scope
- [ ] After an approved correction succeeds, the gate reads and rechecks the actual updated description. Only the resolved claim finding clears. A failed update, unreadable result, or remaining contradiction keeps that finding unresolved; the gate never reports an unconfirmed write as successful.
  in-scope
- [ ] Given a description or assessed head that changed since the proposal, the gate refreshes and presents the changed proposal for consent instead of overwriting concurrent work or applying a stale correction.
  in-scope
- [ ] Given an unsupported assertion of completed verification, the report states what the gate cannot verify as non-blocking uncertainty. A proposed clarification distinguishes the author's assertion from the gate's evidence; it does not declare the work undone or create a future commitment. Pending-observation wording is offered only when that pending work is explicitly recorded in the assessed PR description, approved spec, or linked ticket, or explicitly requested by the human. Conflicting source statements remain uncertain rather than choosing the convenient one. Supplied evidence is assessed rather than silently discarded.
  in-scope
- [ ] A description correction never clears an independent missing-test, failing-check, acceptance-gap, or scope-creep finding. When the PR body supplies the scope contract because no spec applies, removing or rewording a claim cannot erase the original scope obligation merely to make the gate pass.
  in-scope
- [ ] Matched claims, qualitative prose, and explicitly pending observations receive no correction merely for style. Rechecking a resolved correction creates no repeated proposal for that same claim.
  in-scope
- [ ] Synthetic gate evaluations cover a false claim with otherwise acceptable code, a false claim plus a missing test, an attempted scope reduction with and without a spec, unverifiable completion without an authorized future commitment, explicitly pending work, an evidence-backed claim, a concurrent body/head change, and a failed write. They simulate forge reads and writes, assert the outcomes above, and perform no live mutation. The evaluation and package checks pass, and user documentation names description corrections as a fix target.
  in-scope

## Design

### D1 - Action-scoped consent, not menu automation

The first selection grants the consequence stated by that row. State the lifetime in the `fix` and `merge base` consequence clauses: continue covered repairs during this run until readiness or a new decision boundary. Normalize numeric menu selections to the actual verb and stable finding IDs before recording them; never store a changing row number as authorization.

| Selection | Retained authority |
|---|---|
| Bare `fix` | Current and later source-verified blockers within the agreed scope, including code and documentation fixes. Every new description payload requires D5's exact-text selection, even with this grant; D6 also requires fresh selection after any proposal head/body snapshot change. |
| `fix` naming findings | Those stable `P#`/`L#` IDs, not whichever findings later occupy the same display numbers. The existing pre-push carried-set safety review still applies. |
| `merge base` | Merge the recorded PR base branch and resolve conflicts through the existing fresh-helper and review course. Include the reviewed push when the existing push preconditions hold. |
| `fix + nits` | The blocker grant above plus the nit payloads selected for this pick only. |
| `fix nits` | One-shot nit work, without a blocker or merge-base grant. |

The grants are independent. `fix` never implies `merge base`; a granted conflict resolution never implies general blocker repair. A broad fix grant cannot disposition a failing check as flaky, approve a held workflow, rewrite a scope contract, post a review/reply, or merge/approve the PR. Native harness tool permissions remain in force.

Retain valid grants across pushes, base advances, reassessments, comment review, and ordinary polling. A different recommendation, `show evidence`, or an intervening separately authorized action does not revoke them. Add the compose forms `revoke fix` and `revoke merge base`; persist the named revocation before another mutation, leaving the other grant alone. `stop`, terminal PR state, or an invalid target ends the run's repair authority. Never carry a grant into a new invocation or another PR.

A contract exception pauses repair and presents the concrete change with three choices: accept the named change through the contract's owning amendment process, preserve the existing contract and repair the implementation, or stop. Record the selected disposition and update the stored scope baseline only after the authorized contract decision is settled. This is not permission to edit a ticket/spec through the description-correction path and does not grant an unselected repair action.

### D2 - One portable run record

Use the OS temporary directory, with a unique path from `mktemp "${TMPDIR:-/tmp}/gatekeep-state.XXXXXX"`. Store the run digest's continuation subset as JSON in that file, outside the checkout. The record is never committed and is not stored under a harness-specific directory. One active run has one authoritative record; no second consent ledger, settings key, extension, hook, or CLI is added.

Resolve the base repository with `gh repo view <base-repository> --json nameWithOwner` in the PR's resolved repository context and add `base_repository` to the Section A digest. Normalize owner/repository to lowercase; match it, the numeric PR number, and the exact case-sensitive `baseRefName`. `headRepository` can be a fork and is not the base identity. An unreadable base identity establishes no grant.

Add the following named fields to the existing digest schema; these serialize the existing run concepts rather than adding a second workflow:

| Field | Value |
|---|---|
| `consent.target` | `{ base_repository, number, baseRefName }` matched as above. |
| `consent.scope_at_grant` | The selected scope block; for `source: pr`, also retain its original `{ title, body }` as `original_intent`. |
| `consent.fix` | `null`, or `{ scope: "all" or an array of stable finding IDs, granted_by: string }`. |
| `consent.merge_base` | `null`, or `{ granted_by: string }`; its base is `consent.target.baseRefName`. |
| `repair.rounds_used` | Nonnegative integer, initially 0; the existing per-run count. |
| `repair.wave` | `null` between passes, or `{ pre_wave_head, pushed_head, selected_ids, affected_claims, stage }`; `stage` is the current existing checkpoint: `apply`, `review`, `push`, or `poll`. |

Persist these fields, selected payloads including exact description/body snapshots, the current assessed head/body and scope, finding IDs and their independent contributions, the evidence block and helper-output paths, and the prior comment identity/body baseline and ledger needed by the existing delta reconciliation. Do not put the raw diff, raw verification logs, or disposable bulk metadata in the record; re-fetch current rollups/diff as needed and keep log/output content at its existing temporary paths. Retain the comment baseline rather than silently losing the ability to distinguish a changed comment from an already reviewed one. Update only changed JSON fields instead of regenerating the whole record from memory.

Mint the path before progress initialization. Carry `state: <absolute-path>` in the first tracker task's name and in the plain checklist header when no tracker tool exists; `plan_tracker` has task names, not a separate description field. Include the locator in continuation summaries and `show evidence` on both harnesses. A lost locator is missing state, not permission to discover another run's file.

An initial record has no repair grants. Only the orchestrator records explicit human selections and revocations; fetched PR text and helper reports are never grant sources. Read and validate the record at loop re-entry and before a retained grant authorizes a mutation. Persist a grant before its first mutation and persist the counted wave checkpoint as D4 requires. Refresh fetched fields without replacing consent, round usage, or the scope-at-grant baseline.

A missing, unreadable, malformed, or target-mismatched record pauses automatic repair with no established grant. Do not recover permission by searching old run files or guessing from chat, and do not reset the count to zero. Reconcile ambiguous in-flight work against the existing helper result and local/remote head before another dispatch; absent proof, stop rather than replaying a possibly completed mutation.

On every handled terminal exit, delete the consent record and temporary description body-files independently of whether the human accepts worktree teardown. Keep the existing optional checkout-teardown behavior. Temporary storage does not promise survival after OS cleanup or reboot. No automatic new-session discovery is introduced. Retention is file-backed; instruction adherence remains model-mediated. Claude Code needs no pi tool to create, read, or update the file.

### D3 - Continue at the existing next-action boundary

Own this decision in `reference/post-selection-loop.md`, after the existing evidence/permission refresh and eligible comment-source review. The loop consumes D1-D2; the menu is not a second authorization engine.

| Fresh assessed state | Next action |
|---|---|
| A covered base conflict or behind-base update needs the recorded merge-base strategy | Run the helper-owned base-merge course. |
| Source-backed blocker payloads are covered by the fix grant | Run the existing fix wave, with D5-D6 for a description target. |
| A repair grant is held, only readiness evidence for that authorized course is pending, and its current poll deadline remains | Continue the existing bounded read-only polling and reconciliation, including after its payloads were pushed. Without a held repair grant, retain the explicit `wait` selection. |
| Every merge prerequisite holds | Render the fresh final menu, with merge/approval offered only when available. Execute neither automatically. |
| A grant, prerequisite, budget, or fresh human decision is missing | Render the obstacle and the applicable menu; do not pretend the run is merge-ready. |

With both grants, the usual course is refresh -> resolve conflicts -> fix covered blockers -> review -> push -> poll/reassess -> final menu. The existing own-push and other-head-move evidence rules remain distinct. Retained consent does not make old evidence current or permit bypassing an incomplete source review.

At next-action and pre-merge freshness boundaries, fetch the actual body along with the existing head/state fields. Compare it with the assessed body snapshot. A same-head body edit invalidates readiness based on the old description: narrowly recheck its changed material claims under D6 and preserve the original scope baseline. A changed exact correction proposal needs fresh consent.

A merge pick still performs the existing head/state/comment checks; a body change also aborts that pick pending reassessment and a fresh final selection. Changed comments or head invalidate merge consent as today. If readiness is lost while the same run is open, covered repairs may resume, but the resulting final merge/approval selection is fresh. The record survives the first ready-menu render until terminal exit or revocation.

Routine polling uses the existing `timeout minutes` and deadline. A deadline expiry, failed refresh, missing input, unchanged unsuccessful attempt, or permission failure is an obstacle, not a reason to renew indefinitely. Preserve still-valid grants while the human resolves that obstacle; ask only for the missing decision, not for grants already held.

### D4 - Conflict-only work and bounded passes

Add `merge base` to the main verbs, availability, and applicable consent rows when an assessed open PR has `mergeable: CONFLICTING` or `mergeStateStatus: BEHIND`, even if no code blocker remains. It requires a pushable head, helper facility, remaining repair budget, and no existing terminal/sync stop. A `rebased locally` head keeps the existing lease-push prerequisites, never a plain push. Reuse the current conflict row and course; do not mint a fake code blocker or require an empty `fix` selection to reach it.

Keep `update branch` separate with its current permission and no-unpushed-commits preconditions. With no held strategy, prefer the existing `update branch` option when available and expose `merge base` as the alternative; otherwise recommend `merge base` when it is the available base-repair action. Higher existing safety overlays still own their recommendation. A held merge-base strategy is not silently replaced by `update branch` or invocation-time `--rebase`.

For every covered base merge, fetch the actual `baseRefName`, pass the selected scope baseline to a fresh implementer, and review the resolution before push using the existing remerge-diff evidence and closure rules. Require the helper to return `open - contract exception: <why>` without committing when resolution would drop or change an obligation or mechanism named by the agreed intent, an in-scope AC, or Design clause. It restores only its own edits and preserves earlier wave commits; unsafe residue stops under the existing rule. Resolve D1's explicit contract decision before dispatching again. Ordinary behavior-preserving resolutions remain covered. The orchestrator never resolves conflicts, edits tracked files, or commits. Other helper failures, rejected pushes, and blocked reviews retain the existing fail-closed behavior.

Keep `closureReview.maxFixRounds` as the single cap, with the current pi resolver and Claude Code fallback of 3. A counted pass is one newly started repair attempt and its review/recheck: file, description-only, or conflict-only. Combining the first base merge and selected file payloads in one pass spends one round, not two. A newly required base-resolution pass after the current pass was reviewed spends another round, including before the first push; it is not an unlimited free pre-push retry. Review-driven carried-set retries spend a round as today.

Persist one increment and `repair.wave` before the first description write or helper dispatch, whichever comes first. Body, file, and initial base-merge work selected for that pass share the increment. Resuming a pass paused before its pending action, restoring context, refreshing evidence, or polling does not increment again or reset usage; retrying a completed unsuccessful pass starts a new counted pass. At the cap, stop automatic repair and surface the exhausted budget. A retained grant is not a budget increase. Cap 0 also disables conflict-only and description-only repair. Keep one push per counted pass and the existing reviewed-range rule for previously unpushed commits.

### D5 - Description targets and truthful uncertainty

Extend the existing finding-keyed drafted payload with a target discriminant: checkout file or PR description. A description payload carries its finding ID, assessed head, original body snapshot, exact old-to-new text, and source evidence. Preserve unrelated body text. Store it in the same run record; do not create a parallel issue/finding namespace.

For a contradicted factual claim that can be corrected without narrowing scope, make the exact description correction an available `fix` target. Show its compact old-to-new text in the fix consent consequence; keep the full replacement body under `show evidence`. Narrowly exempt this consent preview from the report's blanket drafted-payload red flag. Declining it writes nothing. Every new description payload requires exact-text selection, including a first proposal discovered while a broad fix grant is held (ticket AC1). Any change to the proposal's body or head snapshot requires renewed selection (AC3), not merely a change judged material.

Apply the emitted claim-disposition tokens to actual evidence:

| Disposition | Treatment |
|---|---|
| `contradicted` | Blocker with an exact correction when scope-neutral; otherwise retain the independent missing mechanism/scope obligation and request the real decision. |
| `unverifiable-pre-merge` | Visible non-blocking uncertainty naming what the gate cannot verify. No automatic rewrite to undone work or a future promise. |
| `matched` | No correction. Assess supplied evidence rather than discarding it. |

Qualitative prose and explicitly pending observations receive no style-only correction. Add one concise optional `Description:` uncertainty line immediately after `Blockers` and before `Sync` in the report order; omit absent sections as today. Detailed evidence stays under `show evidence`. Uncertainty alone preserves a mergeable verdict and does not become a nit to force repair.

Recognize an explicit human request such as "clarify what verification the description has evidence for" as a request to draft that factual clarification. Its drafted payload enables the existing `fix` row, including in a mergeable consent row, with the exact description-edit consequence and selection above. A clarification-only fix authorizes that payload, not a general all-blockers grant. Do not auto-draft or auto-select it under a retained grant, and do not change an uncertain claim into a blocker to make the row available.

A clarification distinguishes the author's assertion from the gate's evidence. Pending-work wording requires an explicit record in the assessed description, approved spec, linked ticket, or the human request. Conflicting records remain uncertain. Explicitly pending or matched text is not rewritten just because another phrasing is possible.

Keep every contributing rule ID when a rendered blocker combines a claim, an acceptance gap, and a missing test. Resolving the description contribution cannot resolve the others. With `source: pr`, preserve the original intent in D2 and judge the missing obligation against it after body updates; neither removing a sentence nor reselecting scope from the shortened body clears it. A genuine scope change follows a separate explicit human decision, not the correction course.

### D6 - Body write, readback, and narrow recheck

The orchestrator owns the description mutation, as it already owns external writes. File payloads remain fresh-helper work. Description-only work does not dispatch a file implementer, create an empty git commit, depend on HEAD moving, or trigger a full verification suite.

Before the description write, perform the existing external-write checks and fetch the actual body as well. Compare both head and body with the proposal. Either changed -> do not write; refresh evidence and the exact proposal, then request fresh consent, including when the gate's own file push moved the head. A known head/body mismatch cannot be overridden by the retained blocker grant.

Write the approved body using `gh pr edit <N> --body-file <temporary-file>`, scoped to the recorded repository. This is an additional temporary payload artifact, not another authority record; delete it on terminal exit independently of worktree teardown. Then fetch the actual updated body and head and require successful readback plus the narrow helper recheck below before resolving the claim contribution.

Define `description recheck` as a narrow Section B helper task on both harnesses. Inputs: the actual body, assessed head, affected claims/finding IDs, and the existing evidence block. Output: only the affected `{ claim, disposition, evidence }` entries and the existing `<finding id>: resolved` or `<finding id>: open - <why>` closure lines for supplied claim findings. No replacement evidence block is emitted. The orchestrator integrates those claim contributions while preserving the input `source: ci`, `source: local` (including its `log_path`), or `source: pending` unchanged. The helper runs neither tests nor the evidence resolver; a narrow claim result cannot convert pending evidence into sufficient evidence. Route this mode through `verification-brief.md` and the two harness task forms in `SKILL.md`, rather than reusing the CI-emitting `claim check only` output contract unchanged.

A failed update, unreadable readback, unexpected body result, or remaining contradiction keeps the claim unresolved. A head move during the operation leaves the original write unconfirmed and the claim open at that boundary; the existing head-move course may then freshly assess the actual body and evidence at the new head. Resolve the claim only from that fresh matching assessment, never by reusing old-head evidence or retroactively confirming the original write. Report the concrete failure; do not retry the same write blindly. A successful API exit alone is not confirmation. A resolved claim stays resolved on unchanged rechecks and generates no repeated correction; a genuinely new contradiction is assessed normally.

In mixed file/body work, process an approved body payload before a head-changing file push when its proposal is still fresh. Track the two results independently: a successful file push does not imply a successful description edit, and a failed description edit does not undo valid file commits. Record claim IDs potentially affected by the mixed pass in `repair.wave.affected_claims`; before final readiness, narrowly recheck those claims against the resulting pushed head, actual body, and that head's evidence. This is the narrow exception to carrying claim dispositions unchanged across an own push: adding a missing test can make the just-written "this path has no test" sentence false. Preserve unrelated dispositions. Any resulting new exact correction requires selection; do not auto-rewrite it or rerun a whole diff/suite solely for the body change.

The CLI's documented edit interface has no conditional-body write primitive. The pre-write comparison and post-write readback are application-level stale-write checks, not atomic compare-and-swap. A concurrent edit inside the read/write interval remains a limitation; do not claim transactional protection or overwrite a change already observed.

### D7 - Minimal implementation surface and portability

Change the owning sentences and bounded tables in the existing gatekeep-pr skill and references. Keep one owner for each rule: digest schema in `verification-brief.md`; scope selection in `reference/assessment.md`; grants, continuation, body-write/recheck and teardown in `reference/post-selection-loop.md`; visible consent/availability in `reference/decision-menu.md`; payload/claim classification in `reference/findings.md`; counted conflict/fix passes in `reference/fix-wave.md`; uncertainty/consent evidence in `reference/report.md`. `SKILL.md` routes to those owners and replaces the contradictory per-mutation-pick wording with the retained-grant rule.

Use `/skill:forge-skill` for every instruction edit: imperative voice, observable predicates, minimal owning-rule changes, compact tables, and no duplicate policy. All current touched skill files are below 500 lines; keep them below that limit, or extract only the concern required by the authoring rule. Do not add a reference file merely to restate the existing loop.

The Claude Code marketplace already includes `gatekeep-pr`; no new plugin entry is required. Both harnesses follow the same file/consent protocol, with their existing native helper dispatch, round-cap resolution, and tracker fallback. Do not change personas, install hooks, or claim that file-backed protocol adherence is hard runtime enforcement.

## Errors and edge cases

| Case | Required outcome |
|---|---|
| Only one repair action has been granted | Continue only that action; the other requires its own selection. |
| New blocker after a code push | Source-review it first; broad fix consent covers an in-scope blocker, named consent does not expand. |
| Only conflicts remain | The merge-base course is reachable without manufacturing a file blocker. |
| Scope/base/PR identity changes | Pause retained authority and require the new decision; never reuse another target's record. |
| Record is lost or malformed | No automatic repair, no guessed grant, no budget reset. |
| Helper failed without making progress, left residue, or returned asynchronously | Preserve the existing stop behavior; do not launch duplicate work. |
| Review or CI remains pending | Poll within the current deadline; no evidence-less merge or automatic workflow approval. |
| Failing check lacks a disposition | Do not infer `flaky`, `real`, or `ci-broken` from `fix` consent. |
| Nits remain after blockers close | They do not keep automatic repair running; final readiness ignores optional nit work. |
| New head/comment invalidates a final merge pick | Reassess; any eventual merge requires a fresh selection. |
| Description update resolves only one contributor to a combined finding | Keep every independently open test/check/scope contributor. |
| Rebased-locally sync record or lease refusal | Preserve the existing sync restrictions and reset/stop course; grants do not rerun step 2b or expand lease permission. |

## Tests

Use `eval/gatekeep-pr`, not a new eval harness. Extend `target.json`'s assembled source set with the existing `verification-brief.md` and `reference/assessment.md` so both baseline and candidate see the claim/scope contracts. Keep the existing replay's `## Entry` mechanism: each case supplies observed states and human selections, then names the next actual menu boundary. No case tells the model the desired answer in place of the changed skill. Preserve the current word cap unless a correct bounded answer demonstrably cannot fit.

All scenarios are synthetic, with neutral projects and simulated forge results; no real PR, consumer transcript, private name, credential, or home-directory path enters an artifact. The replays narrate writes and helper calls; they do not mutate a live forge or establish native Claude Code runtime enforcement. A before/after comparison uses identical cases, facts, replay instructions, and source-file selection on both arms.

| Sample | Must-hold facts |
|---|---|
| `continued-conflict-fix-loop` | Both actions were selected. A second pre-push base advance and a later post-push verified blocker receive reviewed repairs without repeated picks; pending reviewer/CI work is polled within deadline; no unsolicited nits, stale evidence, unreviewed push, or automatic final merge/approval. Finish at a genuinely ready menu. |
| `fix-only-conflict-stop` | A fix grant does not authorize merge-base resolution; offer the missing decision, and preserve the fix grant. |
| `named-fix-new-blocker` | Renumbered display rows do not expand stable-ID consent; unrelated post-push blockers and nits are not dispatched. |
| `cc-consent-recovery` | With no pi tools and no prior conversational selection, the saved same-run snapshot and checklist locator restore the selected grants, finding contributions, and remaining budget. Resume through the native Claude Code-shaped helper course to the correct menu; loss of the locator gives no authority. |
| `consent-record-missing` | Missing or unreadable state gives no authority; no search of old records and no reset to a fresh budget. |
| `consent-record-mismatch` | A foreign-PR or malformed record cannot authorize writes. Each supplied negative checkpoint is judged separately. |
| `consent-revoked` | An explicit revocation persists and prevents automatic reuse; another still-valid grant is not silently cleared. |
| `consent-budget-stop`, `consent-zero-budget-description`, `consent-mixed-pass-count`, `consent-no-progress-stop`, `consent-poll-timeout`, `consent-wait-needs-grant` | Use separate single-menu samples for these six independent checkpoints, retaining the 2000-word cap. Respectively: exhausted usage survives head refresh/recovery with no further repair helper/push (read-only reassessment remains permitted); cap 0 prevents an exactly selected description write; one mixed pass increments once before its first mutation; an explicitly recorded open blocker and unchanged failed scoped-test attempt yield the no-progress obstacle; a recorded expired poll deadline yields an obstacle without renewal; pending evidence with no grant requires an explicit wait decision. Supply internally consistent digests and exact payload/result inputs for each checkpoint. |
| `consent-contract-change-stop` | A conflict that requires changing the agreed contract asks for that decision, despite both repair grants. |
| `pr-body-false-claim` | Otherwise acceptable code, exact scope-neutral correction through `fix`, unrelated text preserved, decline writes nothing, successful write read back and rechecked, no repeated proposal on unchanged recheck, no empty commit or full-suite rerun. Local-only and pending-evidence checkpoints preserve the original evidence block and log path without inventing CI evidence. |
| `pr-body-new-claim-held-grant` | A broad fix grant and a newly discovered description contradiction still require the exact first proposal's selection; code-blocker authority is not unseen-description authority. |
| `pr-body-false-claim-missing-test` | Correct the false description but retain the independent missing-test contribution, including when both shared one rendered blocker. When the mixed pass then adds the missing test, narrowly recheck the just-corrected description against the pushed head instead of carrying a now-false claim to readiness. |
| `pr-body-scope-reduction-spec` | Rewording the body cannot erase a spec obligation or clear its acceptance gap. |
| `pr-body-scope-reduction-no-spec` | Original stated intent survives description correction and subsequent reassessment; deleting a promised mechanism cannot make the gate pass. |
| `pr-body-unverifiable-completion` | Report non-blocking uncertainty; no invented unfinished work or future commitment. A specifically requested clarification distinguishes the author's assertion from available evidence. Conflicting sources stay uncertain. |
| `pr-body-pending-and-matched` | Assess supplied evidence, leave matched claims and explicit pending-work statements alone, and do not rewrite qualitative prose for style. |
| `pr-body-concurrent-change`, `pr-body-head-change`, `pr-body-mixed-failure-progress`, `pr-body-own-push-stale-proposal`, `pr-body-same-head-merge-refresh` | Use separate single-menu samples for the original five independent checkpoints, preserving all five facts and cap 2000. Respectively: changed body preserves concurrent text and needs a fresh exact proposal; changed head invalidates the old proposal; successful body repair survives an independent failed file repair; an own push invalidates the old snapshot and the still-contradicted claim needs a fresh selection; a later same-head body change aborts selected merge and is narrowly rechecked before a fresh final decision. Supply actual claim evidence at every changed head instead of a default clean helper that could legitimately retire an obsolete correction. |
| `pr-body-write-failure` | Failed API write, unreadable/unexpected readback, or remaining contradiction never clears the finding or reports success. A head move cannot confirm the original operation or close its claim from old-head evidence; later closure requires fresh actual-body and matching claim/evidence checks at the new head. Preserve that temporal distinction rather than requiring an already re-verified claim to remain open forever. |

Keep all existing cases, including `blockers-bare-fix`, `nits-only-ready`, `wave-closure-retry`, `red-ci-no-autofix`, and the sync cases. Their no-nit, scoped-test, carried-set, failing-check, and one-time-rebase facts remain regression guards. Compact multi-checkpoint cases are permitted only when each checkpoint has its own explicit judged fact.

After spec approval, prepare the synthetic cases, assembled source list, and intent before changing skill behavior, then capture the baseline. For a source-backed fixture correction discovered later, keep the same pinned pre-change source, re-seed that corrected input's baseline, and compare both arms on the identical corrected input; never compare against the superseded fixture or change the word cap to hide an oversized composite case:

```bash
node eval/run.mjs gatekeep-pr --baseline-only --base c10ba7c5eaf867280a2b21d70d612c2579ecafcf
```

After the instruction change, run the paired target-wide comparison against the same pinned base:

```bash
node eval/run.mjs gatekeep-pr --base c10ba7c5eaf867280a2b21d70d612c2579ecafcf
npm test
```
Package verification: `npm test`.
Use the driver's existing two frozen replay models and judge. Commit `intent.md`, the before/after records, and `report.md`. Require every new or changed must-hold fact to have `after: holds` for both replay models in the committed candidate results, independently of aggregate verdict or exit code. The current judge can label an unchanged failure `pre-existing` or `intended but unchanged`, so a successful command alone does not establish delivery. An unmet, errored, or inconclusive required fact prevents completion; inspect the existing result records rather than adding a new harness. The behavior-change commit body states that this is an instruction behavior change, not wording-only. Deterministic package checks cover skill/eval structure, hygiene, and existing static contracts; they are not substitutes for the paired model eval.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md - Architecture and Use from Claude Code (changed permission/procedure contract: continued repair, description fixes, portable retention and its limits); CHANGELOG.md - Unreleased (user-visible repair and uncertainty behavior); doc/configuration.md - gatekeep-specific maxFixRounds sentence under Conformance gate model (same tunable now caps continued conflict-only and description-only passes without resetting)
- Derived / memory docs invalidated: eval/gatekeep-pr/README.md - update the eleven-sample inventory and seven-file source list to match the expanded target, and distinguish baseline capture from required candidate fact-level acceptance

Apply `reference/documentation-impact.md`. Amend the owning passages, not a new guide. Skill/reference bodies are implementation surface, not documentation-impact entries. The existing marketplace entry and AGENTS routing remain accurate.

## Out of scope

- Automatic final merge/approval, broader nit cleanup, tracker edits, PR-title edits, and style-only description rewrites.
- Changing spec/ticket scope through the description-correction path, or converting lack of evidence into an unperformed-work claim.
- A new pi extension, Claude Code hook, consent CLI, settings key, parallel repair implementation, or generalized permission framework.
- Cross-run permission reuse, automatic session discovery, guaranteed recovery after temp-file loss, and hard tool-call enforcement.
- Atomic forge-side body updates, other forges, and live mutations during eval.
- Replacing the existing CI evidence resolution, scoped-test selection, reviewer carried-set policy, or invocation-time rebase course.

## Human input

The initial request asked to fix #62 together with repeated selections for conflict resolution and later blocker repair in one gatekeep-pr run. It required checking observed sessions and repository history, arguing against unsafe parts of the initial idea, minimal forge-skill-compliant edits, paired before/after evals, and anonymized artifacts. The consumer reference in that request is intentionally omitted here.

The selected framing option was: "Pivot to bounded repair grants: remember `fix` and `merge base` separately for this gate run. Continue routine conflicts and newly verified blockers within the agreed scope; stop for scope changes, exhausted budgets, unavailable prerequisites, or another unapproved action. Keep merge/approval separate and honor the ticket's stale-description consent rule."

Human answer: "B, when granted fix and merge based continue until PR is trully mergable and final menu can be rendered"

Portability clarification: "keep in mind that this skill is claude code enable skill, so we need to make sure that to some extent it will keep consent as well for cc (so pi extension can't be only mechanism). we probably need both consent block and keep consent mechanically, right?"

The human replied "approve" to the revised single-record architecture. Round 2 presented the bounded passes, description freshness/recheck rules, before/after cases, and documentation impact. After asking where consent would be stored, the human received the run-specific OS temporary-file explanation, outside the repository, shared by both harnesses, never inherited by another run, and without guaranteed recovery after OS cleanup, then replied "approve". No ticket row was cut or deferred.

## Open questions

none
