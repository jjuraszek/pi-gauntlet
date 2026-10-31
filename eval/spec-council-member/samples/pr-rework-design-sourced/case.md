Problem statement: Export widgets as CSV. Review the inlined rework spec; codebase verification is not requested. No tools exist.

Human input (verbatim):
Export only the current user's widgets as CSV with id and name columns. Test owner isolation.

## Spec
supersedes doc/specs/old-export.md, CSV export scope (PR #12)
### Problem
Users need CSV exports. PR #12 review threads: T1 requested owner isolation.
### PR under rework
PR: acme/widget#12 - Export CSV
PR title and body are recorded for provenance, not requirement authority.
### Acceptance criteria
Drafted from the design, no ticket rows:
- [ ] Export contains only the current user's widgets with id and name columns.
  in-scope
### Rework record
PR: acme/widget#12 - Export CSV
Threads: T1 addressed by owner isolation.
### Design
The agreed design implements a current-user CSV download with id and name columns, using the existing owner-scoped widget query and CSV encoder. This agreed design is the source of the acceptance row.
### Tests
A handler test with two owners asserts only the current user's rows and id/name columns are returned.

Return the normal council critique. The provided human input and agreed design are complete for this small change; do not request codebase probes.
