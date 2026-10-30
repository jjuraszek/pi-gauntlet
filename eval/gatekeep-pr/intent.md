for: 56790d4fd3938d1894efbdf08b2cac55356a1951f9f4d2ea59d3dc2193ad9918

## Change

Render one PR's report and menu per turn in the batch summary round: include the first PR with the summary, then collect each pick before presenting the next PR's report and menu instead of asking for all picks at once.

## Comparison scope

Compare the batch-summary-queue sample against the base commit's skill text. Preserve verbatim reports, roster order, and queued consequences; this partial report covers only batch-summary-queue, not the full target.

## Expected to move

- batch-summary-queue/s8: fails -> holds - Explicitly sequence each PR's report and menu after the previous pick instead of rendering multiple menus or requesting a combined reply.
