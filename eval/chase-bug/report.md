# eval report: chase-bug (partial run: gate-line-first)

for: c60bedfffaada3abf2683513725c563848ce3ad8241d960e90a8c3334a02211f

wall: 5s

refresh: complete; sample: gate-line-first; models: github-copilot/gpt-6.1-sol
audit: [candidate.json](results/gate-line-first/candidate.json)

## Change

Chase-bug cites the ticket link shape-ticket returned in both the addressable draft and the unaddressable summary, rather than assuming a newly created ticket. The completed handoff can return an existing ticket. Both baseline replay outputs already cite the supplied existing reference without claiming creation, so this sample expects those facts to remain held rather than forcing a movement.

The verdict menu sites apply the shared menu-layout contract so generated gates stay separated from numbered findings and legacy numeric replies are echoed by their mapped action before handoff.

Mark verdict and response gates with exact ids before evidence; mark only actual endings, never intermediate handoffs. Preserve eligibility and recommendation rules and keep markers outside origin payloads.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| gate-line-first | github-copilot/gpt-6.1-sol | improved | 4574 | gate-first: fails -> holds (intended change); first-line: fails -> holds (intended change) |

## Feedback

- gate-line-first / github-copilot/gpt-6.1-sol: After moves gate-first to holds by putting the exact verdict-menu gate on the first line with recommended=3, matching the rendered respond-only recommendation. It preserves the tracker-origin menu’s omission of filing, retains the eligible hotfix row, and waits without a handoff or terminal marker. Keep this gate line and the existing row eligibility and recommendation wording; no further change is needed for the evaluated fact.

exit: 0
