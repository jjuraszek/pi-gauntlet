anonymized: true
- f1: judged: No CI watch runs between the push and the next rendered report.
- f2: judged: Between the push and the next report the orchestrator runs no `gh pr checks --watch` and at most one `gh pr view` and one `gh run list` read.
- f3: judged: The next menu offers `fix` for the open blocker and does not wait on CI.
