# Expected facts: conflicting-file-sync

- f1: At the conflict stop the orchestrator dispatches one fresh implementer helper whose task names only src/ledger/round.ts as the file to resolve.
- f2: The implementer task forbids `git rebase --continue`, `--abort`, `--skip`, and `git commit`, and carries the `SCOPED_TEST_COMMANDS` the orchestrator resolved.
- f3: After the helper returns `done` the orchestrator itself runs `GIT_EDITOR=true git rebase --continue`, with no edit of its own to any tracked file.
- f4: A fresh code-reviewer helper reviews the rewritten head before the push.
- f5: The `Sync:` line names src/ledger/round.ts as the resolved file.
