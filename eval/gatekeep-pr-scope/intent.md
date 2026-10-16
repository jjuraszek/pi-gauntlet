for: bbcaa0f9395c0ffb9f9c9bb69ea3bd532d67d6d597cef86741b7d6a62f22cd71

## Change
Terminal gatekeep-pr menus (own merge, approved, merged or closed at step 1) offer cleanup as row 1 recommended; the pick tears down the gate's worktree and local branch, fast-forwards the base, then runs the overrides file's ordered cleanup items with issue, pr, and merge-sha placeholders substituted and guarded steps skipped with a reason. stop under a terminal menu leaves the checkout as found and names it.

## Expected to move
- post-merge-menu/f1: fails -> holds - cleanup is row 1 recommended, stop last.
- post-merge-menu/f5: fails -> holds - stop names the leftover worktree.
- post-merge-menu/f6: fails -> holds - a post re-renders without teardown.
- cleanup-null-issue/f1: fails -> holds - null issue skips the close step.
- cleanup-null-issue/f2: fails -> holds - base pull runs ff-only.
- cleanup-null-issue/f3: fails -> holds - release invoked without a level.
- cleanup-null-issue/f4: fails -> holds - worktree removed, branch -D run.
- cleanup-null-issue/f5: fails -> holds - cleanup row gone, show evidence kept.
- cleanup-after-approve/f1: fails -> holds - approved overlay renders cleanup.
- cleanup-after-approve/f2: fails -> holds - landed-change guard skips release and merge-sha items.
- cleanup-after-approve/f3: fails -> holds - no branch delete before merge.
- cleanup-merged-at-step-1/f1: fails -> holds - merge SHA from the step-1 digest.
- cleanup-merged-at-step-1/f2: fails -> holds - reused landed worktree removed.
- cleanup-merged-at-step-1/f3: fails -> holds - issue number stripped of #, arguments separate.
- cleanup-closed-unmerged/f1: fails -> holds - no release on a closed PR.
- cleanup-closed-unmerged/f2: fails -> holds - no branch delete.
- cleanup-closed-unmerged/f3: fails -> holds - base step skipped.
- cleanup-no-section/f1: fails -> holds - git-only consequence clause.
- cleanup-no-section/f2: fails -> holds - only steps 1-3 run.
