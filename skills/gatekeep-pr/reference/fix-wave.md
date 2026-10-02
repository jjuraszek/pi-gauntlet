# gatekeep-pr: fix wave

Read from `post-selection-loop.md` `### Fix wave` once the payloads for a `fix` pick are selected. Input: the selected payloads (`findings.md` `## Drafted payloads`), the pre-wave findings list, and the digest. Output: pushed commits with current evidence, or unpushed commits with the menu re-rendered. The orchestrator edits no tracked file and runs no git write other than `fetch`, `merge --ff-only`, and `push`; every edit and every commit belongs to a fresh helper (`../SKILL.md` `## Harness notes`).

## Conflicts

Record `pre_wave_head` as `git -C <worktree> rev-parse HEAD` before the first `## Conflicts` check.

Run before the first wave commit and again before the push:

```bash
git -C <worktree> fetch origin <baseRefName>
git -C <worktree> merge-tree --write-tree origin/<baseRefName> HEAD   # read-only; exit 0 = clean, exit 1 = conflict; any other exit: report it verbatim and re-render the menu without fix (at the pre-push check: also without push, commits stay unpushed)
```

This local check stands in for the remote `mergeable` field inside the wave: the remote stays `CONFLICTING` until a resolution is pushed, so only the local tree can show that a `merge base` round resolved it. `gh pr view --json mergeable` keeps its place in the merge preconditions (`post-selection-loop.md`).

On a conflict, the conflict menu replaces the step. Each row carries its precondition in its consequence clause; a row whose precondition fails is omitted and named in the compose line's `Not offered:` sentence (`decision-menu.md`):

1. `update branch` - `gh pr update-branch <N>`; only when no wave commit exists and `can_update_branch` is true. Afterwards run `git -C <worktree> fetch origin refs/pull/<N>/head && git -C <worktree> merge --ff-only FETCH_HEAD`; the head-move rule then refreshes the digest and the ledger (re-enter step 3). Report an error from `gh pr update-branch` (a conflict the forge cannot merge, or a 403) verbatim and re-render the menu without that row.
2. `merge base` - one fresh implementer helper merges the just-fetched `origin/<baseRefName>` into the branch and resolves the conflicts in one commit; the wave then continues with the selected payloads, and that merge commit joins the round's single `## Review before push` - its delta is given under `## Fix delta` as `git show --remerge-diff <merge-sha>` instead of the range diff - and consumes no extra round; only when `head_pushable` is true. When picked at the pre-push check, dispatch one fresh reviewer over `git show --remerge-diff <merge-sha>` alone, gate the push on it as in `## Review before push`, and count no extra round. When that reviewer reports Critical or Moderate, the commits stay unpushed and `push` is omitted as `push (reviewer blocked the wave)`.
3. `reply` - post the drafted text "conflicts with <baseRefName>, please update".
4. `stop` - leave the PR as-is.

A worktree holding unpushed wave commits never shows `update branch`. The orchestrator resolving a conflict itself is a red flag (`../SKILL.md`).

## Wave

`pre_wave_head` was recorded before the first `## Conflicts` check. A round is one pass over the open payloads plus one `## Review before push`. The round cap is `closureReview.maxFixRounds`, read with `gauntlet_setting({ key: "closureReview" })` when that tool exists, else 3; a cap of `0` omits `fix` from the menu, named as `fix (maxFixRounds is 0)` in the `Not offered:` sentence. The round count is per run; at the cap `fix` is omitted, named `fix (round cap reached)` in `Not offered:`.

For each payload in review order, dispatch one fresh implementer helper with `cwd` the PR worktree. Its task holds:

- the finding's evidence pack (`findings.md` `## Drafted payloads` shape) and the instruction to apply the consented payload - or, for a reviewer finding that has no drafted payload, the reviewer's finding text - never to re-solve the finding;
- the scoped test commands: the test it writes, or the test file the payload touches - never the resolved `verification command`;
- the commit rule: commit on the PR branch only when the scoped test passes, one commit per payload, subject naming the fix; otherwise discard its edits (`git checkout -- <its files>`, remove files it created) and return `open - <why>`;
- the report shape: the scoped test's failing run before the edit and passing run after it; a doc-only payload with no test reports `no scoped test` and its diff, and the reviewer below is its only gate.

After each helper returns, read `git -C <worktree> status --porcelain` and `git -C <worktree> rev-parse HEAD`. A `done` return shows exactly one new commit and a clean tree; an `open` return shows no new commit and a clean tree. Any other state - staged, unstaged, or untracked residue, or a moved HEAD on `open` - stops the round: dispatch no further implementer, and re-render the menu naming the files and the payload. An `open` payload is never reported as fixed, whatever the reviewer reports. The orchestrator never commits, resets, or checks out files.

## Review before push

When HEAD equals `pre_wave_head` after a round (every payload returned `open`), skip the review and the push and re-render the menu with the `open` reasons.

After the round's payloads, dispatch one fresh reviewer helper, `cwd` the PR worktree, read-only, over `<pushed_head>..HEAD`, where `pushed_head` is the digest's `headRefOid` (the remote head), so commits a previous round left unpushed are always inside the reviewed range; `pre_wave_head` serves only the empty-round test. Its task carries the pre-wave findings list, numbered with this skill's finding ids, under `## Previous review report (re-review trigger)`, and the output of `git diff <pushed_head> HEAD` under `## Fix delta`, and asks for the reviewer's native report plus one closure line per pre-wave finding, accepted anywhere after the findings list: `<finding id>: resolved` or `<finding id>: open - <why>`. When the round holds a `merge base` commit, `## Fix delta` is `git diff <pushed_head> <merge-sha>^1`, then `git show --remerge-diff <merge-sha>`, then `git diff <merge-sha> HEAD`. Ignore a `TRAJECTORY:` line in the report.

Mark a finding resolved only from a `resolved` closure line; the orchestrator never marks one. Push only when the report has no Critical or Moderate finding. Otherwise re-dispatch implementers with the report verbatim for the `open` payloads and the new Critical or Moderate findings - one more round, up to the cap. At the cap, the commits stay unpushed on the PR branch; the menu re-renders with the reviewer's verdict line and its Critical and Moderate titles, and `push` is omitted, named as `push (reviewer blocked the wave)` in the `Not offered:` sentence.

## Evidence after push

Run `## Conflicts` once more, then push to the recorded destination: `git -C <worktree> push --no-follow-tags <head_url> HEAD:refs/heads/<head_ref>`. Report a rejected push verbatim and re-render the menu with the commits unpushed.

Poll the pushed head only, every 30 seconds for up to `timeout minutes` (default 15): `gh pr view <N> --json headRefOid,statusCheckRollup` and `gh run list -R <base-owner>/<base-repo> -c <head> --json databaseId,status,conclusion`. A moved `headRefOid` stops the poll and takes the head-move rule (re-enter step 3, `post-selection-loop.md` intro). Normalize first: a `CheckRun` is terminal at `status: COMPLETED` with its `conclusion`; a `StatusContext` maps `state` `SUCCESS` to success, `FAILURE` and `ERROR` to blocking, `PENDING` and `EXPECTED` to pending; apply the `ci checks` filter and the reviewer-check exception (`../verification-brief.md` Section B) before the table.

Resolve the normalized set through `../verification-brief.md` `## Section B - Verifier` (Evidence resolution) - the same table the first pass uses. When the re-resolve moves the evidence from `source: pending` to CI-sufficient (an approved held run went green, or a `wait` ended), dispatch a fresh Section B helper in claim-check-only mode (`../verification-brief.md` Section B) before rendering the menu. `approve workflow run` executes `gh api --method POST repos/<base-owner>/<base-repo>/actions/runs/<id>/approve`, then re-polls. The evidence block records the outcome and, when a local-run row fires, dispatch a fresh Section B helper; the evidence block records which trigger fired: `local run: no conclusive check`, `local run: held run not approvable`, or `local run: local verification: always`.

Then run the own-push sequence of `post-selection-loop.md` `### Re-render`: the comment refetch and reconciliation, a fresh reviewer helper for any eligible comment delta, and the menu rendered from the closure lines for the exact pushed SHA. No claim re-check and no whole-wave review runs after an own push.
