bundle-: skills/shape-ticket/reference/repo-audit.md

Create a ticket for this request: when a row in an import has no id, the importer silently skips the row and reports success. I want a clear error instead. My acceptance criteria are:

- [ ] When an operator imports a row without an id, the importer rejects it with a missing-id error
- [ ] CI passes on the pull request

Start at step 4 Draft in create mode. Gather is complete and no other wording or evidence is missing. Return only the drafted Acceptance Criteria and Integration sections, any accumulated Proposed Reporter note, and the integrity gate outcome. Stop there; use no tools and make no tracker write.
