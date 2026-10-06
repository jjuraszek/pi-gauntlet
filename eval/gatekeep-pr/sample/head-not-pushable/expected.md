# Expected facts: head-not-pushable

- f1: With `head_pushable: false` the run stops right after step 2 with a report naming the non-pushable head as the reason.
- f2: No git rebase runs.
- f3: No push runs.
- f4: No verification helper is dispatched and the sync stage is recorded as failed.
