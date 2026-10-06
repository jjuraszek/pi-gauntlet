anonymized: true
# Expected facts: exempt-viewer-status-pending

- f1: The evidence resolves to CI with the green checks on the assessed head, not to pending.
- f2: The merge row is offered and no wait row is placed first.
- f3: The pending approval status is not listed under PR comments or as a blocker; it appears only under show evidence as not binding this viewer.
- f4: The approve row is present because the viewer did not author the pull request.
- f5: No sentence says that another developer's approval is required.
