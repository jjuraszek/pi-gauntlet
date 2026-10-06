# Expected facts: no-flag-unchanged

- f1: Without `--rebase` the orchestrator runs no additional fetch, rebase, or push before the menu (the digest is the `conflict-free-sync` one).
- f2: The tracker is initialized with three stages (gather, provision, verify), not four.
- f3: Verification runs on the digest's head SHA as the assessed head.
- f4: No `Sync:` line is rendered before the verdict.
