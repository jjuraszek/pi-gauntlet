# eval report: chase-bug (partial run: hotfix seed admission)

for: 8d755cd6dd1f0f0d4fc4e1aea1fa58ef8619e7fee127668c7d1fbf031e3c91ea

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| hotfix-seed-file-observation | anthropic/claude-opus-5-5 | improved | 11690 | admission: fails -> holds |
| hotfix-seed-file-observation | github-copilot/gpt-6.1-sol | improved | 11143 | admission: fails -> holds |
| hotfix-return-file | anthropic/claude-opus-5-5 | improved | 5897 | admission: fails -> holds |
| hotfix-return-file | github-copilot/gpt-6.1-sol | improved | 8957 | admission: fails -> holds |

## Coverage

Both models admitted a matching seed file. With a missing file, they recorded a seed repair and selected another seed dispatch instead of aborting or using the commit body. The file-observation sample also exercised an unreadable file and a mismatched iteration: both kept the row open at attempts 0 and carried the miss into the next seed hint.

These replays stop at the parent's decision. They did not execute a retry, a gate, a review or a landing. The other hotfix records are historical. The saved baseline and candidate records under `results/` contain each sample's replies and judgments.
