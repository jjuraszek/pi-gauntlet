# eval report: gatekeep-pr (partial run: no-arg-discovery-answered)

for: 973c94dce36ea2d84d32ac2f4d3b7942ed1a3ea48c66f6ae71c9dba0ac23c7be

wall: 30s

## Change

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, list it before reading CI runs, the diff or comments. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| no-arg-discovery-answered | anthropic/claude-opus-5-5 | improved | 6508 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: fails -> holds (intended change) |
| no-arg-discovery-answered | github-copilot/gpt-6.1-sol | improved | 5835 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: fails -> holds (intended change) |

## Feedback

- no-arg-discovery-answered / anthropic/claude-opus-5-5: Before ran no review lookups, excluded all three changes-requested PRs, listed only #40 under an unbolded singular heading, and treated the three isolated runs as no-ops, so every fact failed there. After moves all five: the wording that keeps changes-requested PRs pending a per-PR lookup produced lookups for #19, #22 and #27 only, in ascending order, with none for the draft #31, approved #38 or undecided #40 (f1); the bold `**Open PRs to gate, smallest first:**` heading with linked #40, #27, #19 and the same three tokens routed in that order, with #22 excluded as unanswered (f2); and each failure run stops with the exact `discovery failed: ...` line, using only the first stderr line for the 502, with no list and no routing (f3-f5). Nothing Before held was lost. One thing to tighten: each failure run prints the message twice, once as `gauntlet: stuck discovery failed: ...` and once bare; if the stuck marker line and the plain stop line are meant to be a single output, say which form the user sees so the stop text is not duplicated, and keep the explicit statements that later lookups do not run and no list is printed, since those are what make f3-f5 readable from the text.
- no-arg-discovery-answered / github-copilot/gpt-6.1-sol: Before excluded every CHANGES_REQUESTED PR without any lookup, so it listed only #40 under an unbolded heading, routed nothing to the set, and never reached the failure paths; all five facts failed there. The After wording moved all of them: it looks up only #19, #22 and #27 in numeric order, skips the draft, approved and undecided PRs, drops the unanswered #22 despite the later comment, shows the bold `**Open PRs to gate, smallest first:**` list with linked #40, #27, #19 and routes those three in that order, and each failed, malformed or incomplete lookup stops with the exact `discovery failed: ...` message, no list and no routing. Nothing Before held was lost. Two things to keep stable: the failure output prints both a `gauntlet: stuck discovery failed: ...` line and the plain `discovery failed: ...` line, so if the stuck line is a separate status signal, say so in the wording so it is not read as duplicated user-facing text; and routing sends full URLs rather than bare numbers, which satisfies the fact here but should be stated explicitly as the intended token form so it does not drift between runs.

exit: 0
