for: 7e3fd0dcead696d7bd7331844de51d1aea670e26223566186241ec6cd515d287

## Change
On a batch ticket's zero-criterion recovery turn, list the child's excluded rows once under Not acceptance criteria without a verdict. Keep the stop reason, retry and skip choices, and no-write rule unchanged. Preserve sibling outcomes and independent gates. The replay starts with saved child reports and tests message rendering, not child sorting, dispatch, or real tracker writes.

## Expected to move
- zero-criteria-entries-listed/excluded-rows: fails -> holds - The recovery turn now carries the excluded rows from the child's report.
