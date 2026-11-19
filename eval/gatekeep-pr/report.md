# eval report: gatekeep-pr (partial run: no-arg-discovery-answered)

for: b7d1d19e3f97043f57bcc7aa2658bff7f95f970de71669e65277ca254677ed87

wall: 30s

## Change

Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| no-arg-discovery-answered | anthropic/claude-opus-5-5 | improved | 6392 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: fails -> holds (intended change) |
| no-arg-discovery-answered | github-copilot/gpt-6.1-sol | improved | 5726 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: fails -> holds (intended change); f4: fails -> holds (intended change); f5: fails -> holds (intended change) |

## Feedback

- no-arg-discovery-answered / anthropic/claude-opus-5-5: All five facts moved from fails to holds as intended, and Before held none, so nothing was lost. Before excluded every CHANGES_REQUESTED PR on the projected decision alone, ran no lookups, listed only #40 on the single-PR path, and produced the same result in all three failure runs. After runs the lookup for #19, #22 and #27 only, in ascending order, keeps the two `answered` PRs, drops the `unanswered` #22, lists #40, #27, #19 under the plural heading and routes those three in that order. In each failure run it stops at the #19 lookup with the exact `discovery failed: ...` text (first stderr line only for the 502), printing no list and routing nothing. To keep this stable, keep the wording that states lookups run only for surviving CHANGES_REQUESTED PRs in ascending number, that any non-zero exit stops before the list, and that the failure message uses the first error line or the named malformed/incomplete form with the PR number. One thing to watch: After prints an extra `gauntlet: stuck discovery failed: ...` line before each stop line; if the stop message is meant to be the sole output, tighten the wording to say which single line is emitted, since a stricter fact could read the duplicate as a deviation.
- no-arg-discovery-answered / github-copilot/gpt-6.1-sol: All five facts moved from fails to holds as expected, and Before held none, so nothing was lost. Before excluded every CHANGES_REQUESTED PR without a lookup, listed only #40 on the single-PR path, and never reached the failure cases; After runs the lookup for #19, #22, #27 in numeric order (skipping draft #31, approved #38 and undecided #40), lists and routes #40, #27, #19 under the exact `**Open PRs to gate, smallest first:**` heading while keeping #22 out despite the later comment, and stops each isolated run with the exact `discovery failed: ...` line, no list and no routing. To keep this stable, preserve the wording that makes the lookup apply only to surviving changes-requested PRs in numeric order, that a non-zero or malformed/incomplete result stops discovery before any list is printed, and that only the first stderr line is used. One thing to watch: After prints an extra `gauntlet: stuck discovery failed` line before the `discovery failed: ...` line; it does not break f3-f5 as written, but if the stop message is meant to be a single line, say so explicitly in the wording.

exit: 0
