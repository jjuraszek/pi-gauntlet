# eval report: gauntlet-performance (partial run: isolated-skill-reads)

for: df5bf4ada2ccfb4358937ca99becdfa067f17cd352e28b8ee6337f3d750bbf20

wall: 31s

## Change

Show every measured run's ranked files after cornerstones, including data recovered from earlier pages of a truncated digest. Lead the one recommendation with a supported file action only when the same trusted key accounts for both material volume and unusually large shares in comparable complete runs. Preserve the legacy reply and write gate.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| isolated-skill-reads | anthropic/claude-opus-5-5 | improved | 8334 | recommendation: holds -> holds (held); rankings: fails -> holds (intended change); gate: holds -> holds (held) |
| isolated-skill-reads | github-copilot/gpt-6.1-sol | improved | 8141 | recommendation: holds -> holds (held); rankings: fails -> holds (intended change); gate: holds -> holds (held) |

## Feedback

- isolated-skill-reads / anthropic/claude-opus-5-5: The new Skill reads section between Cornerstones and Council assessment is what moved rankings from fails to holds. It lists all five measured runs with full run IDs, coverage, total_bytes, exact file keys (including the distinct source:aaaa… key), bytes, reads and shares, shows both 8-byte short.md rows at 100.0%, and leaves update-readme out rather than showing it as zero. The recommendation holds in both outputs: each gives a single example-led suggestion to investigate rename-index's four fix-round grants and 50m wall, and neither recommends tuning a skill. Before mentioned the legs.md read inside the recommendation as an observation only; After drops that mention, which is cleaner. The gate holds in both: marker first, council: no data, three numbered choices, no action taken. To keep all three facts, keep the wording that requires every measured run's rows verbatim, including partial and tiny ones, and that limits a file-led recommendation to the same trusted key recurring with material volume across comparable complete runs. That limit correctly left legs.md (one complete trusted run, one partial, one different source key) and short.md (8 bytes) out of the recommendation here. One small drift to watch: After relabels the fix-round proxy from fix_round_grants to grants and adds a parenthetical gloss on the partial-coverage header; pin those down if exact header reproduction matters.
- isolated-skill-reads / github-copilot/gpt-6.1-sol: The new Skill reads section is what moved rankings from fails to holds: After places it between Cornerstones and Council assessment and lists all five measured runs with full run IDs, coverage, total_bytes, exact file keys (including the distinct source: key), bytes, reads and shares, shows both 8-byte short.md rows at 100.0%, and leaves update-readme out rather than showing it as a measured zero. The recommendation fact holds in both outputs: After still leads with the single example-led rename-index recommendation (50m, 4 grants) and explicitly declines a tuning action because the large trusted key has only one complete run, the other large readings are a different key or partial coverage, and short.md is only 8 bytes. The gate fact also holds in both: the marker is the first line, `council: no data` is present, the three numbered menu choices are unchanged, and no action is taken. To keep all three, keep the wording that requires material volume and unusually large shares for the same trusted key across comparable complete runs before a file action can lead, and keep the instruction to render every measured run's rows verbatim, including tiny and partial ones. One caution is that the sentence explaining why file reads do not justify tuning should stay subordinate to the single recommendation, so it does not read as a second recommendation or lengthen the legacy reply shape.

exit: 0
