# eval report: gauntlet-resume (partial run: ledger-tracker-verify)

for: 1a684ac3d2f07b6df70d3e6ccdd730a185fff56204fd682b60dfaf8e9d8b8abd

wall: 115s

## Change

Use the human's existing admission answer and render the recovered rows from disk. Show the ledger allowance before continuing verify and ship briefs, even when all rows are closed.

Accept only current-format briefs and ledgers through the single gauntlet-resume entry point. Load loop restoration, plan restoration and plan repair from their owning references, and load coordinated rules only for multi-leg briefs. Preserve the continuation skill, phase, exact task snapshot and fresh-gate boundary for current-format brainstorm, plan, implement, verify and ship briefs. Recover current ledger returns from ledger-held attribution before dispatch, without a tracker call for the ledger list and with only non-ledger tasks initialized before plan_check on verify or ship restore, without counting a consumed attempt twice; preserve mixed verification/conformance tasks and plan baseline upgrades. Stop old ledgers at admission with the unsupported-format sentence and recovery pointer, without conversion or tracker mutation. Selected text replays compare supplied observations with the pre-tracker driver; they do not prove live reads or tracker execution. Coverage is sample-scoped, not a target-wide pass.

Stop before restoring either tracker: name the numbered gauntlet command only for an identified spec PR, point a recorded create failure to the create-only retry, and otherwise ask for the draft PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ledger-tracker-verify | anthropic/claude-opus-5-5 | improved | 23228 | labels: fails -> holds (unplanned improvement); mixed-verify: fails -> holds (unplanned improvement); verification-pending: holds -> holds (held); rebound: fails -> holds (unplanned improvement); settled-home-verify: fails -> holds (unplanned improvement); ambiguous-home-history: holds -> holds (held) |
| ledger-tracker-verify | github-copilot/gpt-6.1-sol | improved | 24949 | labels: fails -> holds (unplanned improvement); mixed-verify: fails -> holds (unplanned improvement); verification-pending: holds -> holds (held); rebound: holds -> holds (held); settled-home-verify: fails -> holds (unplanned improvement); ambiguous-home-history: holds -> holds (held) |

## Feedback

- ledger-tracker-verify / anthropic/claude-opus-5-5: After lost no fact that Before held; the movement is all fails to holds, and it comes from one wording shift: init now carries only the non-ledger tasks and runs before plan_check, with ledger rows projected automatically instead of being put into init and then fixed by explicit plan_tracker refresh calls. That shift moved labels (row 3 and row 2 excluded from init), mixed-verify and settled-home-verify (init of non-ledger tasks only, before plan_check, with `make ci` explicitly not run and commit bodies explicitly not read), and rebound (no tracker call around the dispatch tuple write or the on-disk close). The rebound call for Before is the least certain: it rests on reading its explicit refresh calls as tracker writes. Three places in After hold only on a lenient reading and are worth tightening. In K, write the projected labels in full (`row 3 | 2/6: Verify loop behavior and recovery`, `row 2 | Reject malformed allowance replies`) rather than `…`, and say outright that no label is restored through init and that the cut row carries no attempt prefix. In G, say explicitly that there is no phase reset and no tracker write around the dispatch tuple. In J's interrupted answer, say that prior decisions are preserved and the repair commit is ledger-only, and in the admitted answer say that there is no historical replay. Keep the explicit allowance and row rendering from disk in F and I, since that delivers the Change without disturbing any fact.
- ledger-tracker-verify / github-copilot/gpt-6.1-sol: No fact that Before kept was lost in After; three moved from fails to holds. The wording that moved them is the instruction to initialize only non-ledger tasks before plan_check and let the ledger rows project automatically. Before put row 1/row 2 (and row 3/row 2 in K, and both done rows in I) into plan_tracker init, and ran that init after start verify. After inits only G1/G2/conformance tasks (or only G1 in I, or the three non-ledger names in K) ahead of plan_check, which satisfies labels, mixed-verify and settled-home-verify. Keep that wording. Three places in After are thinner than Before and worth firming up so they stay stable. First, in G, 'offer authorize return or Stop' is now a prose sentence outside the printed stop block; put it back inside the block. G's on-disk close should also say explicitly that no tracker call is made. Second, in J's interrupted answer, state 'no pending', 'row 2 and prior decisions preserved' and 'exactly one repair decision before any further dispatch' outright rather than leaving them to the before-image. Third, in I, say that attribution comes from returned: and its introducing ledger diff, not from the empty commit bodies; that sentence now appears only in J. None of the four facts listed as expected to move (deferred-spec-stop, old-ledger-stops) is in this case's fact list, so this case shows nothing about them.

exit: 0
