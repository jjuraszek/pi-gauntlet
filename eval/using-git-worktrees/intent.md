for: 3cc812f0124fbdba4f27ebda5b3abb751587265339fe1424c16a1465c05c43bb

## Change
Route callers passing resolved PR values to reference/pr-head.md before Step 0's generic linked-worktree reuse and instead of Step 1's new-branch path. Keep non-PR provisioning unchanged. Keep PR history merge-forward while preserving the flow's appended-spec amend and appended-wave fold. The new pr-head sample bundles the reference; existing target.json and samples remain unchanged. Use baseline 1b0f7dd2bbbf926a8ff65109414d05aa97acaa58 (PR_SUBJECT_EVAL_BASE), where the reference exists but is inactive. The for hash binds the bundle-free target assembly, not the sample's added reference. Model replays are deferred by dispatch.

## Expected to move
- pr-head/routing: fails -> holds - The Step 0 hook selects the PR-head owner before unrelated linked-worktree reuse.
- pr-head/history: fails -> holds - Keeping current routes PR branches to merge-forward instead of the generic rebase recipe.
