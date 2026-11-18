# eval report: gauntlet-performance (partial run: recurring-skill-reads)

for: df5bf4ada2ccfb4358937ca99becdfa067f17cd352e28b8ee6337f3d750bbf20

wall: 32s

## Change

Show every measured run's ranked files after cornerstones, including data recovered from earlier pages of a truncated digest. Lead the one recommendation with a supported file action only when the same trusted key accounts for both material volume and unusually large shares in comparable complete runs. Preserve the legacy reply and write gate.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| recurring-skill-reads | anthropic/claude-opus-5-5 | improved | 13269 | recommendation: fails -> holds (intended change); rankings: fails -> holds (intended change); gate: holds -> holds (held) |
| recurring-skill-reads | github-copilot/gpt-6.1-sol | improved | 8513 | recommendation: fails -> holds (intended change); rankings: fails -> holds (intended change); gate: holds -> holds (held) |

## Feedback

- recurring-skill-reads / anthropic/claude-opus-5-5: After moved `recommendation` by opening with an action on the trusted key ("Inspect the callers of pi-gauntlet:skills/brainstorming/reference/legs.md, as in export-index"), naming both runs with 66000 bytes (82.5%) and 48000 bytes (80.0%), and stating that read counts alone do not prove waste. Before opened with an observation ("Repeated reads … dominate skill context"), left its next step to the last sentence, and its "loading it once per run" lever treated the repeated reads as waste. After moved `rankings` by adding a Skill reads section between Cornerstones and Council that reproduces both blocks verbatim, including the page-1 block recovered from the truncated digest, with full run IDs, coverage=complete, totals 80000 and 60000, and all four rows; Before had only short IDs and the legs.md figures in prose. `gate` holds in both: the marker comes first, `council: no data` is present, the three-choice menu is intact, and nothing is written. One risk to that fact is that After numbers its sections 1–4 while the menu is also numbered 1–3, which departs from the legacy layout and could make a bare reply of "2" look ambiguous. To keep the gate reliably, tell the skill to keep the legacy unnumbered bold section headings so the menu is the only numbered list, while keeping the action-first recommendation, the "counts do not prove waste" caveat, and the verbatim per-run tables between Cornerstones and Council.
- recurring-skill-reads / github-copilot/gpt-6.1-sol: The After wording moved both targeted facts without losing the one Before already kept. On the recommendation, After leads with a concrete caller-inspection step on `pi-gauntlet:skills/brainstorming/reference/legs.md`, names `export-index` as the example slug, cites both runs by full ID with 66,000 bytes (82.5%) and 48,000 bytes (80.0%), and explicitly says the six and four reads do not prove waste. Before cited only run 6320d345 and called for 'reducing that repeated reading', which treats the reads as waste. On the rankings, After adds a Skill reads section between Cornerstones and Council assessment with both full run IDs, coverage=complete, totals 80000 and 60000, and all four rows with exact path, bytes, reads and share, including the page-1 rows that were outside the visible tail. Before had no ranking section at all. The gate fact holds in both: the marker is the first line, 'council: no data' is present, and the three numbered menu choices are offered with nothing written. To keep this stable, keep the instruction that the Skill reads section sits strictly between Cornerstones and Council and reproduces rows verbatim from every saved page, and keep the explicit 'reads alone do not prove waste' guard. Consider requiring the raw unformatted byte figures (66000, 48000) in the recommendation as well, so a stricter reader cannot fault the comma-formatted numbers. Leave the marker line, the 'council: no data' line and the three-item menu wording untouched.

exit: 0
