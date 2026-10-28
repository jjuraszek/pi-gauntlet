# PR subject syncs by rebase and lease push

**Goal:** `/skill:brainstorming #12 [#13 ...]` rebases the home PR branch onto `origin/<base>` at provisioning, replays each member's own commits onto it in listed order, and finishes with `git push --force-with-lease=<headRefName>:<PRE_REWORK_HEAD>`; one straight first-parent history, no merge commits, member branches on origin untouched until closure. The token `merge-forward` as the first intent word after the ref run keeps today's merge path verbatim. The spec-only draft PR route (gate option 6) is unchanged.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves
**Predecessor:** doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md (supersedes its "merge, not rebase" rework rule, the non-force finishing push, and the "Before: ... stays on origin" wording; other sections stay live)
**Predecessor:** doc/specs/2026-10-26-gh-89-pr-list-rework-subject.md (supersedes its `--no-ff` member-head merges, the member-merge recovery walk, the all-original-heads ancestry proof at finish, and the "remain reachable as <sha7>" closure comment; admission, relatedness, record grammar, and gated closure stay live)

## Problem

A PR branch taken over through `/skill:brainstorming #N` gains a merge commit the moment the skill starts (`skills/using-git-worktrees/reference/pr-head.md` "Merge the fetched base" has no skip or ask branch), every member of an N-PR list adds a `--no-ff` merge commit, and finishing refuses a rewritten history (`skills/finishing-a-development-branch/SKILL.md:173` stops with "the rework must be re-merged, not rebased") and pushes non-force (line 270). The result is the least readable shape for a reviewer: `git log --first-parent` and `git diff origin/<base>...HEAD` disagree, and a repo that forbids merge commits cannot land the branch. Today's only escape is to rebase by hand before invoking the skill.

The user's decision: rebase is the default for a taken-over branch, merge-forward is opt-in per run. Scout's framing objection - gatekeep refuses to rewrite other authors' or merge-containing heads (`skills/gatekeep-pr/reference/sync.md` preconditions, `fix-wave.md` "Sync") - names no alternative the user has not already weighed: a brainstormed PR is one the user owns from that moment, and a plain `git rebase` dropping an earlier "merge base into branch" commit is the wanted cleanup. Gatekeep's policies are untouched.

Premises: the base merge is unconditional and is brainstorming's sole pre-approval write carve-out (`skills/brainstorming/SKILL.md` HARD CONSTRAINT) - supported. Finish's ancestry stop and non-force push - supported. `sync.md` holds a rebase + `--force-with-lease=<head_ref>:<pre_head>` recipe with helper, restore, and no-retry rules - supported; this spec reuses pr-head's own helper recipe and cites `sync.md` only for the push form. Corrected: member branches are never pushed (`finishing-a-development-branch/SKILL.md:269-299`), so "rebase all N" means all N PRs' commits are replayed onto home's branch. Unverified: whether a force-pushed-away SHA stays viewable on GitHub; the `Before:` wording no longer claims it.

Framing: kept - checked `pr-head.md`, both `spec-pr.md` routes, finishing, `sync.md`, `fix-wave.md`, `README.md:39,45,78`.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] After provisioning a single PR subject with no `merge-forward` token, `git log --first-parent origin/<base>..HEAD` in the worktree lists only the PR's own commits replayed on `origin/<base>`, with no merge commit, and the Step 4 report carries `Rework base: <sha>` after `Base SHA:`.
  in-scope
- [ ] After provisioning a list `#12 #13 #14`, home's branch holds 12's commits, then 13's, then 14's, each set replayed in listed order, with no merge commit; member branches on origin are unchanged.
  in-scope
- [ ] With `merge-forward` as the first intent token, provisioning runs today's member-merge and base-merge path, the token does not reach scout's task, and the record line stays `merge: ...`.
  in-scope
- [ ] A conflict during the home rebase or a member replay is resolved by one fresh implementer per stop under the existing helper contract and continued with `GIT_EDITOR=true git rebase --continue`; a failed helper aborts, restores the last-good head (home's branch checked out again after a member abort), records `sync: unresolved - <files>` or `Member replay: #<N> unresolved - <files>` with later members `pending`, and opens Design with the matching `rebase onto origin/<base> and resolve <files>` or `replay #<N> onto home and resolve <files>` as Task 1; that task also replays pending members and persists `Rework base:` before finishing is allowed.
  in-scope
- [ ] Finishing row 1 pushes home with `--force-with-lease=<headRefName>:<PRE_REWORK_HEAD>` while `origin/<headRefName>` is still `PRE_REWORK_HEAD`, and non-force when origin already holds a pushed rework tip that descends from `Rework base` and is an ancestor of HEAD; a lease refusal withholds row 1 with `push withheld: origin/<headRefName> moved past <PRE_REWORK_HEAD7>` and never retries or resets.
  in-scope
- [ ] Finishing on a record whose `Base:` line is in `merge:` form (written before this change, or a `merge-forward` run) keeps today's pre-rework ancestry proof and non-force push; an incomplete rebase record without `Rework base:` stops with `rework sync incomplete` instead of taking that path.
  in-scope
- [ ] `refs/gauntlet/pre-rework/pr-<N>` exists for every admitted PR from provisioning onward, and `refs/gauntlet/rework-base/pr-<home>` exists after a successful rebase sync; an interrupted list run resumes only when `rework-base` is an ancestor of the local home tip.
  in-scope
- [ ] The spec-only draft PR route (`brainstorming/reference/spec-pr.md`, `finishing-a-development-branch/reference/spec-pr.md`) behaves exactly as before: both classifier rows provision with the merge procedure, and the eval samples `spec-pr-unmarked`, `spec-pr-regate`, and `spec-pr-menu` pass unchanged.
  in-scope
- [ ] The handoff brief and resume carry `Rework base: <sha>` after the PR pairs and reconstruction diffs spec/plan candidates from it when present, else from the first pre-rework head as today.
  in-scope

## Design

Minimal diff: replace lines, never append explanatory prose; `finishing-a-development-branch/SKILL.md` (43,695 bytes) stays under 50,000 bytes.

### Token (`brainstorming/reference/pr-subject.md`)

Add after the ref-run grammar: when the first intent token is `merge-forward`, set `SYNC=merge` and strip the token from the intent text; otherwise `SYNC=rebase`. That value reaches provisioning only where the run continues into rework: the classifier's "Shape fails" row and every N>1 list. Both spec-only classifier rows ("Shape passes, marker absent" and "Shape and marker pass") pass `SYNC=merge` regardless of the token - one clause added per row - so their cited "checkout, base merge, and Step 4 report" entry point, `brainstorming/reference/spec-pr.md:45`'s `merge: unresolved - <files>` stop, and finishing's `reference/spec-pr.md` origin-ancestry/non-force contract stay valid; neither `spec-pr.md` file is edited. Pass `SYNC` to provisioning beside the PR array. Carry `SYNC` nowhere else; the record line form reveals it.

### Provisioning (`using-git-worktrees/reference/pr-head.md`)

Keep "Select home and stop before writes", "Provision the exact head", and "Fetch unresolved review threads" unchanged except where named below.

Replace "Preserve pre-rework history" with "Record the pre-rework heads": after the exact-head verification, `git -C "$WORKTREE" update-ref refs/gauntlet/pre-rework/pr-<N> <headRefOid>` for home and every member; stop on failure. Keep the sentence about the approval `commit --amend` and the wave fold `reset --soft`, requiring `WAVE_BASE_SHA` to descend from the rework base.

Replace "Merge admitted member heads" and "Merge the fetched base" with one section "Sync onto the fetched base", a two-row table on `SYNC`:

| `SYNC` | Procedure |
|---|---|
| `rebase` | Save the actual pre-attempt local home tip as the last-good SHA (`PRE_REWORK_HEAD` on fresh entry; the validated local tip on recovery). `git -C "$WORKTREE" rebase --no-rebase-merges origin/<baseRefName>`; on success save the last-good SHA again. Then per member in listed order: `git -C "$WORKTREE" rebase --no-rebase-merges --onto HEAD <BASE_SHA> <member headRefOid>` (detaches), then `git -C "$WORKTREE" update-ref refs/heads/<home headRefName> HEAD` and `git -C "$WORKTREE" checkout <home headRefName>`; save the last-good SHA after each member. On success `update-ref refs/gauntlet/rework-base/pr-<home> HEAD`. Record `Base: <base> @ <sha7> - rebased: <pre7>..<new7>, <n> stop(s) in <files>` where `<new7>` is the final tip after all replays, or `Base: ... - sync: no-op` only when that final tip equals the pre-rework head (rework base = pre-rework head); then one `Member replay: #<N> <outcome>` line per member in listed order using the Record grammar below. |
| `merge` | Today's "Merge admitted member heads" and "Merge the fetched base" text verbatim; `rework-base` is not written. |

Conflict stop (rebase row): the existing helper recipe with these substitutions - conflicted paths from `git -C "$WORKTREE" diff --name-only --diff-filter=U`, the stopped commit from `git -C "$WORKTREE" rebase --show-current-patch` in the task text, continuation `GIT_EDITOR=true git -C "$WORKTREE" rebase --continue` under the existing empty-unmerged-index, every-listed-file-staged, contained-status-delta checks; a later conflict in the same rebase is another helper stop; a commit that becomes empty is skipped by the orchestrator with `git -C "$WORKTREE" rebase --skip`, never by the helper. Forbid helper `rebase --continue/--abort/--skip` and commits (same list as today's merge helper). On a failed helper or check: `git -C "$WORKTREE" rebase --abort`; after a member replay additionally `git -C "$WORKTREE" checkout <home headRefName>` (the failed replay never moved home's ref; `--abort` leaves HEAD detached at the member SHA); then today's restore assertions (abort exit 0, HEAD equals last-good SHA, branch equals home `headRefName`, clean porcelain) with today's stop text on failure. After a clean abort of the home rebase, record `sync: unresolved - <files>`, mark every member `pending`, continue on the saved pre-attempt home tip, and open Design with `rebase onto origin/<base> and resolve <files>` as Task 1. After a clean abort of a member replay, record `Member replay: #<N> unresolved - <files>`, mark later members `pending`, continue on the rebased home tip, and open Design with `replay #<N> onto home and resolve <files>` as Task 1.

Post-sync validation, one check per outcome: rebase success - `git -C "$WORKTREE" merge-base --is-ancestor refs/gauntlet/rework-base/pr-<home> HEAD`; merge (any outcome) - today's every-original-head proof; home rebase aborted - HEAD equals the saved pre-attempt last-good home SHA; the fresh-entry value is `PRE_REWORK_HEAD`;  member replay aborted - HEAD equals the last-good rebased home tip. Stop on failure naming the PR and SHAs. Original-head ancestry is never asserted against a rebased tip.

Recovery ("Recover interrupted member merges" becomes "Recover an interrupted sync"), run for an existing home worktree or local branch before the N=1 local-branch ancestry stop and the exact-head rows: first, when `git -C "$WORKTREE" rev-parse -q --verify REBASE_HEAD` succeeds, stop with `worktree <path> has a rebase in progress; finish or abort it by hand`. Then require a clean existing home tree (today's check) on every branch below. When `refs/gauntlet/rework-base/pr-<home>` exists, require it to be an ancestor of the local home tip and every `refs/gauntlet/pre-rework/pr-<N>` to equal its recorded `headRefOid`; set `SYNC=rebase` regardless of the token, continue from the tip with no reset, and per member run `git -C "$WORKTREE" cherry <tip> <member headRefOid> <BASE_SHA>`: no `+` line records `Member replay: #<N> (already landed)`, otherwise that member is replayed as above. On mismatch stop with today's "carries commits beyond ... resolve by hand" text. When the ref is absent and the first-parent walk `<headRefOid>..<local home tip>` shows today's canonical `merge PR #<N> head <sha7> into PR #<home>` subjects, keep today's member-merge walk and continue that run as `SYNC=merge` whatever the token. Otherwise the exact-head rows apply to every N (drop their `(N=1)` labels); a moved branch fails them, which is the correct stop.

Step 4 report: add `Rework base: <sha>` directly after `Base SHA:`; keep one `PR:`/`Pre-rework head:` pair per PR.

HARD CONSTRAINT carve-out (`brainstorming/SKILL.md`): replace "the base merge and each admitted member-head merge" with "the base sync (rebase or merge) and each member replay or merge" - one phrase swap.

`using-git-worktrees/SKILL.md` "Keeping a Worktree Current": replace "merge `origin/<baseRefName>`; never rebase it" with "sync per that reference".

### Record (`pr-subject.md`, `gatherer.md`, `spec-finalization.md`)

Rework record grammar: after `Base: ...` add `Rework base: <40-char sha>` (present after a successful rebase sync; absent for `merge:` records and until an incomplete rebase record's Task 1 persists it), then one `Member replay: #<N> <outcome>` line per member in listed order with outcome `<first7>..<last7>` (first and last replayed commit), `empty` (every commit already applied), `(already landed)` (recovery), `unresolved - <files>`, or `pending` (not attempted after an earlier stop). Gather supplies these lines: `pr-subject.md` scout inputs and `gatherer.md:138-141,234` replace `Member merge:`/`Merge result:`/"member merges and base merge" with `Member replay:`/`Sync result:`/"member replays and base sync". `spec-finalization.md:22` "merge result" becomes "sync result, rework base, and member replay lines". The unresolved continuation sentence (`pr-subject.md:95`) reads `rebase onto origin/<base> and resolve <files>` or `replay #<N> onto home and resolve <files>` (the merge wording for `merge: unresolved`).

### Plan (`writing-plans/SKILL.md:189`)

Key Task 1 on the record's form: `merge: unresolved` keeps today's merge Task 1 and "preserve the original commits"; `sync: unresolved - <files>` makes `git rebase --no-rebase-merges origin/<base>` plus resolving `<files>` Task 1; `Member replay: #<N> unresolved - <files>` makes replaying #<N> plus resolving `<files>` Task 1. In both rebase forms Task 1 also replays every `pending` member in listed order, runs `git update-ref refs/gauntlet/rework-base/pr-<home> HEAD`, and amends the record with `Rework base: <sha>` and the final `Member replay:` outcomes through the amendment path; finishing is not allowed before that.

### Finishing (`finishing-a-development-branch/SKILL.md`)

Mode: `Rework base:` present = rebase mode. `Base:` in `merge:` form (records written before this change and `merge-forward` runs) = merge mode: today's proofs, non-force push, closure test, and closure text verbatim. A rebase record without `Rework base:` (`sync: unresolved` or an `unresolved`/`pending` member) stops before the menu with `rework sync incomplete for PR #<home>: no Rework base recorded; finish Task 1 first.` and never routes to merge mode.

Preflight row 1 (rebase mode): proof `git merge-base --is-ancestor <Rework base> HEAD`, run once; stop text `PR branch history was rewritten: <sha7> is not an ancestor of HEAD; the rework must restart from the recorded rework base.` Row 2 (origin ancestry) applies only in merge mode; in rebase mode decide the push form from `origin/<headRefName>` after the fetch: equal to `PRE_REWORK_HEAD` -> lease push; a descendant of `Rework base` and an ancestor of HEAD (a previous successful row 1) -> non-force push; anything else -> withhold row 1 with `push withheld: origin/<headRefName> moved past <PRE_REWORK_HEAD7>`. Recompute on every menu return.

Row 1 push: keep the `update-ref refs/gauntlet/pre-rework/pr-<N>` block only for refs `git -C "$WORKTREE" rev-parse -q --verify` cannot find (records provisioned before this change); skip refs provisioning already wrote. Push `git -C "$WORKTREE" push --no-follow-tags --force-with-lease=<home headRefName>:<PRE_REWORK_HEAD> origin HEAD:refs/heads/<home headRefName>` for the lease case, today's non-force form otherwise. A refusal naming the lease (`stale info`) returns to the menu with row 1 withheld as above; no retry, no reset. Any other rejection takes today's rejected-push path.

Thread-fix count range: `<Rework base, else merge-sha, else PRE_REWORK_HEAD>..HEAD`.

`Before:` line: `Before: <PRE_REWORK_HEAD> (local ref `refs/gauntlet/pre-rework/pr-<N>` in the rework checkout)` - drop "stays on origin because the push was not forced".

Closure eligibility (line 290), rebase mode: require state `OPEN`, current `headRefOid` equal to the recorded pre-rework head (else `#14 skipped: head moved to <sha7>`), and the recorded `Member replay:` outcome validated against the pushed home head - `<first7>..<last7>`: `git -C "$WORKTREE" merge-base --is-ancestor <last7> <pushed home head>` exit 0; `empty` or `(already landed)`: `git -C "$WORKTREE" cherry <pushed home head> <pre-rework head>` prints no `+` line. Keep today's ancestry test in merge mode and the immediate post-approval identity recheck in both.

Closure comment, rebase mode: `Reworked into #12 (<home url>) by the gauntlet; this PR's commits are replayed there as <first7>..<last7>.`; for `empty` or `(already landed)`: `Reworked into #12 (<home url>) by the gauntlet; this PR's commits are already contained there.` Keep today's text in merge mode.

Quick Reference row `PR row 1. Push to PR branch`: Push column `yes (lease; non-force for merge records)`.

Red Flags: keep line 474 `Force-push without explicit request`; replace only line 475 with `Force-push a PR-subject rework without `--force-with-lease=<headRefName>:<PRE_REWORK_HEAD>`, or retry after a refused lease`.

### Handoff and resume

`gauntlet-handoff/SKILL.md` and `gauntlet-resume/reference/brief-contract.md`: one optional `Rework base: <40-char sha>` line after the PR pairs, copied from the record. `reconstruction.md` "Candidates": use `Rework base:` as `<base>` when present, else the first pre-rework head.

### Docs

`README.md:39`: home is rebased onto the fetched base and member commits replay onto it in listed order (`merge-forward` as the first intent word keeps the merge path); an unresolved conflict after its scoped helper aborts that step and continues to the spec with the repair as Task 1; "without member merges" becomes "without member replays"; the carve-out sentence becomes "the base sync (rebase or merge), each member replay or merge, their conflict helpers' edits to the conflicted files, and their scoped conflict tests". `README.md:45`: row 1 is a lease push of the rebased branch (`merge:` records push non-force); drop "proves every recorded original head remains an ancestor, preserves history". `README.md:78` unchanged (gatekeep). `CHANGELOG.md` `## Unreleased` entry.

### Out of scope

The spec-only draft PR route (both `spec-pr.md` files), gatekeep-pr's sync and fix-wave, an overrides or settings key for the sync mode, rewriting member branches on origin, and a replay-selection algorithm for members stacked on other admitted PRs. PR branches that carry merge commits linearize: `--no-rebase-merges` on both commands overrides `rebase.rebaseMerges`.

## Errors and edge cases

| Case | Behavior |
|---|---|
| Helper fails or leaves residue during home rebase | `rebase --abort`, restore assertions, `sync: unresolved - <files>`, members `pending`, continue on the saved pre-attempt home tip, Task 1 = rebase |
| Helper fails during member replay | `rebase --abort`, `checkout <home headRefName>`, restore assertions against the rebased home tip, `Member replay: #<N> unresolved - <files>`, later members `pending`, Task 1 = replay of that member |
| Restore assertion fails | today's stop text naming PR, files, worktree, branch, HEAD, abort exit, status paths, last-good SHA |
| Head already contains `origin/<base>`, nothing ahead | `sync: no-op`; rework base = pre-rework head |
| Commit dropped as already applied (prior merge-from-base, cherry-pick) | not an error; a member whose every commit drops records `Member replay: #<N> empty` |
| Member stacked on another admitted PR | shared commits replay again from `BASE_SHA`; equivalents drop, a textual clash with home's later commits takes the conflict-stop path - accepted |
| `merge-forward` with N>1 | today's member-merge path and recovery walk |
| Existing worktree with a rebase in progress | stop: `worktree <path> has a rebase in progress; finish or abort it by hand` |
| Existing worktree, `rework-base` ref present | recovery keyed on it forces `SYNC=rebase` even with `merge-forward`; `cherry` decides landed vs replay; mismatch -> today's "carries commits beyond ... resolve by hand" stop |
| Existing worktree, ref absent, canonical member-merge subjects on the tip | today's merge walk; run continues as `SYNC=merge` |
| Existing worktree, ref absent, no merge subjects | exact-head checks for every N; a moved branch stops |
| Second finish after a successful lease push | origin descends from `Rework base` and is an ancestor of HEAD -> non-force push; otherwise withheld |
| Lease refused at finish | row 1 withheld with the moved-past reason; rows 2-6 remain; no retry, no reset |
| Push rejected by server policy (branch protection) | today's "report once, skip body edit and closure" path; not detected ahead of time |
| Record in `merge:` form | pre-rework proof and non-force push as today |
| Rebase record without `Rework base:` | stop: `rework sync incomplete for PR #<home>: no Rework base recorded; finish Task 1 first.` |

## Tests

- Home rebased with `--no-rebase-merges` (input head carries a merge commit, `rebase.rebaseMerges` enabled), straight first-parent history, `rebased: <pre7>..<new7>` record line, `Rework base:` in report - `eval/using-git-worktrees/samples/pr-head-base-rebase` (new; `pr-head-base-merge` becomes the `merge-forward` sample)
- Members replayed in listed order, no merge commits, origin member branches untouched, one `Member replay:` line per member including an `empty` member - `pr-list-member-replay` (replaces `pr-list-member-merge-order`)
- Home-rebase conflict repaired by helper, `GIT_EDITOR=true git rebase --continue`, scoped tests recorded - `pr-head-rebase-conflict-repaired` (new)
- Failed helper during home rebase: abort, restore assertions, `sync: unresolved`, members `pending`, Task 1 wording - `pr-head-rebase-conflict-unresolved` (new)
- Member replay conflict repaired; member replay failed: abort, `checkout <home>`, assertions against the rebased tip, `Member replay: #<N> unresolved`, later members `pending` - `pr-list-member-conflict-repaired`, `pr-list-member-conflict-unresolved` (expected rewritten, kept)
- `merge-forward` token stripped before scout, merge path taken - `pr-head-merge-forward` (using-git-worktrees, renamed from `pr-head-base-merge`) and `pr-subject-merge-forward` (brainstorming)
- Interrupted recovery keyed on `rework-base` forces rebase even with `merge-forward`; `cherry` decides landed/replay; a home conflict restores and validates the recovered pre-attempt tip; in-progress rebase stop; merge-subject tip takes the merge walk without the token - `pr-list-interrupted-recovery` (expected rewritten)
- Lease push form, `Before:` wording, replayed-range closure comment, `empty` member comment, pre-rework ref not rewritten when present, second finish after success pushes non-force - `pr-subject-push`, `pr-list-push-and-close` (expected rewritten)
- Replayed member eligible on live-head equality plus `<last7>` ancestry; advanced member skipped as `head moved` - `pr-list-member-advanced` (expected rewritten)
- Lease refused -> row 1 withheld, reason text, no retry - `eval/finishing-a-development-branch/samples/pr-subject-lease-refused` (new)
- `merge:` record -> non-force push, pre-rework proof, finish writes the missing pre-rework ref; rebase record without `Rework base:` -> incomplete stop - `pr-subject-push-legacy-record` (new)
- Spec-only route unchanged through provisioning (both classifier rows provision with `SYNC=merge`, judge "base merge") and header-linked finish - `eval/brainstorming/samples/spec-pr-unmarked`, `spec-pr-regate`, `eval/finishing-a-development-branch/samples/spec-pr-menu` (existing, pass unchanged)
- Plan Task 1 for `sync: unresolved` and `Member replay: #<N> unresolved` replays pending members and persists `Rework base:` - `eval/writing-plans/samples/pr-subject-sync-repair` (new)
- Brief carries `Rework base:`, reconstruction diffs from it - `eval/gauntlet-resume/samples/pr-subject-brief`, `pr-list-brief` (expected rewritten)
- Branch-protection refusal - none: live forge state, not reproducible in an eval
- Deterministic: `scripts/brainstorming-contract.test.mjs` blocks rewritten, not appended - section markers and order (`## Sync onto the fetched base` replaces the two merge headings; `rebase --abort` joins the targeted-command list; the helper block slices from `## Sync onto the fetched base` to `## Fetch unresolved review threads`), the carve-out phrase in `brainstorming/SKILL.md`, `pr-head.md`, and `README.md`, gatherer `Member replay:`, the per-outcome post-sync validation in place of the every-head proof test; `scripts/brief-contract-lint.test.mjs` for the `Rework base:` line; `npm test` green

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` "What a run looks like" steps 1 and 5 (major procedures: provisioning rebases and replays, `merge-forward` is the opt-out, row 1 is a lease push of a rebased branch); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: none

Materiality bar: `reference/documentation-impact.md`.

## Open questions

none
