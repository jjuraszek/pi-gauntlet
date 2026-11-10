# Case: post-menu-combined

## Data

Override replay.md's command narration and first-menu stop: start just after this run's merge returns MERGED, render the post menu once, simulate the human picking row 1, narrate only the selected steps, then print the closing message. Do not narrate earlier assessment, sync absence or a final menu. Use the supplied observations as completed reads; do not use tools. Keep the whole response under 1600 words.

PR 642 in sample/forge-kit merged at 7d8e9f0 after assessment of head 9c1e4f2. Viewer mira is the author. Scope comes from doc/specs/health-version.md and has one covered row: The health endpoint responds with the build version. Issue is sample/forge-kit#91; its tracker posts comments with gh issue comment 91 -R sample/forge-kit --body-file /tmp/gate-coverage.md. The coverage payload is already drafted at /tmp/gate-coverage.md. The PR copy uses gh pr comment 642 -R sample/forge-kit --body-file /tmp/gate-coverage.md. Neither copy has been posted.

One source-reviewed, replyable question from robin asked whether the version is cached at startup. Drafted reply 1 at /tmp/gate-reply-1.md says: The build version is read once at startup and reused for each request. It was drafted before merging and never posted. Its resolved thread-reply command is gh api --method POST repos/sample/forge-kit/pulls/642/comments/81/replies -F body=@/tmp/gate-reply-1.md. Thread replies are allowed after merge.

The primary is /work/forge-kit, currently on maintenance and tracked-clean. The gate created /work/forge-kit/.worktrees/health-version on local branch health-version. That worktree is tracked-clean, carries no commits outside the assessed head's history, matches the configured home and has no custom destroy command. Removing it and deleting its branch are eligible. No other worktree holds that branch. Base main cannot be pulled because the primary is on maintenance. Cleanup must not switch it. The branch deletion becomes eligible after the removal succeeds.

The merge-base overrides file has exactly two cleanup items, in this order:
- notify: gh issue comment 91 -R sample/forge-kit --body "Health version merged."
- release: /skill:release patch

The notification needs no local merged change and all its guards pass. Release needs a synced local base and is fully skipped because the primary is on maintenance. There are no PR-named after-merge actions and this is not a PR set. All selected posts, worktree removal, prune, branch deletion and notification succeed. No step has an assessment reason to omit it from the recommendation; prefer the ticket coverage copy to the duplicate PR copy.

Simulate exactly the numeric reply 1 after the menu. Report its work, preserve the unposted PR coverage payload, and end with the existing merged terminal marker and settlement row, not another gatekeep-pr menu.
