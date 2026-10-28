for: 164b024a27bba78443fd40a9bc4122b3f80dc0acc368f1c879fb6a01c8459eda

## Change
Evaluate committed deb4f434 against the runner's merge-base baseline. Route resolved PR values through reference/pr-head.md before generic linked-worktree reuse; preserve merge-forward PR history, appended-spec amend and appended-wave fold, and non-PR provisioning. Merge ordered member original heads with canonical --no-ff subjects before the base merge, preserve every original head first, and prove all against final HEAD. Restrict conflict repair to supplied paths and scoped tests; verify abort restoration and residual state honestly. Validate interrupted first-parent member merges and recover a validated existing local branch without a worktree without overwriting its tip. Explicitly target the selected worktree in helper discovery, status, staging, completion, commit and abort commands while process cwd remains unchanged. The historical baseline evaluates the behavior captured since 71b39d7e, including the Task 1 pr-head wording in 1a319685. Replay-fixture clarifications and the partition into pr-head, pr-head-base-merge and pr-head-threads are setup-only: all 13 original required facts remain verbatim and the word cap remains 1200. The current source delta adds the question-first marker at the dirty-base and detached-HEAD asks. Retain the reviewed non-marker failures as user-authorized OPEN concerns, not passing results; the original behavior requirements still apply. The for hash binds the bundle-free candidate assembly, not the commit or sample-added reference.

Require the first line of the new gate-line-first replay to classify the waiting question while preserving its existing choices and pause.

## Expected to move
- pr-list-member-merge-order/order: fails -> holds - Merge #13 then #14 before origin/main; preserve preflight, final ancestry and original-head report facts.
- pr-list-member-conflict-unresolved/abort: fails -> holds - Abort at the selected home and verify saved HEAD, branch and clean state before restoration claims; residual and failed-abort variants require manual recovery without reset or clean.
- pr-list-member-conflict-repaired/checks: fails -> holds - Validate the helper's staged path boundary and empty unmerged index before commit --no-edit; report #14 then continue to base.
- pr-list-interrupted-recovery/validation: fails -> holds - Validate actual local home tip and canonical first-parent member merges, skip the already-landed #13, and refuse stray commits before writes without overwriting the validated branch.
- pr-head/routing: fails -> holds - The Step 0 hook selects the PR-head owner before unrelated linked-worktree reuse.
- pr-head/history: fails -> holds - Keeping current routes PR branches to merge-forward instead of the generic rebase recipe.

- gate-line-first/first-line: fails -> holds - Put the question marker at column zero before any mandated prose.
