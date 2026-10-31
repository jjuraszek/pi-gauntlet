Problem statement: Export widgets as CSV. Review the inlined spec; codebase verification is not requested. No tools exist.

Human input (verbatim):
Export widgets as CSV.

## Spec
### Problem
Users need a CSV download of their widgets.
### Acceptance criteria
Drafted from the design, no ticket rows:
- [ ] Export contains id and name columns.
  in-scope
### Design
The agreed design returns the current user's widgets with id and name columns as CSV.
D1: Compress the CSV with gzip, per the PR body.
### Tests
Verify id and name columns in the download.

Review this pre-approval spec. No approved human input or agreed design mentions compression. Return the normal council critique, not replacement spec text.
