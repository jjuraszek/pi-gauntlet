# gatekeep-pr: step 2b - sync (`--rebase [base]`)

Read from SKILL.md step 2b, only when `--rebase` was passed. Input: the step-1 digest, the provisioned worktree, and the base name (`<base>` = the argument's value, else `baseRefName`; `--rebase release-1.x` rebases onto `origin/release-1.x`). Output: the worktree on the rebased, pushed head with a refreshed digest, or a `sync` record and the unsynced head. The sync runs once per invocation; a loop re-entry never returns here. This file is self-contained: `fix-wave.md` is the post-menu contract and is not loaded here; `assessment.md` owns step 2.

## Permitted orchestrator git writes

`git fetch origin <base>`, `git rebase origin/<base>`, `GIT_EDITOR=true git rebase --continue`, `git rebase --abort` (only while a rebase this step started is in progress), `git reset --hard <pre_head>` (only after that rebase completed, to restore the recorded SHA), and the lease push below. No `add`, no `commit`, no `rebase --skip`, no edit to a tracked file, and no `--continue` while `git diff --name-only --diff-filter=U` is non-empty. Every command runs as `git -C <worktree> ...`.

## Preconditions

Check in order after step 2. A terminal stop - here, at `## Baseline`, or at `## Push` - closes the `sync` stage `failed`, prints the reason, offers `stop` and `show evidence` only, and runs no step 3; on such a stop `show evidence` prints the digest's head-dependent fields and the `sync` record.

1. The harness has a helper facility (SKILL.md `## Harness notes`); none -> terminal stop before any write: `sync: stopped - no helper facility for conflict resolution and review`.
2. `permissions.head_pushable` is `true`; `false` or `unreadable` -> terminal stop naming the reason; no rebase, no push.
3. `origin/<base>` exists after `git fetch origin <base>`; missing -> terminal stop with one line naming the missing ref.
4. `git merge-base --is-ancestor origin/<base> HEAD` exits 1 (the head is behind); 0 -> `sync: no-op - head already contains origin/<base>`, stage `complete`, continue to step 3 with no push and no review; any other exit -> terminal stop quoting it.
5. `git rev-list --merges origin/<base>..HEAD` prints nothing; a head holding merge commits is not rewritten -> `sync: skipped - head contains merge commits`, stage `skipped`, continue to step 3 unsynced.

The fetch in precondition 3 is the only git write that may precede the confirmation below.

A reused worktree holding local-only commits or a foreign in-progress operation never reaches this step: step 2's provisioning stop (`assessment.md`) fires first.

## Baseline

Refresh `headRefOid` with `gh pr view <N> --json headRefOid` and set `<pre_head>` = `git -C <worktree> rev-parse HEAD`. The two must agree; a mismatch is a terminal stop (stage `failed`) naming both SHAs (the remote moved during provisioning).

## Other-author confirmation

When `pr.author.login` differs from `gh api user --jq .login`, or that login is `unreadable`, print one explanation before any rewrite: the rebase replays the author's commits under new SHAs (authorship stays; the committer becomes this checkout's local git identity), review comments anchored on the old commits may render as outdated on the forge, and branch protection may dismiss existing approvals. Then ask for a yes. Any other reply -> `sync: declined - other author's branch`, stage `skipped`, step 3 runs unsynced. A yes covers the whole sync (rebase, helper commits, review, lease push, and any restore). Same-author PRs run on `--rebase` alone.

## Rebase

`git -C <worktree> rebase origin/<base>`. A non-zero exit with no unmerged paths (`git diff --name-only --diff-filter=U` empty) takes `## Failure path`. A non-zero exit with unmerged paths is a conflict stop.

## Conflict stop

One fresh `implementer` per stop, sequential, `cwd` the PR worktree, dispatched per SKILL.md `## Harness notes` (pi: the `implementer` persona; Claude Code: the sync conflict-stop duty). Before dispatch, record the stop's `git status --porcelain` (the clean replays git already staged belong to it) and the conflicted file list. Resolve `SCOPED_TEST_COMMANDS` yourself: the resolved `verification command` from the configuration ladder (`assessment.md` `## Configuration`) followed by the paths of the test files among the stopped commit's changed files when the ladder documents a file-scoped form, otherwise `none`. The task carries the conflicted file list, the stopped commit (`git rebase --show-current-patch`), the base being rebased onto, `SCOPED_TEST_COMMANDS`, and this rule verbatim: "resolve every listed file so both sides' intent survives, run exactly the supplied scoped test commands and report each result (or report that none were supplied), `git add` each resolved file, return `done` with the list of files you changed; never run `git rebase --continue`, `git rebase --abort`, `git rebase --skip`, or `git commit`; never edit a file outside the list".

Continue (`GIT_EDITOR=true git rebase --continue`) only when the helper returned `done` with the scoped results, `--diff-filter=U` is empty, every listed file is fully staged, and `git status --porcelain` differs from the recorded snapshot only in the listed files; a non-zero `--continue` with unmerged paths is the next conflict stop; without unmerged paths it takes `## Failure path`. Anything else (`open`, residue outside the listed files, unmerged paths left) takes `## Failure path`. One attempt per stop, no round counter; the fix-round cap (`closureReview.maxFixRounds`) is untouched. Resolved file names accumulate across stops.

## Review before push

Runs on every rewritten head, with or without a stop; only a `no-op` skips it. One fresh `code-reviewer`, `cwd` the PR worktree, read-only, dispatched per SKILL.md `## Harness notes` (Claude Code: the sync review duty), over `git range-diff origin/<base> <pre_head> HEAD` and, when stops were resolved, `git diff <pre_head> HEAD -- <resolved files>`; the task asks for the reviewer's native findings report with "rebase replay and conflict resolutions" as the review subject and no closure lines. A Critical or Moderate finding takes `## Failure path`; no second helper.

## Push

`git -C <worktree> push --no-follow-tags --force-with-lease=<head_ref>:<pre_head> <head_url> HEAD:refs/heads/<head_ref>`. The destination is the digest's `head_url` and `head_ref` (the same destination `fix-wave.md` pushes to), never `origin`.

A refusal whose message names the lease (`stale info`, the remote head moved since `## Baseline`): restore `<pre_head>` with `git reset --hard <pre_head>`, assert `HEAD == <pre_head>` and a clean `git status --porcelain`, then terminal stop (stage `failed`, menu `stop` and `show evidence` only) with the reason and both SHAs. No retry. Any other rejection (server policy, branch protection) takes `## Failure path` with `push rejected: <first server line>`.

## Re-gather

Re-run every step-1 forge read for the PR (`../verification-brief.md` Section A fixed command set): `headRefOid`, `mergeable`, `mergeStateStatus`, `reviewDecision`, status checks and `actions_runs`, commits, changed files and diff, comments and reviews; the step-1 ticket reads are not repeated. Unreadable fields fail closed as in step 1. Re-resolve the configuration ladder (`assessment.md` `## Configuration`) at `git merge-base origin/<baseRefName> HEAD` - `baseRefName` stays the trust source even when `<base>` names another branch. Run no CI poll here: step 3's first pass is the single poll window (every 30 s for up to `timeout minutes`; a binding check still pending at the limit renders the `verification evidence pending` overlay (`../verification-brief.md` Section B, binding classification), never green, and a head with no check, or only not-binding pending checks, takes the `Fallback` row) and step 3 resolves the pushed head as any assessed head - the sync push is not an own push for `### Re-render` and the `Fix wave` row of Section B does not apply; a head that moves during that poll takes the existing head-move rule (`post-selection-loop.md` `### Re-render`), with step 2's divergence stop as the backstop. Red CI on the pushed head triggers no automatic fix: step 3 records the failing checks and the menu offers `fix` - `fix [recommended]` only when `decision-menu.md` and `../verification-brief.md` Section B make it `[recommended]`. Set the digest's `sync` field (`../verification-brief.md` Section A), close the `sync` stage `complete`, and enter step 3 with the refreshed digest.

## Failure path

Triggers: an unresolved stop, `open`, residue, a non-zero `rebase` or `--continue` without unmerged paths, a reviewer Critical or Moderate finding, a push rejected by server policy. Restore `<pre_head>`: `git rebase --abort` while the rebase is in progress, `git reset --hard <pre_head>` after it completed; assert `HEAD == <pre_head>` and a clean `git status --porcelain` - a mismatch is a hard stop with the error, never a silent continue. Record `sync: failed - <reason>` with reason one of `unresolved stop in <commit7>`, `implementer returned open`, `residue outside conflicted files`, `rebase failed: <first line>`, `reviewer: <top finding>`, `push rejected: <first server line>`. Close the `sync` stage `skipped` and continue to step 3 on the unsynced head; step 5's conflict rows (`update branch`, `merge base`, `reply`, `stop`) carry what remains.

## Sync record

The digest's `sync` field is one of: `rebased <pre_head7>..<new_head7> onto origin/<base>, <n> stop(s) resolved in <files>, <m> commit(s) dropped as already applied`, `no-op - ...` (short form `sync: no-op`), `skipped - ...` (`sync: skipped`), `declined - ...` (`sync: declined`), `failed - ...` (for example `sync: failed - reviewer: ...` or `sync: failed - push rejected: <first server line>`), `stopped - ...`. `report.md` renders it as the `Sync:` line immediately before `Verdict:`. `<m>` is `git rev-list --count origin/<base>..<pre_head>` minus `git rev-list --count origin/<base>..HEAD`; omit the stops clause when no stop occurred.
