## Entry boundary
Start at step 2, Select the scope contract. Use the fixed inputs below in place of tool calls. Return the selected `scope` record and any blockers or stops from selection, then stop the replay before verification, review, or menus.

## PR body (verbatim)
````markdown
The importer rejects records with no id.

## Integration
- after deploy to staging - operator: compare the import totals
  - Reference: `doc/specs/staging-import-totals.md`.

## Contract
`doc/specs/import-validation.md`
````

## Assessed head
The diff adds `src/importer.mjs` and changes no spec files. `git show` at the assessed head returns no file for `doc/specs/staging-import-totals.md`. For `doc/specs/import-validation.md` it returns:

```markdown
# Reject malformed imports

## Acceptance criteria
- [ ] the importer rejects a record without an id
  in-scope

## Design
Reject records without an id before writing them.
```

No ticket reference was found.
