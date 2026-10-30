for: c771042a516e5ea10fc88db8ba28f81d63cd10dc7525bad9652632efc69cbb30

## Change

Render one PR's report and menu per turn in the batch summary round: include the first PR with the summary, then collect each pick before presenting the next PR's report and menu instead of asking for all picks at once.

## Comparison scope

Compare the batch-summary-queue sample against the base commit's skill text. Preserve verbatim reports, roster order, and queued consequences; this partial report covers only batch-summary-queue, not the full target.

## Expected to move

- batch-summary-queue/s8: fails -> holds - Explicitly sequence each PR's report and menu after the previous pick instead of rendering multiple menus or requesting a combined reply.
