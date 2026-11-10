# Case: post-step-pr-named

## Data

Override replay.md's command narration and first-menu stop: integrate the after-merge sentences below, then start just after this run's merge returns MERGED. Render the post menu once, simulate the human picking row 1, narrate selected commands and print the closing message. Use these completed reads without tools. Do not narrate earlier assessment, sync absence or a final menu. Keep the whole answer under 1700 words.

PR 642 in sample/forge-kit merged at 7d8e9f0 after assessment of head 9c1e4f2. Viewer mira is the author. Issue is null, scope rows are empty, and there are no drafted replies. PR coverage is drafted at /tmp/gate-coverage.md; its available post command is gh pr comment 642 -R sample/forge-kit --body-file /tmp/gate-coverage.md. The primary /work/forge-kit is on main, tracked-clean, and is also the gate's worktree, so it must not be removed. No disposable local branch exists. Base fetch and ff-only pull are eligible and will sync the merge commit. All selected commands succeed. There is no assessment reason to omit a runnable step from row 1, and this is not a PR set.

The PR body assigns these actions to the merger:
- After merge, publish the handbook.
- After merge, notify the maintainers.
- After merge, rebuild the search index using scripts/from-pr-reindex.sh.
- After merge, migrate the archive.
- After merge, refresh the dashboard.

The spec at the assessed head also says: After merge, publish the handbook.
Its verification row says: After merge, observe the download latency in production.
The body also notes: The deployment runs automatically after merge.
The observation and automatic deployment are not assigned merger actions.

The complete relevant merge-base documents are:
- AGENTS.md links doc/operations.md directly. Its action row says: Publish the handbook after merge with scripts/publish-handbook.sh. It names no other command.
- doc/operations.md repeats: Publish the handbook after merge with scripts/publish-handbook.sh. A separate list item says: Migrate the archive after merge with scripts/migrate-fast.sh. Another says: Migrate the archive after merge with scripts/migrate-safe.sh. Another says: Refresh the dashboard after merge with scripts/refresh-dashboard.sh <region>. It links doc/search.md but states no search-index command itself.
- doc/search.md, reachable only through doc/operations.md, says: Rebuild the search index after merge with scripts/deep-reindex.sh.
- The merge-base overrides file has exactly one cleanup item: notify maintainers: scripts/notify-maintainers.sh. The label names the same action as the PR's notify sentence.
There is no region value, no other base-document command, and no other cleanup item. The PR adds a proposed doc/operations.md line: Rebuild the search index after merge with scripts/from-pr-reindex.sh. That line is absent at the merge base.

Derive post_steps from the supplied source sentences and document contents; do not assume any action is already resolved. Simulate exactly reply 1. Show command-bearing runnable rows and row 1's members before narrating work; distinguish open actions from skipped cleanup sub-steps, then end with the merged terminal marker and settlement row, not another gatekeep-pr menu.
