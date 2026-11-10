# eval report: gatekeep-pr (partial run: gate-line-first)

for: 50dcfa116c0315ed655bf13df681043e855931134e77ada09370fcc64a396302

wall: 27s

## Change

Put the recommended action first in every gatekeep-pr menu, including stop when it is recommended, and emit recommended=1 on the gate line. Preserve availability, numeric authority, and execution mechanics. Keep non-recommended stop last.

Select only gate-line-first for this increment. Its obstacle scenario checks that stop moves ahead of assess without turning a quoted runtime nudge into a terminal marker. Retain all other saved results as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| gate-line-first | anthropic/claude-opus-5-5 | improved | 11869 | gate-first: fails -> holds (intended change); first-line: fails -> holds (intended change) |
| gate-line-first | github-copilot/gpt-6.1-sol | improved | 6671 | gate-first: fails -> holds (intended change); first-line: fails -> holds (intended change) |

## Feedback

- gate-line-first / anthropic/claude-opus-5-5: After satisfies gate-first on all three parts: the first line is exactly `gauntlet: gate=gatekeep-pr/obstacle recommended=1`, row 1 is stop with the menu's sole [recommended] tag while assess sits untagged at row 2, and "stop and summarize" appears only inside the explanatory paragraph as quoted evidence ("quoted here as evidence and not acted on"), never as a standalone line that could read as a second terminal marker. Before failed because it emitted recommended=2 and kept stop last. Two things to watch in the After wording that are outside this fact but drift from the case setup: the case is marked anonymized, yet After introduces concrete identifiers (acme/widgets#46, run 7001, sha 9c1e4f2) where Before used placeholders like <ticket-ref>, <run-id>, <sha7>; and the 'Not offered: deliver' reason changed from the push requirement to the round-cap guard. Both are acceptable for this fact, but to keep availability wording stable across increments, consider retaining the placeholder style and keeping the deliver unavailability reason tied to the same mechanic Before cited (or state both: round cap reached, needs push to <head_url>:<head_ref>).
- gate-line-first / github-copilot/gpt-6.1-sol: After satisfies gate-first on every clause: the first line is exactly `gauntlet: gate=gatekeep-pr/obstacle recommended=1`, row 1 is stop carrying the menu's only [recommended] tag with assess demoted to row 2 untagged, and the runtime nudge "stop and summarize" stays quoted inside the evidence prose rather than appearing as a second standalone marker. Before failed only because its gate line said recommended=2 and stop sat last, so this is the intended move with no regression. Minor wording notes outside the fact: the new `Role: unreadable` line and the repeated parenthetical in the closing prompt add noise the Before output didn't have; dropping them would keep the After output tighter without touching the gate line or row ordering.

exit: 0
