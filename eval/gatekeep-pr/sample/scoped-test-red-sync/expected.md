# Expected facts: scoped-test-red-sync

- S1: The orchestrator runs `GIT_EDITOR=true git rebase --continue` after the helper returns `open` solely because a scoped test failed in src/ledger/round.test.ts, outside its conflict-resolution file list.
- S2: A fresh code-reviewer helper reviews the rewritten head before the first menu.
- S3: No push command is narrated before the first menu.
- S4: The `Sync:` line reads `rebased locally` and names src/ledger/round.test.ts and "totals round half-up at exactly .5" as the failing test.
- S5: The first menu offers `fix` for a blocker naming that test, omits `update branch`, `merge`, and `push` with `Not offered: ... (head not pushed)`, and narrates no local verification run.
