# eval report: gauntlet-performance (partial run: gate-line-first)

for: df5bf4ada2ccfb4358937ca99becdfa067f17cd352e28b8ee6337f3d750bbf20

wall: 23s

## Change

Show every measured run's ranked files after cornerstones, including data recovered from earlier pages of a truncated digest. Lead the one recommendation with a supported file action only when the same trusted key accounts for both material volume and unusually large shares in comparable complete runs. Preserve the legacy reply and write gate.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| gate-line-first | anthropic/claude-opus-5-5 | unchanged | 4416 | choices: holds -> holds (held); sample-size: holds -> holds (held); first-line: holds -> holds (held) |
| gate-line-first | github-copilot/gpt-6.1-sol | unchanged | 5352 | choices: holds -> holds (held); sample-size: holds -> holds (held); first-line: holds -> holds (held) |

## Feedback

- gate-line-first / anthropic/claude-opus-5-5: Neither fact moved: After still offers the three numbered choices (1. render report, 2. open recommendation as ticket, 3. drill into cache-cleanup) without writing or rendering a report, and still states the sample is too small with n=1 and shipped=1 for version 1.0.0 and renders 'council: no data'. The differences between Before and After are only minor rephrasings in the Recommendation and Cornerstones sections. To keep it this way while delivering the Change, keep the ranked-files section and the file-action recommendation lead conditional on the digest actually containing measured file rows, so that a legacy digest with no file data continues to produce the unchanged legacy reply: the explicit 'sample too small' statement with n and shipped counts, the literal 'council: no data' line, the exact three-item menu, and no report written before item 1 is chosen.
- gate-line-first / github-copilot/gpt-6.1-sol: Neither fact moved: After still offers the three numbered choices (render report, open recommendation as ticket, drill into cache-cleanup) without writing a report, and still states the sample is too small with n=1 and shipped=1 for version 1.0.0 and renders `council: no data`. The After differences on this legacy case are cosmetic: a new `## Council assessment` heading above the council line, a reworded recommendation that drops the run-specific details (spec, run_id, wall time) in favor of explaining the two-shipped-run threshold, and slightly reorganized cornerstone bullets. No ranked-files section appears, which is appropriate since this digest has no measured file rows. To keep this stable while delivering the Change, keep the wording that makes the ranked-files section and file-action recommendation conditional on measured file data being present, and keep the explicit instructions to state `n` and `shipped` per version in the too-small case, to render the literal `council: no data` line, and to hold the write gate until item 1 is chosen; if the added `## Council assessment` heading was unintentional, pin the legacy layout explicitly so the legacy reply is preserved verbatim.

exit: 0
