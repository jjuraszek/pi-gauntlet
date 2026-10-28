# eval report: check-delivery (partial run: gate-line-first)

for: 70f164d233d37a2504148177ffee3edcf8b660078401243d7794104c7526dc9a

wall: 4s

refresh: complete; sample: gate-line-first; models: github-copilot/gpt-6.1-sol
audit: [candidate.json](results/gate-line-first/candidate.json)

## Change

Add the numbered delivery approval gate and cite the shared menu layout and reply rule while retaining typed yes and the existing write boundary.

Mark confirmation before evidence and exact payloads with the exact confirmation-gate id. Mark ending and STOP reports while keeping Delivered: first in tracker comments, without a gauntlet line in human-channel payloads.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| gate-line-first | github-copilot/gpt-6.1-sol | improved | 4189 | gate-first: fails -> holds (intended change); first-line: fails -> holds (intended change) |

## Feedback

- gate-line-first / github-copilot/gpt-6.1-sol: After moves gate-first to holds by placing the exact confirmation-gate marker on the first line, before evidence and the exact proposed comment, while retaining Delivered: a123456 as the comment’s first line without an internal gauntlet marker. It also preserves the approval wait and no-write boundary. To complete the intended wording change without losing those properties, explicitly cite the shared menu layout and reply rule, retain typed “yes” as approval, and state that a numbered approval will be echoed as “approve the write” before any simulated write; keep those instructions and any ending or STOP markers outside the tracker-comment payload.

exit: 0
