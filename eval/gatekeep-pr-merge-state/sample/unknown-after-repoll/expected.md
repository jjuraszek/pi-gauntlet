anonymized: true
# Expected facts: unknown-after-repoll

- f1: The merge row is not offered and the reason says the merge state is unknown.
- f2: Every pending check is treated as binding, so the evidence resolves to pending, not CI.
- f3: Wait is the first row and is recommended.
- f4: Nothing claims the viewer is exempt or that the approval status is not binding.
