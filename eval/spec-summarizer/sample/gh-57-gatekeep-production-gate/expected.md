# Expected facts: gh-57-gatekeep-production-gate

- f1: Pull request gate holders risk pushing fixes that have not received an independent review.
- f2: The gate will offer only actions the actor has permission to perform.
- f3: A fix cannot be pushed while an independent reviewer reports a critical or moderate issue.
- f4: After a push, the gate waits for the automated checks instead of running them locally; a held run stays pending until the user approves it.
- f5: Approving a held workflow requires an explicit user selection.
- f6: The change is complete when the first-pass assessment retains the supported blockers found by the previous version.
