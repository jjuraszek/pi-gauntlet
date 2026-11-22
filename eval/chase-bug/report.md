# eval report: chase-bug (partial runs: hotfix seed admission and retries)

for: d034d4405a34677bd5689c85277bb43b803bb57fd3e84f6c7270f72a210fa51f (latest partial run)

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| hotfix-seed-file-observation | anthropic/claude-opus-5-5 | improved | 11690 | admission: fails -> holds |
| hotfix-seed-file-observation | github-copilot/gpt-6.1-sol | improved | 11143 | admission: fails -> holds |
| hotfix-return-file | anthropic/claude-opus-5-5 | improved | 5897 | admission: fails -> holds |
| hotfix-return-file | github-copilot/gpt-6.1-sol | improved | 8957 | admission: fails -> holds |
| hotfix-seed-retry | anthropic/claude-opus-5-5 | improved | 7021 | seed-budget: fails -> holds |
| hotfix-seed-retry | github-copilot/gpt-6.1-sol | improved | 6028 | seed-budget: fails -> holds |

## Coverage

Both models admitted a matching seed file. With a missing file, they recorded a seed repair and selected another seed dispatch instead of aborting or using the commit body. The file-observation sample also exercised an unreadable file and a mismatched iteration: both kept the row open at attempts 0 and carried the miss into the next seed hint.

In `hotfix-seed-retry` both models selected a retry after the third miss and stopped before landing on the fourth, reporting `seed: 4 of 4`. They distinguished a passing baseline and a dirty tree from retryable misses, admitted an empty-diff retry against its starting tree, and retried a zero-commit inline seed before admitting the next clean commit with failing evidence.

These replays stop at the parent's decision. They did not execute a retry, a gate, a review or a landing. The other hotfix records are historical. The saved baseline and candidate records under `results/` contain each sample's replies, judgments and assembly hashes.
