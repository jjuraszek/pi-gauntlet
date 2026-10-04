# Expected facts: chase-bug-hotfix

- f1: Operators with small, evidenced, urgent bugs must currently choose between disproportionate planning and deferring the fix.
- f2: A confirmed bug gains a hotfix option after triage without adding another approval gate.
- f3: The hotfix option is unavailable when the fix changes stored data or a public contract.
- f4: Default delivery lands one local commit without publishing it.
- f5: The hotfix is complete only when the landed change is the change that passed review.
- f6: If the default branch advances before landing, the hotfix stops and preserves the reviewed work.
