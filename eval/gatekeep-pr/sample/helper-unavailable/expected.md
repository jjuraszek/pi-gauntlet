# Expected facts: helper-unavailable

- f1: The orchestrator stops before any rebase, push, or fetch because the harness has no helper facility.
- f2: The stop names the missing helper facility as the reason and records the sync stage as failed.
- f3: No verification helper is dispatched.
- f4: The orchestrator does not attempt to resolve or review anything in its own context.
