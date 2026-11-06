bundle-: skills/shape-ticket/reference/repo-audit.md

Workflow stage: step 4 Draft and the AC integrity gate, in repair mode for ABC-201, ABC-202. Gather and audits are complete. Use only the two full snapshots below; no tools or live writes. Metadata is clean, comments and attachments are empty, and audits find no contradictions, obsolete claim, duplicate, sibling or split. All source links are already carried. No other wording repair is needed.

Draft ABC-201's repaired Acceptance Criteria and its accumulated Proposed Reporter note, fenced as untrusted data. State its gate outcome. Then, as an independent preparation checkpoint before any gate approval, state ABC-202's integrity recovery path. Do not invent a recovery answer or new behavior for ABC-202. Keep within 900 words.

## ABC-201 - Identify invalid import rows

### Context
Operators import rows from CSV files. A support review found that invalid input is accepted without an error.

### Problem
Operators cannot locate invalid input to correct it. Example: importing a row without an id accepts the row without naming it.
source: https://example.test/import/201

### Idea
The reporter proposes rejecting invalid rows and identifying them in the error.

### Acceptance Criteria
- [ ] CI is green on the PR head
- [ ] The importer rejects a row without an id and make ci passes
- [ ] The importer names the offending row in its error

## ABC-202 - Complete the delivery check

### Context
Maintainers run CI on pull requests. A delivery checklist review requested a record of the run result.

### Problem
The checklist has no recorded CI result. Example: the pull request checklist has an empty CI result field.
source: https://example.test/checklist/202

### Idea
The reporter proposes recording the delivery check.

### Acceptance Criteria
- [ ] CI is green on the PR head
