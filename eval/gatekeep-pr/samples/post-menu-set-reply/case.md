# Case: post-menu-set-reply

## Entry

Override replay.md's command narration and first-menu stop. Start from the already-rendered post menu below. Replay each labeled input independently from that same saved state, except G's two consecutive inputs and the stated H, K, L and M variants. Under each label, narrate the resulting operations and render the response, including any question, inspection menu or closing message. Do not replay assessment, sync absence, or menu construction before the input. All observations below are completed reads; do not use tools. Keep the whole answer under 1900 words.

## Saved state

This run merged PR 642 in sample/forge-kit at 7d8e9f0 after assessing head 9c1e4f29c1e4f29c1e4f29c1e4f29c1e4f29c1e4f2. It is not a PR set. The stored target, body and base main remain unchanged; all record and pre-write checks pass. No steps have been picked or run. The two drafted replies and AC coverage passed source and wording review; their files are retained. The head assessment had zero blockers, one fixed nit, rounds_used 1 of rounds_cap 3 and syncs_used 0 of syncs_cap 3. No issue, PR-named after-merge action or cleanup override exists.

The primary /work/forge-kit is tracked-clean on maintenance. The gate-created worktree /work/forge-kit/.worktrees/health-version is tracked-clean and has no unmerged work or custom destroy command. Its local branch health-version is unused elsewhere. Worktree removal and branch deletion pass their guards; pulling main is skipped because the primary is on maintenance. Selected operations succeed except the explicit K failure and L nested-skill pause. Every closing response lists available steps not run, including retained payload or worktree paths; say none when all ran.

Drafted reply 1 answers robin's startup-cache question: "The build version is read once at startup and reused for each request." Its file is /tmp/gate-reply-1.md and its command is `gh api --method POST repos/sample/forge-kit/pulls/642/comments/81/replies -F body=@/tmp/gate-reply-1.md`.

Drafted reply 2 answers lee's empty-version question: "An empty build version returns unknown." Its file is /tmp/gate-reply-2.md and its command is `gh api --method POST repos/sample/forge-kit/pulls/642/comments/82/replies -F body=@/tmp/gate-reply-2.md`.

The coverage block in /tmp/gate-coverage.md records one covered spec requirement: the health endpoint responds with the build version. Post it using `gh pr comment 642 -R sample/forge-kit --body-file /tmp/gate-coverage.md`.

The persisted post_steps mapping and menu shown to the human were:

gauntlet: gate=gatekeep-pr/own-merge recommended=1

I recommend both replies, the PR checklist and cleanup because all four have work ready to run.

Pick one, or several separated by commas:
1. post both replies, post coverage to PR, cleanup - rows 2, 3, 4 and 5. [recommended]
2. post drafted reply 1 - answer robin in thread 81 using /tmp/gate-reply-1.md.
3. post drafted reply 2 - answer lee in thread 82 using /tmp/gate-reply-2.md.
4. post coverage to PR - comment /tmp/gate-coverage.md on PR 642.
5. cleanup - remove /work/forge-kit/.worktrees/health-version, prune and delete local branch health-version; skip pulling main because the primary is on maintenance.
6. stop - run nothing and retain the unpicked payloads.

Type a number; show evidence prints the full record.

## Independent inputs

A. The human replies `2,4`.
B. The human replies `1,5`.
C. The human replies `reply 2`. This is drafted reply 2 (thread 82), not menu row 2 (drafted reply 1).
D. The human replies `show evidence`.
E. The human replies `6`.
F. The human replies `2,6`.
G. The human replies `99`, then replies `99` again to the response. Stop after the second response.
H. Independently, the PR is still OPEN after this run approved head 9c1e4f2; no merge has occurred. The approved post menu offers only drafted reply 1 as row 1 and stop as row 2. The human picks 1. Its required freshness re-read observes new head aabbccdd, with the saved body and base unchanged. Post nothing; record skipped - head moved, retain the reply body and settle approved without re-entering assessment or another menu. Do not copy the merged variant's freshness exemption.
I. The human replies `1,2,3,4,5`; deduplicate every expanded step.
J. The human replies `stop,2`; this is invalid just like F, not a partial selection.
K. The human replies `2,4`. Posting reply 1 fails with HTTP 403 before creating a comment; its body file remains. Coverage posting then succeeds. Run neither reply 2 nor cleanup, and close merged with the failed step and not-run list.
L. The saved post mapping instead offers row 1 "coverage, cleanup, close ticket, release, notify" [recommended] (rows 2-6), row 2 coverage, row 3 the worktree/branch cleanup, row 4 `gh issue close 45 -R sample/forge-kit`, row 5 `/skill:release`, row 6 `/work/forge-kit/scripts/notify-release.sh`, row 7 stop. Rows 4-6 are resolved, scoped merge-base cleanup overrides in that order. Every guard passes; the human picks 1. Coverage, worktree cleanup and ticket closure succeed, then release asks its own level question. Render that nested question and pause without done or claiming release/notify completed. After the supplied nested success, run notify once, then close merged with the not-run list, without another post menu or gatekeep-pr question.
M. Independently, merge --auto was accepted and verified still OPEN and queued; no merged SHA exists. The saved merge-queued menu offers row 1 wait and row 2 stop, and the human picks 2. Retain every payload and worktree, execute no replies, coverage or cleanup, render no post menu and emit gauntlet: done merge-queued; list those pending steps as waiting for the merge.
