for: ae596b80d43487cd831cc5f1b33dfe81570338b921fe817b2c22602c167c334a

## Change
On a batch ticket's zero-criterion recovery turn, copy both informational lists from the child's report when present, once each under their original headings, without verdicts. Keep the stop reason, retry and skip choices, and no-write rule unchanged. Preserve sibling outcomes and independent gates. The replay starts with saved child reports and tests message rendering, not child sorting, dispatch, or real tracker writes.

## Expected to move
- zero-criteria-entries-listed/integration-entries: fails -> holds - The recovery turn carries the ticket's Integration entries from the child's report alongside the excluded rows.
