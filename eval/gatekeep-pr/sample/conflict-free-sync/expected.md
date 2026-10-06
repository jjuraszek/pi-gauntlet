# Expected facts: conflict-free-sync

- f1: Invoked with `--rebase release/2`, the orchestrator rebases the worktree onto `origin/release/2`, not origin/main, before any verification helper runs.
- f2: A fresh code-reviewer helper reviews the rewritten head (range-diff against the pre-sync head) before the push, even though no conflict occurred.
- f3: The push uses --force-with-lease with the head ref and the pre-sync head SHA, to the digest's head_url and head_ref.
- f4: No CI poll runs inside the sync; verification's own first pass resolves the pushed head's checks.
- f5: The narration states that verification and the brief use the pushed SHA as the assessed head, and a `Sync:` line is rendered immediately before the verdict.
