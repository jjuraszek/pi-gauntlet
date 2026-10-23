for: 34e808eff59c8874ebf28fa56fd636f75df4e3fff627a17fbf1f117020d77e8e

## Change
Serialize ledger evidence in one physical Markdown cell with the check name and at most three semicolon-separated result lines, escaped pipes, and no angle-bracket markup. Preserve the spec-first read order, target-row scope, seed exception, and single-commit decision contract.

## Expected to move
- row-and-evidence/bounded-evidence: fails -> holds - Plain-text semicolon separators keep failed and baseline evidence compatible with ledger admission.
