# eval report: gatekeep-pr (partial run: no-arg-discovery-answered)

for: 78b1086bb9a1961f9dfcae8181c8fd362cce42b9b9e0be910b37cfa53b2c79f9

wall: 34s

## Change

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, list it before reading CI runs, the diff or comments. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| no-arg-discovery-answered | anthropic/claude-opus-5-5 | improved | 14291 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: fails -> holds (intended change) |
| no-arg-discovery-answered | github-copilot/gpt-6.1-sol | improved | 6533 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: fails -> holds (intended change) |

## Feedback

- no-arg-discovery-answered / anthropic/claude-opus-5-5: Before ran no review lookups at all, excluded every CHANGES_REQUESTED PR from the projected decision alone, listed only #40 under a non-bold singular heading, and treated all three isolated runs as unaffected, so every fact failed there. After moved all five: it runs lookups for #19, #22 and #27 only, in ascending number order, with none for the draft #31, approved #38 or undecided #40 (f1); it shows the bold heading 'Open PRs to gate, smallest first:' with linked #40, #27, #19 in size order, routes exactly those three in that order, and drops #22 on its 'unanswered' verdict (f2); and each isolated run stops with the exact line 'discovery failed: HTTP 502: Bad Gateway' (first stderr line only), 'discovery failed: malformed review lookup for #19' or 'discovery failed: incomplete review lookup for #19', printing no list and routing nothing (f3-f5). Before kept no facts, so nothing regressed. To keep these gains stable, retain the explicit wording that lookups run only for surviving CHANGES_REQUESTED rows in ascending number order, that the block's supplied verdict decides keep or exclude, that only the first stderr line is quoted, and that any lookup failure stops before the list and routing; the extra 'gauntlet: stuck discovery failed' line before the stop message does not break any fact but could be pinned down if exact stop text matters.
- no-arg-discovery-answered / github-copilot/gpt-6.1-sol: Before held none of these facts: it excluded every CHANGES_REQUESTED PR without a lookup, listed only #40 under an unbolded heading, and never reached the failure paths. After moves all five: the new rule to keep a changes-requested PR when the requester was re-asked or a later commit landed makes the parent look up #19, #22 and #27 in numeric order and skip the draft, approved and undecided PRs (f1); the bold `**Open PRs to gate, smallest first:**` heading plus size ordering yields #40, #27, #19 listed and routed, with #22 left out despite the later comment (f2); and the stop wording yields the first stderr line only for the 502 and the `malformed`/`incomplete review lookup for #19` messages, each with no list and no routing (f3-f5). Nothing Before kept was lost. To keep these stable, keep the explicit wording that lookups run in numeric order only for surviving changes-requested PRs, that a failed lookup stops before any list is printed using only the first error line, and that the supplied verdict rather than later plain comments decides inclusion; note that the stop line appears with a `gauntlet: stuck` prefix before `discovery failed: ...`, so if the exact message matters, state whether that prefix is intended.

exit: 0
