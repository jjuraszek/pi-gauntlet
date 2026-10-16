for: 2a265ad48b7fbfa5f1ec95f785f2fa128f1ac137b8f73aa3c25ef1660d200b2e

## Change
Terminal gatekeep-pr menus (own merge, approved, merged or closed at step 1) offer cleanup as row 1 recommended; the pick tears down the gate's worktree and local branch, fast-forwards the base, then runs the overrides file's ordered cleanup items with issue, pr, and merge-sha placeholders substituted and guarded steps skipped with a reason. stop under a terminal menu leaves the checkout as found and names it.

## Expected to move
