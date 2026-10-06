anonymized: true
# Expected facts: flip-after-update-branch

- f1: The first menu offers update branch and does not offer merge because the branch is behind.
- f2: The second menu, rendered after the refresh, offers merge.
- f3: The second menu does not treat the pending approval status as binding.
- f4: Both menus carry exactly one recommended row and end with stop.
- f5: The second menu's evidence resolves to CI on the new head, with the green checks as the evidence, not to pending.
