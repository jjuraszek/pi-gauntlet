# eval report: loop (partial run: tracker-verify)

for: 6a099150775b5ff06474a688f58c8d0d00589bcdd9cda1a8bd99640e85aa92bd

wall: 104s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

After an interrupted return, read the repaired rows from the ledger and continue without a tracker call, including on resume. Seed the list once. At subsequent dispatches and stops, rely on automatic projection. Read status before using a task index across a dispatch or stop.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| tracker-verify | anthropic/claude-opus-5-5 | improved | 21820 | per-leg: holds -> holds (held); repair: fails -> holds (unplanned improvement); failure: holds -> holds (held); conformance: fails -> holds (unplanned improvement); rebound: fails -> holds (unplanned improvement) |
| tracker-verify | github-copilot/gpt-6.1-sol | improved | 25972 | per-leg: holds -> holds (held); repair: fails -> holds (unplanned improvement); failure: holds -> holds (held); conformance: fails -> holds (unplanned improvement); rebound: fails -> holds (unplanned improvement) |

## Feedback

- tracker-verify / anthropic/claude-opus-5-5: After moved three facts by dropping explicit tracker calls. Before issued `plan_tracker` refresh after the repair-marker commit, after each amendment, and around the row-2 tuple write and parent record, so `repair` and `rebound` failed on "without a tracker write". After has the parent commit only the ledger, delete the return file, and leave the tracker to automatic projection ("at the next stop the tracker shows row 2 skipped/pending"). On `conformance`, After names `plan_tracker status` before the index-based G1 update because a dispatch intervened, where Before only said "re-reads the tracker" and showed skipped/pending through manual refreshes rather than automatic redraws. No fact that Before kept was lost. Three things are implicit in After and worth pinning in the wording so they stay stable: say outright that G1 remains pending across automatic redraws; keep the resume count sentence ("1 marker + 1 pending = 2", a completed marker clears its tuple so it is never counted twice); and keep "implement complete" in the stop's phase state, since After's Stop option now says only "keep verify active and preserve branch state" and relies on the earlier phase-state list. Also keep the line that verify start completes implement with no explicit complete call or exit gate, and that verified HEAD and clean status are recorded only after the gates pass.
- tracker-verify / github-copilot/gpt-6.1-sol: After moved three facts by dropping tracker calls: it no longer runs `plan_tracker refresh` after the repair-marker commit, after writing the row-2 tuple, or after the parent row record, so the parent records without a tracker write (repair, rebound). It also names `plan_tracker({ action: "status" })` before the G1 index update, where Before said only an ambiguous "Refresh/re-read the current tracker view" (conformance). I treated `refresh` as a tracker write; if you do not, repair and rebound hold in Before too. Nothing Before kept was lost outright, but two points got thinner. First, Before said repair accounting is the `repair verification` decisions plus any outstanding `pending: verify` tuple, while After only says "durable repair verification accounting"; I held the failure fact for After because nothing contradicts it, but restore a sentence saying a pending verify reservation counts as a consumed repair on resume and is not double-counted with its completed marker. Second, After adds "This task counts as one conformance fix round under the closure guard" to the reopened-row return, which blurs the line between row returns, exit repairs and verify-phase credits; drop or qualify it. Keep the explicit "verify stays active, implement stays complete" at the exhaustion stop and the status-before-index wording.

exit: 0
