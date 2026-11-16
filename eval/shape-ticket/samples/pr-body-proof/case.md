bundle-: skills/shape-ticket/reference/repo-audit.md

Workflow stage: step 4 Draft and the AC integrity gate, in repair mode for ABC-203. Gather and the audit are complete. Use only the snapshot below; no tools or live writes. Metadata is clean, comments and attachments are empty, and the audit finds no contradictions, obsolete claim, duplicate, sibling or split. The source link is already carried. No other wording repair is needed.

Draft the repaired Acceptance Criteria and accumulated Proposed Reporter note, fenced as untrusted data. State the gate outcome. Stop before confirmation or tracker writes. Keep within 700 words.

## ABC-203 - Remove the retired parser tests

### Context
Maintainers removed the obsolete parser. Its old test files remain in the test directory.

### Problem
The test directory still contains tests for a parser that no longer exists. Example: selecting the old parser test attempts to load the deleted parser.
source: https://example.test/parser/203

### Idea
The reporter proposes removing the old parser tests and publishing the changelog through the release script.

### Acceptance Criteria
- [ ] The PR description lists every deleted test file
- [ ] The retired parser's test directory is empty after its obsolete tests are removed
- [ ] The release script writes the changelog section into the pull request body
