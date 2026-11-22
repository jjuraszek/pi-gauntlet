# eval report: chase-bug (partial runs: hotfix seed and row retries)

for: e33a63a3d08d2cb92e4f5cadbe58b6709b208909d25028b7e111574885560f36 (latest partial run)

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| hotfix-seed-file-observation | anthropic/claude-opus-5-5 | improved | 11690 | admission: fails -> holds |
| hotfix-seed-file-observation | github-copilot/gpt-6.1-sol | improved | 11143 | admission: fails -> holds |
| hotfix-return-file | anthropic/claude-opus-5-5 | improved | 5897 | admission: fails -> holds |
| hotfix-return-file | github-copilot/gpt-6.1-sol | improved | 8957 | admission: fails -> holds |
| hotfix-seed-retry | anthropic/claude-opus-5-5 | improved | 7021 | seed-budget: fails -> holds |
| hotfix-seed-retry | github-copilot/gpt-6.1-sol | improved | 6028 | seed-budget: fails -> holds |
| hotfix-two-miss-hint | anthropic/claude-opus-5-5 | improved | 7854 | hint: fails -> holds |
| hotfix-two-miss-hint | github-copilot/gpt-6.1-sol | improved | 6137 | hint: fails -> holds |

## Coverage

Both models admitted a matching seed file. With a missing file, they recorded a seed repair and selected another seed dispatch instead of aborting or using the commit body. The file-observation sample also exercised an unreadable file and a mismatched iteration: both kept the row open at attempts 0 and carried the miss into the next seed hint.

In `hotfix-seed-retry` both models selected a retry after the third miss and stopped before landing on the fourth, reporting `seed: 4 of 4`. They distinguished a passing baseline and a dirty tree from retryable misses, admitted an empty-diff retry against its starting tree, and retried a zero-commit inline seed before admitting the next clean commit with failing evidence.

In `hotfix-two-miss-hint`, both models retried after consecutive missing or unreadable files with the latest miss in the hint. At the same attempts count, an admitted failure between misses suppressed the hint. Both stopped at four attempts without another dispatch.

These replays stop at the parent's decision. They did not execute a retry, a gate, a review or a landing. The other hotfix records are historical. The saved baseline and candidate records under `results/` contain each sample's replies, judgments and assembly hashes.
