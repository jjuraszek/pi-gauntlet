# Spec-only PR publication and re-gate

## Shared predicate and marker

Resolve `gauntlet_setting({ key: "flowGuards" })` and use its `specDirs`. Inspect `git diff --name-status <base>...<head>` and every modified file's hunks against the same pinned endpoints. Require exactly one `A` under a resolved spec dir: the selected spec. Require every other entry to be an `M` under a spec dir that adds only active supersession-banner lines plus adjacent blank lines and removes nothing. Read [superseding.md](superseding.md): use `> **Superseded by:**` by default or the declared override syntax; enforce title-adjacent placement and append-only insertion below existing banners. Reject renames, deletes, multiple additions, non-spec paths, and arbitrary modifications. Evaluate the whole diff, not commit count: earlier implementation, non-default-source changes, and an ignore-file commit all count.

Keep shape separate from approval. Read the added spec with `git show <head>:<spec path>`; match `^\*\*Engine:\*\*[ \t]+deferred[ \t]*$` only in the header before the first `## `. Use that marker plus shape for re-gating. Use shape alone for publication. Ignore draft status, labels, PR body, telemetry, and audit presence as classification proof. Route N>1 through rework.

## Publish option 6

Decode the reply before writes. A hidden `6` gets the clarifying question naming rendered choices. A funded `6` is malformed: re-present, write nothing. `3` plus `6` prints the audit and re-presents without approval; `6` plus a change request revises and re-presents.

On clean `6`, edit `**Amend-grant:** none` and exactly one `**Engine:** deferred` directly below it. A 6 never grants. Stage the spec with `git -C <worktree> add -- <spec path>`, then `git -C <worktree> commit --amend --no-edit -q`; verify both lines through `git -C <worktree> show HEAD:<spec path>`. Stop on failure.

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

## Re-gate a marked spec PR

Reuse [pr-head](../../using-git-worktrees/reference/pr-head.md)'s checkout, base merge, and Step 4 report, not its before-gather thread fetch. Preserve its checked-out-at-another-path stop. On observed `merge: unresolved - <files>`, print `base merge unresolved for PR #N (<files>) - merge origin/<base> by hand in <worktree> and rerun brainstorming #N`; preserve checkout, render no gate, write no approval or repair task.

Skip ticket binding, context-builder, review threads, gather, questionary, spec-writing, inline lint, council, worker, and the second predecessor pass. Carry trailing intent as `Intent carried from the command: <text>` beside the gate.

Pin the originating audit once on the PR branch:

```bash
AUDIT_SHA=$(git -C <worktree> log -1 --diff-filter=A --format=%H -- <spec path>)
git -C <worktree> show -s --format=%b "$AUDIT_SHA"
```

Recognize an audit only with all `Applied:`, `Deferred:`, and `Rejected:` labels. A drafted-AC repair line alone is not an audit. Count Council from the pinned body; offer row 3 only with that audit and read that same body on 3, never HEAD. Audit absence does not block re-gating.

Reuse [User Review Gate](spec-finalization.md#user-review-gate)'s summarizer dispatch, fresh temp path, last content-producing Read, verbatim render, degraded path, and unconditional temp cleanup, but skip its unconditional initial spec commit. Render Scope cuts and drafted rows from the carried spec. Offer 1/2/4/5 and optional 3; with zero AC rows omit 4/5 and explain `Loop engine unavailable: this spec has no acceptance-criteria rows.` Withhold 6 with `Withheld: draft PR - #N already exists`; clarify a 6 reply by naming rendered choices.

For a change request, revise and stage the spec and reconciled banners; make a new commit without the old audit body (no new council ran). Re-dispatch the summarizer with a fresh temp path and re-present.

For approval 1/2/4/5, decode grant/funding under the ordinary gate. Replace deferred with waves or loop, write the decoded `**Amend-grant:**`, and write exactly one `**PR:** <owner/repo#N>` directly below Engine, lowercasing owner/repo parsed from the admitted PR URL. Stage and make a new commit `spec: select engine and grant for PR #N`; never amend a published commit. Verify all three fields through `git show HEAD:<spec path>` before brainstorm completion and the selected writing-plans/loop-implementation chain. Stop on persistence or verification failure.
