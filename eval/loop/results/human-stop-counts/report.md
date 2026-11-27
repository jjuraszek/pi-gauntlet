# eval report: loop (partial run: human-stop-counts)

for: 1fd2513427d334ae0d7674d346227b8258cc94a8c3df2a2885e2df4a707d740b

wall: 108s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| human-stop-counts | anthropic/claude-opus-5-5 | improved | 14582 | row-stops: holds -> holds (held); boundary-stops: holds -> holds (held); pending-recovery: holds -> holds (held); exit-stop: holds -> holds (held); reads: fails -> holds (intended change); durable-counts: holds -> holds (held) |
| human-stop-counts | github-copilot/gpt-6.1-sol | improved | 17542 | row-stops: holds -> holds (held); boundary-stops: holds -> holds (held); pending-recovery: holds -> holds (held); exit-stop: holds -> holds (held); reads: fails -> holds (intended change); durable-counts: holds -> holds (held) |

## Feedback

- human-stop-counts / anthropic/claude-opus-5-5: The only fact that moved is reads, in the intended direction: After names a read of human-stop.md (with menu-layout.md) before the stop text in A, C, D and G, and keeps E and F on interrupted-recovery.md and commit-message.md with no human-stop.md read, whereas Before never named human-stop.md and listed driver-holds.md, empty-child-stagnation.md and menu-layout.md instead. No fact that Before kept was lost: the row counts (9 of 9, 8 of 9, 5 of 9, 2 of 8), the `gauntlet: question` openers, the Preserve line, the option sets, B's dispatch with the fixed hint and iterations 91, the E/F recovery sequence to attempts 6 with the next bump to 92, and G's amend/stop-only terminal stop all survive. Two After details are worth guarding against in the wording, though neither failed a fact here. First, G's Problem line now carries a placeholder for the unrun `tail -n 20` output next to the quoted failure; tell the driver to quote the supplied failure text directly when the log is not available on a replay, so the stop does not read as a pending rerun. Second, the shared allowance table lists rows 1 and 4 as exempt; that is fine as arithmetic, but keep the instruction that done and cut rows never appear in the stop's row count lines explicit, so the table does not leak into a stop. Keep the load condition phrased as "before rendering any human stop or ledger amendment" and explicitly not for clean dispatch or interrupted recovery, which is what kept B, E and F free of the human-stop.md read.
- human-stop-counts / github-copilot/gpt-6.1-sol: The only fact that moved is reads, and it moved as intended: After names a read of human-stop.md before the stop text in A, C, D and G, and uses interrupted-recovery.md (not human-stop.md) for E and F, whereas Before named only a menu-layout reference for the stops. No fact that Before held was lost: the row counts (9/9, 8/9, 5/9, 2/8), the 'Preserve every row's attempts.' line, the option sets, the B dispatch state, the E/F recovery sequence and the G terminal stop are all intact. Three side effects are worth tightening so they do not drift. First, A's 'Problem:' label is now empty, with the evidence on the next line; require the Problem line to carry the row and failure text itself so row 2/parser identification does not depend on the Evidence line. Second, every Recommendation became 'none', and D gained row 2 Evidence and Last decision lines that are not about the dirty tree; say which fields each stop kind carries. Third, each stop block now runs straight on from the narration sentence with no separator; state that the stop message begins on its own, starting at 'gauntlet: question'. Keep the explicit 'read human-stop.md before a stop or ledger amendment; read only interrupted-recovery.md for a pending-tuple recovery; neither for a clean dispatch' wording, since B correctly reads neither.

exit: 0
