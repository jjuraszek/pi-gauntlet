# eval report: loop (partial run: human-stop-counts)

for: af8ffbdf2772799f1fc3fc20c005dc66195cd7bbd672ec627c4ce4c371d51449

wall: 90s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| human-stop-counts | anthropic/claude-opus-5-5 | improved | 21281 | row-stops: holds -> holds (held); boundary-stops: holds -> holds (held); pending-recovery: holds -> holds (held); exit-stop: holds -> holds (held); reads: fails -> holds (intended change); durable-counts: holds -> holds (held) |
| human-stop-counts | github-copilot/gpt-6.1-sol | improved | 15187 | row-stops: holds -> holds (held); boundary-stops: holds -> holds (held); pending-recovery: holds -> holds (held); exit-stop: holds -> holds (held); reads: fails -> holds (intended change); durable-counts: holds -> holds (held) |

## Feedback

- human-stop-counts / anthropic/claude-opus-5-5: The only fact that moved is reads: After names human-stop.md before the stop text in A, C, D and G and keeps E and F on interrupted-recovery.md alone, where Before never mentioned human-stop.md at all. That pass is softer than it should be, because After phrases the load as "reuse human-stop.md if it is still in context; otherwise read it"; since the snapshots are independent, wording such as "read human-stop.md in full before rendering any stop or ledger amendment; do not read it for a clean dispatch or interrupted-return recovery" would make the read unconditional and stop a stricter reader from failing it. No fact that Before kept was lost, but three drifts in After sit close to the facts and are worth pinning in the wording. First, E's redispatch writes `pending: 2 | home | aaaaaaa` where Before correctly recorded the repair commit as the new HEAD_BEFORE, so say the tuple takes the HEAD recorded after the repair commit. Second, F no longer says the ledger is rewritten from the saved copy with the other rows, decisions and spent escalation marker unchanged, so pending-recovery holds for F only by inference from E; have each recovery state this explicitly. Third, G's Problem line now carries an unfilled `<tail -n 20 excerpt>` placeholder next to the quoted failure, so tell replays to quote the supplied evidence rather than emit placeholders.
- human-stop-counts / github-copilot/gpt-6.1-sol: The only fact that moved is reads, in the intended direction. Before named only menu-layout (and generic 'driver holds' references) ahead of the A, C, D and G stops and never mentioned human-stop.md. After names a read of human-stop.md before each of those four stops, and for E and F names only interrupted-recovery.md and commit-message.md; B's clean dispatch correctly stays free of the stop procedure. No fact regressed: the stop headers, count lines, 'Preserve every row's attempts.', the option sets, the recovery sequence and the 7+2 / 7+1 denominators all match Before. Two points in After are fragile, though neither fails a fact here. First, the read is qualified 'unless already held/available in context'; if that qualifier ever lets the model omit naming the read, reads would fail, so word it as naming human-stop.md before every stop even when it is already loaded. Second, After's D and G stops add extra Problem text (row 2 evidence in D, the unavailable gate details and marker note in G); keep the wording clear that this never introduces retry or rows +N options or row count lines in G. Keeping the explicit exclusion of human-stop.md from clean dispatch and interrupted-return recovery is what preserves the E/F half of the reads fact.

exit: 0
