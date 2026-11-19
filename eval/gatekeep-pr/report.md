# eval report: gatekeep-pr (partial runs: ten roster samples)

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

Last partial run (`typed-list-note`):

for: a2e498ccda628bab77f90c772e1cf8cc8c40bf86c0ec12a315107e2a22f9958a

wall: 89s

## Change

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| list-send-if-missing | anthropic/claude-opus-5-5 | improved | 14390 | s1: fails -> holds (intended change); s2: fails -> holds (intended change); s3: holds -> holds (held) |
| list-send-if-missing | github-copilot/gpt-6.1-sol | improved | 6351 | s1: fails -> holds (intended change); s2: fails -> holds (intended change); s3: holds -> holds (held) |
| no-arg-discovery-answered | anthropic/claude-opus-5-5 | improved | 14291 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: fails -> holds (intended change) |
| no-arg-discovery-answered | github-copilot/gpt-6.1-sol | improved | 6533 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: fails -> holds (intended change) |
| no-arg-discovery-note | anthropic/claude-opus-5-5 | improved | 13415 | n1: fails -> holds (unplanned improvement); n2: holds -> holds (held); n3: holds -> holds (held); n4: holds -> holds (held) |
| no-arg-discovery-note | github-copilot/gpt-6.1-sol | improved | 10592 | n1: fails -> holds (unplanned improvement); n2: holds -> holds (held); n3: holds -> holds (held); n4: holds -> holds (held) |
| no-arg-discovery-single | anthropic/claude-opus-5-5 | improved | 5881 | f1: fails -> holds (intended change) |
| no-arg-discovery-single | github-copilot/gpt-6.1-sol | improved | 5712 | f1: fails -> holds (intended change) |
| no-arg-discovery-over-cap | anthropic/claude-opus-5-5 | improved | 10928 | f1: fails -> holds (intended change) |
| no-arg-discovery-over-cap | github-copilot/gpt-6.1-sol | improved | 6595 | f1: fails -> holds (intended change) |
| no-arg-discovery-cc-multi | anthropic/claude-opus-5-5 | improved | 6307 | f1: fails -> holds (intended change) |
| no-arg-discovery-cc-multi | github-copilot/gpt-6.1-sol | improved | 8046 | f1: fails -> holds (intended change) |
| no-arg-discovery-zero | anthropic/claude-opus-5-5 | improved | 4576 | f1: fails -> holds (intended change) |
| no-arg-discovery-zero | github-copilot/gpt-6.1-sol | improved | 8228 | f1: fails -> holds (intended change) |
| no-arg-discovery-failed | anthropic/claude-opus-5-5 | unchanged | 11258 | f1: holds -> holds (intended but unchanged) |
| no-arg-discovery-failed | github-copilot/gpt-6.1-sol | improved | 5955 | f1: fails -> holds (intended change) |
| no-arg-discovery-under-cap | anthropic/claude-opus-5-5 | unchanged | 12610 | f1: holds -> holds (held) |
| no-arg-discovery-under-cap | github-copilot/gpt-6.1-sol | unchanged | 13758 | f1: holds -> holds (held) |
| typed-list-note | anthropic/claude-opus-5-5 | improved | 19595 | e1: fails -> holds (intended change); e2: holds -> holds (held); e3: fails -> holds (intended change) |
| typed-list-note | github-copilot/gpt-6.1-sol | improved | 14586 | e1: fails -> holds (intended change); e2: holds -> holds (held); e3: fails -> holds (intended change) |

## Feedback: typed-list-note

- typed-list-note / anthropic/claude-opus-5-5: The bold-heading requirement moved e1: Before printed a plain `PRs to gate:` line, while After writes `**PRs to gate:**` with both entries linked in typed order, and e2 is kept because `by pat` carries no review-request wording, no `discovered, smallest first:` line is printed and nothing is awaited. e3 moved because After limits the pre-list calls to the initial view, the two viewer reads and the default-branch and override reads, takes `acme/gadgets` from the view's URL without an origin lookup, labels the ticket `#45` instead of `acme/gadgets#45`, and pairs the list with `gh run list -R acme/gadgets -c <head>` before minting the run folder, continuation record and tracker. The e3 pass is the thinnest: After stops at 'the rest of Gather then resumes at the GraphQL permissions read', so the diff read, the paginated reviews and comments reads, and the unprompted continuation to provisioning are implied rather than shown, and a stricter reader could fail it for that. To make this robust, have the wording spell out the remaining Gather reads after initialization (permissions, diff, paginated reviews and comments, worktree list), say explicitly that the preamble reads and the `gh run list` result are reused rather than rerun, and name provisioning as the next step entered without waiting. In Run A the list rides with `git fetch origin`; keep the wording clear that the list text precedes that first provisioning call, so it still reads as shown before provisioning.
- typed-list-note / github-copilot/gpt-6.1-sol: The bold-heading wording moved e1: After writes `**PRs to gate:**` in visible reply text before provisioning, with both entries linked in typed order, where Before printed a plain `PRs to gate:`. The single-PR ordering wording moved e3: After runs only the initial view, the two viewer lookups and the ticket display reads before the list, takes `acme/gadgets` from the view URL without an origin lookup, labels the ticket `[#45]`, pairs the list with `gh run list` on the viewed head, and only then mints the run folder, continuation record and tracker and continues Gather without rereading. Before minted the folder first, ran `git remote get-url origin`, used the `acme/gadgets#45` label and paired nothing. e2 held in both: `by pat` with no review-request wording, no `discovered, smallest first:` line, and no wait. Three spots in After are fragile and worth tightening. First, the Run B digest step says to resolve the issue to `acme/gadgets#45`, which reintroduces the qualified label in narration; say the ticket display label stays the short `#45` whenever the ticket lives in the PR's own repository, in the digest as well as the list. Second, Run B ends with a separate "Gather is complete" reply paired with no call and "Do not start provision", which could read as pausing; say Gather flows straight into provisioning with no standalone status reply. Third, the Run A list is paired with a `cat reference/assessment.md` read; if the set list is meant to ride on the first provisioning call or on no call, state that carrier explicitly so the writer does not invent one.

exit: 0 (typed-list-note)
