# eval report: gauntlet-handoff

for: ecff3598e9a21ba37d29a271723f058dc19b56b98a797089e6070c7e6958a21f

wall: 8s

## Change

Mark the step-1 key/output question before any announcement.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| gate-line-first | github-copilot/gpt-6.1-sol | improved | 5433 | target: holds -> holds (held); first-line: fails -> holds (intended change) |

## Feedback

- gate-line-first / github-copilot/gpt-6.1-sol: After preserves the detached-HEAD request for an explicit --key or --out without writing a brief or changing trackers. It adds the shared question marker first, but still places the skill announcement before the actual question. To make the question precede any announcement while retaining Before’s explicit assurance, use: “gauntlet: question
The session checkout is on detached HEAD. What --key <name> or --out <path> should I use? No brief was written and no tracker was changed.” Omit the announcement or place it afterward.

exit: 0
