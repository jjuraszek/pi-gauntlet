# eval report: gauntlet-resume (partial run: ledger-tracker-recovery)

for: 1a684ac3d2f07b6df70d3e6ccdd730a185fff56204fd682b60dfaf8e9d8b8abd

wall: 86s

## Change

Use the human's existing admission answer and render the recovered rows from disk. Show the ledger allowance before continuing verify and ship briefs, even when all rows are closed.

Accept only current-format briefs and ledgers through the single gauntlet-resume entry point. Load loop restoration, plan restoration and plan repair from their owning references, and load coordinated rules only for multi-leg briefs. Preserve the continuation skill, phase, exact task snapshot and fresh-gate boundary for current-format brainstorm, plan, implement, verify and ship briefs. Recover current ledger returns from ledger-held attribution before dispatch, without a tracker call for the ledger list and with only non-ledger tasks initialized before plan_check on verify or ship restore, without counting a consumed attempt twice; preserve mixed verification/conformance tasks and plan baseline upgrades. Stop old ledgers at admission with the unsupported-format sentence and recovery pointer, without conversion or tracker mutation. Selected text replays compare supplied observations with the pre-tracker driver; they do not prove live reads or tracker execution. Coverage is sample-scoped, not a target-wide pass.

Stop before restoring either tracker: name the numbered gauntlet command only for an identified spec PR, point a recorded create failure to the create-only retry, and otherwise ask for the draft PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ledger-tracker-recovery | anthropic/claude-opus-5-5 | improved | 20249 | implement-order: fails -> holds (unplanned improvement); home-return: fails -> holds (unplanned improvement); rejected-return: fails -> holds (unplanned improvement); interrupted: holds -> holds (held); settled-repair: fails -> holds (unplanned improvement); unavailable-before-image: holds -> holds (held) |
| ledger-tracker-recovery | github-copilot/gpt-6.1-sol | improved | 15927 | implement-order: fails -> holds (unplanned improvement); home-return: fails -> holds (unplanned improvement); rejected-return: holds -> holds (held); interrupted: holds -> holds (held); settled-repair: fails -> holds (unplanned improvement); unavailable-before-image: holds -> holds (held) |

## Feedback

- ledger-tracker-recovery / anthropic/claude-opus-5-5: After moved four facts by dropping the `plan_tracker` refresh/status calls that Before made in A-E and rendering rows, allowance, iterations and last decision straight from disk; that is what satisfies implement-order, home-return (verify starts with no tracker write) and settled-repair. It moved rejected-return by having B and C use the human's already-supplied 'stopped before admission' answer, where Before narrated asking the admission question again with a reset disclosure. No fact that Before kept was lost: D still recovers the zero-commit interruption with no human turn, and L still stops before any tracker call, mutation or dispatch without using HEAD^ or completed rows. Three things are thin and worth making explicit so these facts stay robust. In C and D, the 'Steps 7-9 match B' shorthand skips the disk render (allowance 4, row 1 failed 1/4, row 2 done 1/4, iterations 4); spell it out. In D, state that row 2 and prior decisions are unchanged, as B and C do. In A, say that `phase_tracker start verify` is the only tracker call and that no plan-tracker write happens for the ledger list. In B and C, word the reset/clean line as a disclosure tied to the existing answer so it cannot be read as a new discard question, and in L add that verification is not run and ledger bytes are preserved.
- ledger-tracker-recovery / github-copilot/gpt-6.1-sol: No fact that Before kept was lost in After; the three that moved all went from fails to holds, and all for the same reason. Before projected the ledger list with `plan_tracker refresh`/`status` calls in A, B-D and E, which breaks the 'no tracker call for the list', 'without a tracker write' and 'without a tracker call or reseed' clauses. After drops those calls, renders rows and `allowance: 4` from disk, and still shows the allowance before starting verify in A. Three points hold in After only by implication, and stating them outright would make it more robust: A never says the empty commit bodies are not admission evidence (Before did), A covers the pending removal and `returned:` replacement only as 'protected headers satisfy the contract', and D never says the bump plus pending tuple are expected dispatch dirt recovered unconditionally with no human turn. Keep the explicit 'no ledger-list `plan_tracker init`', the full `S..HEAD` validation, the 'no iteration 5' statement and the L stop before arming exactly as they are.

exit: 0
