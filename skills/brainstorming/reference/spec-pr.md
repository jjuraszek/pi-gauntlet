# Spec-only PR publication and re-gate

## Shared predicate and marker

Resolve home `gauntlet_setting({ key: "flowGuards" })` and use its `specDirs`. For a companion, read that repo's `.pi/settings.json` by file with [legs.md](legs.md)'s preset/default rules (`doc/specs`, `docs/specs` by default), never session `gauntlet_setting`; require the sole added file at its recorded `<spec-dir>/<home spec filename>`. Inspect `git diff --name-status <base>...<head>` and every modified file's hunks against the same pinned endpoints. Require exactly one `A` under a resolved spec dir: the selected spec. Require every other entry to be an `M` under a spec dir that adds only active supersession-banner lines plus adjacent blank lines and removes nothing. Read [superseding.md](superseding.md): use `> **Superseded by:**` by default or the declared override syntax; enforce title-adjacent placement and append-only insertion below existing banners. Reject renames, deletes, multiple additions, non-spec paths, and arbitrary modifications. Evaluate the whole diff, not commit count: earlier implementation, non-default-source changes, and an ignore-file commit all count.

Keep shape separate from approval. Read the added spec with `git show <head>:<spec path>`; match `^\*\*Engine:\*\*[ \t]+deferred[ \t]*$` only in the header before the first `## `. Use that marker plus shape for re-gating. Use shape alone for publication. Ignore draft status, labels, PR body, telemetry, and audit presence as classification proof. Route a list of N>1 PRs through rework; count carried Legs separately.

## Publish option 6

Decode the reply before writes. A hidden `6` gets the clarifying question naming rendered choices. A funded `6` is malformed: re-present, write nothing. `3` plus `6` prints the audit and re-presents without approval; `6` plus a change request revises and re-presents.

On clean `6`, edit home only: `**Amend-grant:** none` and exactly one `**Engine:** deferred` directly below it. A 6 never grants. Stage the spec with `git -C <worktree> add -- <spec path>`, then `git -C <worktree> commit --amend --no-edit -q`; verify both lines through `git -C <worktree> show HEAD:<spec path>`. Stop on failure.

Read the committed home spec's `## Legs` in [legs.md](legs.md) order. Carry Worktree First paths; treat recorded repo, branch, contract, spec-dir, home and create as authoritative. Keep the one-block and legacy recipe below verbatim (one push/PR/cleanup, no companion prefixes). For N>1 run the coordinated passes below instead of executing the home recipe immediately: they invoke its preflight last, then its push/create after companion publication, and replace its output/cleanup ordering. Keep companion files unchanged.

Resolve the default base once, never substitute the worktree creation ref:

```bash
DEFAULT=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
git -C <worktree> fetch origin "$DEFAULT"
git -C <worktree> diff --name-status origin/$DEFAULT...HEAD
```

Prove the shared predicate against `origin/$DEFAULT` before pushing. Stop on command errors. On invalid shape print the offending name-status lines and `origin/$DEFAULT`, retain the amended spec and checkout, and redraw with `Withheld: draft PR - diff against origin/$DEFAULT is not spec-only (<paths>)` replacing 6. Keep implementation approvals available.

Push, then create with explicit head/base and the spec H1 as title. Run gh against the worktree repository:

```bash
git -C <worktree> push -u origin <branch>
gh pr create --draft --head <branch> --base "$DEFAULT" --title "<spec H1 text>" --body-file - <<'EOF'
<gate summary verbatim, or the **Goal:** line on the degraded-summary path>
EOF
```

| Observation | Action |
|---|---|
| Push rejected | Print git output; retain amended spec and checkout; re-present with 6 retryable. |
| Create fails after push | Print error and pushed branch. Keep brainstorm incomplete and checkout intact. Offer only `6 - retry opening the draft PR` and `Withheld: implementation approvals - the handoff commit is published; an approval would amend it`. |
| Retry 6 after published handoff | Refresh origin's branch head; require `origin/<branch>` == HEAD. On mismatch print both full SHAs and stop. On equality rerun create only, no push, no amend. |
| Create succeeds | Print URL before completing brainstorm; then perform ownership-based cleanup below. |

After URL output call `phase_tracker({ action: "complete", phase: "brainstorm" })`. Read finishing's [Step 6](../../finishing-a-development-branch/SKILL.md#step-6-cleanup-workspace), using only its ownership test and wrapper selection: resolve home/destroy, legacy native script, or native remove/prune. Disable every branch-deletion step, including within a destroy wrapper: verify the wrapper preserves the branch before running it; stop cleanup and report when it cannot. Never delete the local branch. Report host-owned or failed removal with checkout path and command output; explain that later `brainstorming #N` hits pr-head's checked-out-at-another-path stop until that checkout is gone. Start no plan or loop, produce no handoff brief, and leave telemetry unchanged.

### Coordinated publication passes

Finish preflight for every companion in declared order, then home, before any push:

1. Resolve each companion's default with `DEFAULT=$(gh repo view <owner/name> --json defaultBranchRef -q .defaultBranchRef.name)` (positional repo, not `-R`); require nonempty. Run `git -C <companion worktree> fetch origin "$DEFAULT"` and `git -C <companion worktree> diff --name-status origin/$DEFAULT...HEAD`. Apply the shared predicate with that member's own dirs and recorded added file.
2. Discover remote publication with `git -C <companion worktree> ls-remote --exit-code --heads origin <branch>`. Exit 2 means absent: attempt no branch fetch. Exit 0 means present: fetch `origin <branch>`, then read full `origin/<branch>` and HEAD SHAs for publication. Any other exit is a command failure, never absence; ignore stale tracking refs as discovery proof.
3. Run home's default/fetch/shape recipe last. On any shape failure print the member, offending name-status lines and `origin/<default>`, retain every amended spec and checkout, and redraw with `Withheld: draft PR - <repo> diff against origin/<default> is not spec-only (<paths>)` replacing 6; keep implementation approvals. On gh/default/fetch/ls-remote failure stop naming member and command output. Nothing has been pushed on either preflight failure.

Publish companions in declared order from the preflight observations:

| Observation | Action |
|---|---|
| Absent | `git -C <companion worktree> push -u origin <branch>`; record published member. |
| Present, full remote SHA equals HEAD | Skip with `<repo>: already published`; include it in the published inventory. |
| Present, different full SHA | Print repo, both full SHAs and already-published members; retain every checkout and list paths; re-present 6 retryable after by-hand resolution. Never force or reconcile. |
| Push rejected | Print member and git output, already-published members and retained paths; re-present 6 retryable. Retry both passes; equality skips completed companions. |

Then run home's existing push/create recipe. Home push/create failures keep its failure rows and also list published companions; never roll back. After home create failure freeze the published handoff commit: the create-only retry above does not amend or push any member or rerun publication passes. On success print `pushed: <repo> origin/<branch>` for each companion before the single home URL, then complete brainstorm.

Clean companions in declared order, then home. Apply finishing Step 6's ownership test and wrapper selection to each recorded contract (legacy without Legs keeps its reread). Verify every wrapper preserves its branch before execution; refuse unsafe wrappers without native fallback. Report each host-owned/refused/failed removal with repo, path and command output, leave its branch intact, and attempt all remaining cleanups even after refusal. Keep branches everywhere, including after owned built-in remove/prune. Write no receipt, companion PR, telemetry or brief.

### Coordinated marked settlement

Use only the N>1 context observed by pr-subject's marked classifier at the original PR head. Preserve home's provisioned tree on every stop. Read the committed Legs in order; reject missing repo/branch/contract, mismatched shared branches or invalid blocks without falling into ordinary sibling discovery.

1. Settle only recorded companions with [legs.md](legs.md)'s first-found home overrides at `BASE_SHA` (`git show <BASE_SHA>:<overrides path>`), sibling parser and `<home PRIMARY parent>/<NAME>` paths. Match repo identifiers before probing paths; validate declaration, checkout, stored origin identity and nonhome canonical path. Never activate unrecorded siblings or infer membership from existing PRs. On no match stop: `leg <repo> matches no sibling declaration in <overrides path>`.
2. Preflight every companion before creating or syncing any companion: run `git -C <PATH> fetch origin` in its primary, then `git -C <PATH> ls-remote --exit-code --heads origin refs/heads/<branch>`. Exit 2 means missing: take the missing-remote stop below even when a stale `origin/<branch>` still resolves. Exit 0 proves live existence; require the recorded shared `origin/<branch>`. On any fetch failure or other lookup exit stop naming member and command output, never diagnose absence. Resolve its own settings/overrides home/create with legs.md's preset/default rules. Compare both portable values with the recorded contract. Stop on drift: `contract drift for <repo>: recorded <key>: <recorded value>, resolved <current value>; amend the recorded contract or restore the repo convention, then rerun brainstorming #N`. Never silently choose between them. Resolve a user amendment through the existing home-plus-companion reconciliation path.
3. Permit fetch/tracking-ref updates during preflight, but no worktree add, local branch/ref update or merge. A missing last declaration/remote prevents provisioning even the first companion. On missing remote say `origin/<branch> is missing in <repo>; on the machine that ran option 6, push <branch> from that companion's checkout, then rerun brainstorming #N`. Recovery must first verify the leg file's commit with `git log -1 --format=%H -- <spec-dir>/<home spec filename>` in the retained tree or primary, then `git push -u origin <branch>` from that existing branch and rerun. No commit anywhere means an incomplete handle: stop; regenerate nothing. An unrelated branch-tip commit does not prove the file exists.
4. After every companion passes, invoke using-git-worktrees once each with explicit `ROOT` = primary, shared `BRANCH`, `REMOTE_BRANCH=existing`. Use pr-head's companion mode and race backstop; carry each Step 4 report, including `Base sync recovered: <sha7>` and its proof. Never construct companion PR fields, pre-rework refs, thread queries or `MEMBER_HEADS`. Do not bypass wrapper safety (`-b`/`-B` falls back to native existing-branch creation) or invent a second provisioning path.
5. On unresolved companion base merge stop: `base merge unresolved for <repo> (<files>) - merge origin/<base> by hand in <worktree> and rerun brainstorming #N`. Keep all trees and refs; on every stop print `Preserved created legs:` listing home and every already-provisioned companion, with repo and path. Never remove any on retries. Preserve home's recovered base-sync proof even if a later companion stops; rerun using the same home recovery path.

At gate readiness list every Worktree First path home first, then companions in recorded order. Offer the ordinary AC-dependent 1/2/4/5 choices and optional pinned audit 3 below, and `Withheld: draft PR - #N already exists`. Keep ordinary pinned-audit and approval persistence below; no companion approval record or second council.

## Re-gate a marked spec PR

Reuse [pr-head](../../using-git-worktrees/reference/pr-head.md)'s checkout, base merge, and Step 4 report, not its before-gather thread fetch. Preserve its checked-out-at-another-path stop. On observed `merge: unresolved - <files>`, print `base merge unresolved for PR #N (<files>) - merge origin/<base> by hand in <worktree> and rerun brainstorming #N`; preserve checkout, render no gate, write no approval or repair task.

For observed N>1 carried Legs, finish [coordinated marked settlement](#coordinated-marked-settlement) after home's Step 4 report and before rendering the gate. For zero/one block keep the home-only route unchanged.

Skip ticket binding, context-builder, review threads, gather, questionary, spec-writing, inline lint, council, worker, and the second predecessor pass. Carry trailing intent as `Intent carried from the command: <text>` beside the gate.

Pin the originating audit once on the PR branch:

```bash
AUDIT_SHA=$(git -C <worktree> log -1 --diff-filter=A --format=%H -- <spec path>)
git -C <worktree> show -s --format=%b "$AUDIT_SHA"
```

Recognize an audit only with all `Applied:`, `Deferred:`, and `Rejected:` labels. A drafted-AC repair line alone is not an audit. Count Council from the pinned body; offer row 3 only with that audit and read that same body on 3, never HEAD. Audit absence does not block re-gating.

Reuse [User Review Gate](spec-finalization.md#user-review-gate)'s summarizer dispatch, fresh temp path, last content-producing Read, verbatim render, degraded path, and unconditional temp cleanup, but skip its unconditional initial spec commit. Render Scope cuts and drafted rows from the carried spec. Offer 1/2/4/5 and optional 3; with zero AC rows omit 4/5 and explain `Loop engine unavailable: this spec has no acceptance-criteria rows.` Withhold 6 with `Withheld: draft PR - #N already exists`; clarify a 6 reply by naming rendered choices.

For a change request, revise and stage the spec and reconciled banners; make a new commit without the old audit body (no new council ran). For coordinated changes touching Problem, shared Design, Errors and edge cases, Out of scope, companion-binding clauses or a Leg block, rewrite and commit affected companion files in their live worktrees per [legs.md](legs.md) before re-dispatching the summarizer with a fresh temp path and re-presenting. Complete the amendment only when carried parts agree; infer no second council or approval.

For approval 1/2/4/5, persist on home only; leave companion files untouched. Decode grant/funding under the ordinary gate. Replace deferred with waves or loop, write the decoded `**Amend-grant:**`, and write exactly one `**PR:** <owner/repo#N>` directly below Engine, lowercasing owner/repo parsed from the admitted PR URL. Stage and make a new commit `spec: select engine and grant for PR #N`; never amend a published commit. Verify all three fields through `git show HEAD:<spec path>` before brainstorm completion and the selected writing-plans/loop-implementation chain. Stop on persistence or verification failure. The unmarked route's gate approval (1/2/4/5) applies this same new-commit persistence: `waves` or `loop` as the engine, the decoded grant, and `**PR:**` directly below `**Engine:**`, never `--amend`.
