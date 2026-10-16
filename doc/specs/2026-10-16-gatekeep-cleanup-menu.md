# gatekeep-pr: `cleanup` row on terminal menus, extended by a `## cleanup` overrides section

**Goal:** Every terminal gatekeep-pr menu (own merge, merge queued once merged, approved, merged or closed at step 1) offers `cleanup` as row 1 `[recommended]`; the pick tears down the gate's git state and then runs the repo's ordered `## cleanup` steps from the overrides file, so a repo whose overrides list `release` and `close ticket` gets both from one pick and gridstrong gets its wrapper destroy.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Date:** 2026-10-16
**Worktree:** `.worktrees/gatekeep-cleanup-menu`
**Framing:** kept

## Problem

After the gate merges a PR, the own-merge menu recommends `stop`, and `stop` silently tears down the gate's worktree (`skills/gatekeep-pr/reference/decision-menu.md` `## Overlays` `own merge` row; `skills/gatekeep-pr/reference/post-selection-loop.md` `### Teardown`). Nothing deletes the squash-merged local branch, nothing after `approve` offers a final menu (the ordinary consent menu re-renders, and only a later `stop` offers a teardown prompt), and the merged-or-closed-at-step-1 menu offers `show evidence` and `stop` only. Repo-specific post-merge chores - gridstrong's `script/worktree destroy`, the pi-* repos' release and ticket close - have no hook in the gate; gridstrong carries its destroy command as prose inside the `worktree wrapper` key and again in `## finishing-a-development-branch`.

Framing: kept - checked the own-merge and merged-or-closed overlays, `### Teardown`, `### Compare-and-swap` (`approve` proceeds, no post-approve overlay exists), `finishing-a-development-branch` Step 6, each sibling's `.agents/skills/release/SKILL.md` follow-ups and `release.sh` (`require_main`, `require_clean_tree`, no fetch or pull), and the `## PR gate` key contract in `README.md` and `reference/assessment.md`. The worktree teardown already exists today, hidden inside `stop`; the missing pieces are the explicit row, the branch delete, the post-approve and already-merged menus, and the override hook.

## Acceptance criteria

none - no ticket

## Design

### Terms

- **Primary checkout**: the parent directory of `git -C <gate worktree> rev-parse --git-common-dir`. It is the checkout the session runs in; `cleanup` never removes it and never changes its branch.
- **Terminal overlay**: `own merge`, `merge queued` (once its read returns `MERGED` it re-renders as `own merge`), `approved`, `merged or closed PR`. Every other menu is an ordinary open-PR menu.
- **Landed**: the PR's `state` is `MERGED`. Under `approved` and under a closed-unmerged PR nothing has landed.

### Menu

`skills/gatekeep-pr/reference/decision-menu.md`:

- `## Verbs` gains `cleanup` - "tear down the gate's checkout and local branch per `cleanup.md`, then run the repo's `## cleanup` steps in order". The consequence clause names each override step as `<label> (<resolved command>)` with placeholders already substituted, so the exact tracker comment or release invocation is visible before the pick; with no `## cleanup` section the clause reads `tear down the gate's checkout and local branch (untracked files there are deleted)`.
- `## Availability` gains a row: `cleanup` renders only under a terminal overlay, never on an ordinary open-PR menu; it leaves the menu after it runs, success or not.
- Overlay rows change:
  - `own merge`: `cleanup` `[recommended]`, `post coverage to ticket` (same condition as today), `post coverage to PR`, `show evidence`, `stop`. A successful post removes its row and re-renders this menu; posting never tears down and never ends the run.
  - `merged or closed PR`: `cleanup` `[recommended]`, `show evidence`, `stop`.
  - New `approved` overlay - trigger: the continuation record's `approved_head` equals the assessed head; the orchestrator sets `approved_head` only when `gh pr review --approve` exits 0, before the re-render; a non-zero exit prints the `gh` error and the ordinary menu re-renders. Effect: `cleanup` `[recommended]`, `show evidence`, `stop`. It sits below `own merge` and `merge queued` in the overlay table and above `contract exception`.
- `stop` stays last. Under a terminal overlay `stop` leaves the checkout as found and prints one line naming the leftover worktree path and local branch; the `rebased locally` reset in the `stop` verb runs only on an ordinary open-PR menu, and the verb definition says so.
- The `## Consent table` sentence "the first rendered row is `[recommended]`" is unchanged and now covers `cleanup`.

### Digest fields

`skills/gatekeep-pr/verification-brief.md` Section A adds `url` and `mergeCommit` to the fixed `gh pr view --json` field list and to the digest's `pr` schema (`pr.url`, `pr.merge_commit` - `null` while unmerged). `post-selection-loop.md` `### Pre-menu refresh` adds the same two fields to its single `gh pr view` call, and `### Merge course` writes the returned `state` into `pr.state` and `mergeCommit.oid` into `pr.merge_commit` when its read returns `MERGED` (also on a queued merge's `wait` re-read), so `cleanup.md`'s landed guards read the post-merge state. Provisioning (`assessment.md`) records `worktree.path`, `worktree.branch` (the actual local branch - `headRefName`, `pr-<N>`, or whatever a wrapper created), `worktree.created` (true when this run created it), and `worktree.destroy` (the exact destroy invocation when a `worktree wrapper` created it, else null). The continuation record gains `approved_head` and `cleanup_done`.

### `cleanup.md` (new reference)

`skills/gatekeep-pr/reference/cleanup.md`, read when `cleanup` is picked. Input: the digest and continuation record above plus the merge-base overrides file. Output: one rendered line per step - `<label>: done`, `<label>: skipped - <reason>`, `<label>: failed - <first error line>`, or `<label>: invoked /skill:<name> - <where it paused or what it returned>` for a `/skill:` item - then `cleanup_done` is set and the same terminal menu re-renders without the `cleanup` row. Every git command runs as `git -C <primary>`; nothing after step 1 touches the removed worktree path.

Procedure, in order, orchestrator-run:

1. **Worktree.** Eligible when the recorded path is not the primary checkout, its tree is tracked-clean, and - when landed - `git -C <path> log origin/<baseRefName>..HEAD` shows no commit outside the assessed head's history (`git merge-base --is-ancestor HEAD <headRefOid>` succeeds). Eligible and (`worktree.created` or landed) -> run `worktree.destroy` when recorded, else `git worktree remove --force <path>` (the single `--force` removes a tree whose only dirt is untracked files; those files are deleted, and the consequence clause says so); then `git worktree prune`; `worktree: done`. Reused and not landed -> `worktree: skipped - reused, left at <path>`. Dirty -> `worktree: skipped - uncommitted changes at <path>`. Commits beyond the assessed head -> `worktree: skipped - unmerged commits <shas> at <path>`.
2. **Branch.** Landed, step 1 removed the tree (or `worktree.branch` is checked out nowhere, per `git worktree list --porcelain`), and the branch exists locally -> `git branch -D <worktree.branch>`; `branch: done`. Not landed -> `branch: skipped - PR not merged`. Still checked out -> `branch: skipped - checked out at <path>`. Remote branches are never deleted.
3. **Base.** Landed, the primary checkout is on `<baseRefName>` with a tracked-clean tree -> `git fetch origin` and `git pull --ff-only`; `base: synced <sha>` when `pr.merge_commit` is an ancestor of the new HEAD, else `base: failed - merge commit not on local <baseRefName>`. Primary on another branch or dirty -> `base: skipped - primary on <branch>` or `base: skipped - uncommitted changes`. Not landed -> `base: skipped - PR not merged`. The primary's branch is never switched.
4. **Override steps**, each `## cleanup` item in list order. An item is `<label>: <text>`; an item without that shape -> `skipped - malformed item: <text>`.
   - Landed-change guard first: not landed and the text contains `<merge-sha>` or `/skill:release` -> `skipped - needs a landed change`. `/skill:release` items also skip when step 3 did not report `synced` -> `skipped - base not synced`.
   - Substitution: `<issue>` is the digest's `issue.ref` with a leading `#` stripped for the bare `#N` form (other forms verbatim), `<pr>` is `pr.url`, `<merge-sha>` is `pr.merge_commit`. A null value -> `skipped - no <name> resolved`. Any other `<...>` token -> `skipped - malformed item: <text>`. Each substituted value is inserted as the literal argument text: inside an existing quoted span it is inserted verbatim; outside, it is single-quoted as one shell word.
   - Text starting with `/skill:` is invoked as that skill with the rest as its arguments and its own gates intact: `/skill:release` with no level runs the skill's propose-then-pick gate; a level written in the item (`patch`, `minor`, `major`) authorizes the release without a pause. Any other text runs as a non-interactive shell command with cwd the primary checkout, bounded by the resolved `timeout minutes` (default 15) through the Safety contract ladder of `verification-brief.md` Section B; a timeout is `failed - timed out after <n> minutes`.
   - A failing step prints its first error line and the loop continues; nothing is retried.

The consent record, helper output files, and temporary body files are deleted on terminal exit exactly as `### Teardown` specifies today; `cleanup` does not delete them, because `show evidence` and the post rows stay available after it.

### Teardown pointer

`post-selection-loop.md` `### Teardown` replaces its create/reuse x own-merge/non-merge table with: terminal overlays - `cleanup` executes `cleanup.md`; `stop` leaves the checkout as found and names it; ordinary open-PR `stop` - the existing offer-teardown rule, unchanged. Consent-record and helper-file deletion stays on every exit; the `rebased locally` reset sentence moves to the open-PR `stop` only.

### Configuration

`assessment.md` `## Configuration` rung 2 names `## cleanup` as the second gatekeep-read overrides section, read from the merge-base like `## PR gate`; a PR that edits it is review subject matter, never this run's config. The `## PR gate` fence is unchanged. The overrides contract:

```markdown
## cleanup
- close ticket: gh issue close <issue> --comment "Delivered in <pr>, merged <merge-sha>."
- release: /skill:release
```

Ordered list, `<label>: <command or /skill:... invocation>`. Placeholders: `<issue>`, `<pr>`, `<merge-sha>`. Git teardown and base sync are implied and never listed. The release skill's own propose step supplies the recommended level and pauses for the pick; a repo that wants no pause writes the level in the item.

`SKILL.md` `## Project overrides` adds one sentence: "`## cleanup` steps run on the `cleanup` pick (`reference/cleanup.md`)". `SKILL.md` `## Red flags`: the open-PR-menu bullet's exemption list becomes "the conflict menu, a terminal overlay (`reference/decision-menu.md`), a pending contract-exception menu, or a `--rebase` terminal stop", its parenthetical becomes "a PR already merged or closed at step 1 offers `cleanup`, `show evidence`, and `stop` only", and a new bullet reads "`cleanup` rendered on an ordinary open-PR menu, or its steps run without a pick - owner: `reference/cleanup.md`".

### This repo's overrides

`.pi/gauntlet-overrides.md` gains the `## cleanup` section above. `close ticket` is first so the ticket closes even when the release pauses at its level pick or fails. pi-cohort, pi-condense, and pi-quiver receive the same section as coordinated commits in their own repos after this ships (`## Out of scope` names them); until then those repos get the git-only `cleanup`.

## Errors and edge cases

- No overrides file or no `## cleanup` section: `cleanup` still renders with the git-only consequence clause and runs steps 1-3.
- `issue: null` (no closing reference, fetch failed): any item with `<issue>` prints `skipped - no issue resolved`; the others run.
- Merged-at-step-1 PR: `pr.merge_commit` comes from the step-1 digest (Section A now requests `mergeCommit`); the worktree is usually reused and landed, so step 1 removes it when clean and step 2 deletes the branch.
- Closed-unmerged PR: steps 2 and 3 skip (`PR not merged`); the landed-change guard skips release and `<merge-sha>` items before substitution.
- `approved` on a `rebased locally` head: `stop` leaves the rewritten local head in place and names it; `cleanup` step 1 reports `unmerged commits` and leaves the tree.
- A shell step that exceeds the timeout is killed and reported `failed - timed out`; later steps still run.
- `cleanup` is one pick for the whole list; the consequence clause shows every resolved command, so the tracker comment text and the release invocation are confirmed by the pick (AGENTS.md "Gated writes to human channels"), and `/skill:release` keeps its own level gate.

## Tests

- `eval/gatekeep-pr-scope/samples/post-merge-menu/expected.md`: f1 becomes "After merge, the menu offers `cleanup` as row 1 `[recommended]`, then `post coverage to ticket`, `post coverage to PR`, `show evidence`, `stop` last"; new f5 "`stop` leaves the worktree and names its path"; new f6 "a successful coverage post re-renders the menu and does not tear down".
- New `eval/gatekeep-pr-scope/samples/cleanup-null-issue`: own merge, `issue: null`, created worktree, primary on `main` clean, overrides with the two items. Must hold: `close ticket: skipped - no issue resolved`; `base: synced`; `release` invokes `/skill:release` and pauses at its level pick; worktree removed and `git branch -D` run; the re-rendered menu has no `cleanup` row and still offers `show evidence`.
- New `eval/gatekeep-pr-scope/samples/cleanup-after-approve`: someone else's PR, `approve` exited 0. Must hold: `cleanup` row renders `[recommended]`; `release` and the `<merge-sha>` item print `skipped - needs a landed change`; `branch: skipped - PR not merged`; no `git branch -D`.
- New `eval/gatekeep-pr-scope/samples/cleanup-merged-at-step-1`: PR merged before the run, reused clean worktree on `headRefName`, `issue.ref` `#210`. Must hold: `<merge-sha>` resolves from the digest; worktree removed, branch deleted; the close command carries `210` and the full comment as separate arguments.
- New `eval/gatekeep-pr-scope/samples/cleanup-closed-unmerged`: PR closed without merge. Must hold: no release, no `branch -D`, `base: skipped - PR not merged`.
- New `eval/gatekeep-pr-scope/samples/cleanup-no-section`: own merge, overrides without `## cleanup`. Must hold: consequence clause reads `tear down the gate's checkout and local branch (untracked files there are deleted)`; only steps 1-3 run.
- `reference/cleanup.md` joins `skillFiles` in both `eval/gatekeep-pr/target.json` and `eval/gatekeep-pr-scope/target.json`; both `intent.md` files get a new `for:` fingerprint and the expected-to-move rows for the samples above. Baseline: the plan's first commit adds `cleanup.md` as a one-line stub plus the two `skillFiles` entries, and every eval run passes `--base <that commit>` so the baseline resolves (`eval/README.md`: a skill file absent at the baseline refuses the run). Every `gatekeep-pr-scope` `case.md` whose `## PR` line carries `mergeable MERGEABLE` also carries `merge_state_status CLEAN`, so the replay never trips the merge-state overlay on an input that omits the field; the token is added to both arms alike before the full run.
- `npm test` (lint, eval structural checks, hygiene) and `node eval/run.mjs gatekeep-pr-scope --base <stub commit>` as the behavior run: the gate is that every fact of the six samples this spec names holds on both replay models; a `regressed` or `inconclusive` cell on a pre-existing sample is recorded in the commit body with its judge note, never a block. The `gatekeep-pr` target is not re-run for this change (none of its samples reaches a terminal menu); its `intent.md` `for:` is refreshed once and the committed report stands.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` "Project-specific overrides" - new `## cleanup` section contract (ordered list, three placeholders, implied git teardown and base sync, the four terminal menus) - clears operations / tunable parameters; `CHANGELOG.md` `## Unreleased` - clears major procedures; `.pi/gauntlet-overrides.md` - this repo's `## cleanup` entries, the first live consumer config - clears major procedures
- Derived / memory docs invalidated: `README.md` "Thin-wrapper contract" (says customization lives in `REVIEW.md` and `## PR gate` only; now also `## cleanup`); `README.md` skills-list `gatekeep-pr` blurb (describes the post-merge coverage rows; must name the `cleanup` row)

Bar applied per `reference/documentation-impact.md`; the skill and reference edits are implementation surface in the plan's file list.

## Out of scope

- The `## cleanup` sections of pi-cohort, pi-condense, and pi-quiver: coordinated commits in each repo after this ships, same two items as this repo's section.
- Remote branch deletion; `finishing-a-development-branch` Step 6 and `check-delivery`'s worktree-cleanup stance (unchanged).
- gridstrong's migration of its destroy command from `worktree wrapper` prose to a recorded `worktree.destroy` (consumer repo; until then its wrapper-created trees fall back to `git worktree remove`).
- Any extension or `scripts/` code; the change is skill text, docs, and evals.

## Open questions

none

## Predecessors

Amended in scope, no supersession banner: `doc/specs/2026-10-01-gatekeep-pr-capability-gate-compact-report.md` (own-merge and merged-or-closed overlays, `stop` rules) and `doc/specs/2026-10-02-gh-57-gatekeep-pr-production-gate.md` (`### Teardown` table, Section A digest fields). Both stay live for every other section.
