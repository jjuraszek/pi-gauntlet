anonymized: true
# Expected facts: bound-viewer-green-ci

- f1: The evidence resolves to CI with the green checks on the assessed head.
- f2: The merge row is not offered and the reason says GitHub reports the merge as blocked.
- f3: Wait is the first row, and approve is the recommended row because the viewer did not author the pull request.
- f4: One PR comments line says GitHub reports this actor's merge as blocked and cites the review decision as a locator.
- f5: No sentence attributes the block to a specific rule or says another developer must approve.
