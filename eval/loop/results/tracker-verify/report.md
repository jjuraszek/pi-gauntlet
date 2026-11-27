# eval report: loop (partial run: tracker-verify)

for: 05dffaf811f9b5333628ba334e68529d62cf43938b71bd895fb89186c6bc2303

wall: 132s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

Seed the list once. At subsequent dispatches and stops, rely on automatic projection. Read status before using a task index across a dispatch or stop.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| tracker-verify | anthropic/claude-opus-5-5 | improved | 31687 | per-leg: holds -> holds (held); repair: fails -> holds (unplanned improvement); failure: holds -> holds (held); conformance: holds -> holds (held); rebound: fails -> holds (unplanned improvement) |
| tracker-verify | github-copilot/gpt-6.1-sol | improved | 22611 | per-leg: holds -> holds (held); repair: fails -> holds (unplanned improvement); failure: holds -> holds (held); conformance: fails -> holds (unplanned improvement); rebound: fails -> holds (unplanned improvement) |

## Feedback

- tracker-verify / anthropic/claude-opus-5-5: No fact that Before kept was lost in After. The two facts that moved (repair, rebound) moved because After dropped the explicit `plan_tracker` refresh calls that Before issued after the verification repair marker commit, after the amendment commits, at tuple binding and after the companion row record; with those gone the parent's marker and return records are ledger-only commits with no tracker write, which matches the 'rely on automatic projection' part of the Change. That judgement rests on reading a refresh as a tracker write; if you do not intend that reading, both facts hold in Before too and nothing moved. After also made the G1 index step concrete (call `plan_tracker({ action: "status" })` because a dispatch and a stop intervened, locate G1 by identity, use the fresh index), where Before only said 're-reads the tracker'; keep that explicit wording. Three things are thin in After and worth pinning in the wording so they do not drift: say outright that G1 stays pending across the automatic redraws; say that on resume an on-disk `pending: verify` counts once and is replaced, not added to, by its completed marker; and name 'implement complete' in the 4-of-4 stop itself (Before's stop option said it, After's says only 'keep verify active and preserve both branches'). After's re-bound branch also assumes `iterations: 4` (bump to 5) where Before assumed 5 (bump to 6); both are internally consistent, but the wording should say which baseline the continuation uses so the consumed count is unambiguous.
- tracker-verify / github-copilot/gpt-6.1-sol: No fact that Before kept was lost in After, and the three facts that moved all moved from fails to holds because of the automatic-projection and status-read wording. Before called `plan_tracker({ action: "refresh" })` after the repair marker commit, after writing the row-2 pending tuple, and after the parent row record; I counted each of those as a tracker write, which is a judgement call on what "tracker write" covers, and it is what fails `repair` and `rebound` in Before. After drops those calls and relies on projection, so both facts now hold. Before also said only "refresh/re-read the current tracker view" for the stale G1 index, whereas After names `plan_tracker({ action: "status" })` because a dispatch occurred since the index was read, which is what `conformance` asks for. To keep this, keep the explicit rule that a status read precedes any index-based update across a dispatch or stop, and keep parent marker and row-record commits free of tracker calls. Two points are still thin in After and worth stating outright: that resume counts a pending `verify` reservation once and never again once its marker has landed (After only says "one marker plus one reservation"), and that the exhausted stop leaves implement complete as well as verify active. The per-leg verified HEAD and clean-state record should also stay explicitly tied to gate success.

exit: 0
