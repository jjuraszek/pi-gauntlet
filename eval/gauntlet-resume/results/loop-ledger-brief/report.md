# eval report: gauntlet-resume (partial run: loop-ledger-brief)

for: 1a684ac3d2f07b6df70d3e6ccdd730a185fff56204fd682b60dfaf8e9d8b8abd

wall: 67s

## Change

Use the human's existing admission answer and render the recovered rows from disk. Show the ledger allowance before continuing verify and ship briefs, even when all rows are closed.

Accept only current-format briefs and ledgers through the single gauntlet-resume entry point. Load loop restoration, plan restoration and plan repair from their owning references, and load coordinated rules only for multi-leg briefs. Preserve the continuation skill, phase, exact task snapshot and fresh-gate boundary for current-format brainstorm, plan, implement, verify and ship briefs. Recover current ledger returns from ledger-held attribution before dispatch, without a tracker call for the ledger list and with only non-ledger tasks initialized before plan_check on verify or ship restore, without counting a consumed attempt twice; preserve mixed verification/conformance tasks and plan baseline upgrades. Stop old ledgers at admission with the unsupported-format sentence and recovery pointer, without conversion or tracker mutation. Selected text replays compare supplied observations with the pre-tracker driver; they do not prove live reads or tracker execution. Coverage is sample-scoped, not a target-wide pass.

Stop before restoring either tracker: name the numbered gauntlet command only for an identified spec PR, point a recorded create failure to the create-only retry, and otherwise ask for the draft PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| loop-ledger-brief | anthropic/claude-opus-5-5 | improved | 15051 | producer: holds -> holds (held); consumer: fails -> holds (unplanned improvement); continuation: holds -> holds (held); fail: holds -> holds (held); verify-ledger: fails -> holds (unplanned improvement); gate-owner: holds -> holds (held) |
| loop-ledger-brief | github-copilot/gpt-6.1-sol | improved | 14480 | producer: holds -> holds (held); consumer: fails -> holds (unplanned improvement); continuation: holds -> holds (held); fail: holds -> holds (held); verify-ledger: fails -> holds (unplanned improvement); gate-owner: holds -> holds (held) |

## Feedback

- loop-ledger-brief / anthropic/claude-opus-5-5: After moved `consumer` and `verify-ledger` from fails to holds, and no fact that Before kept was lost. For `consumer`, After renders rows, allowance, iterations and decisions from disk "with no task-tracker call", where Before called `plan_tracker refresh` on the ledger path and then `status`. For `verify-ledger`, After omits `plan_tracker init` for the ledger-only brief ahead of `plan_check`, renders `allowance: 4` with the all-closed rows before continuing, and enters `After the loop` at step 1 without repeating `start verify`. Before instead initialised the full saved list including ledger rows, did so after `start verify`, and refreshed the tracker by ledger path. Three wording gaps in After are worth closing so these facts stay robust: the verify/ship section never names the shared restore boundary (the `loopEngine` read and the allowance render are only implied there), it does not say outright that the tracker is not called for the ledger list, and it drops Before's explicit "not `verify.md`" statement. The implement section also says `Before each dispatch` without "loop step 5"; keeping that label would protect `continuation`. The gate-ownership wording (resume runs no gate, fresh `LOG_DIR`, `node --test parser.test.mjs` redirected to a log with exit code and path printed, never `make ci`, old log not evidence) is intact and should stay as written.
- loop-ledger-brief / github-copilot/gpt-6.1-sol: After moved two facts by dropping tracker calls for the ledger list. Before restored ledger rows with a `plan_tracker refresh` plus `status` after `start implement`, which fails `consumer`. On verify and ship restore, Before also initialized the entire saved task list (ledger rows included, suffixes stripped) and repeated the refresh, which fails `verify-ledger`. After has no init or refresh for ledger rows, renders rows from the durable ledger, initializes only non-ledger tasks verbatim before `plan_check` (omitted for a ledger-only brief), prints `allowance: 4` before verification, and continues at After the loop step 1 with loop-owned fresh gates. The four facts Before held still hold. Two points are thin in After and worth making explicit in the wording: it never names finishing after the conformance review, and it never names the dispatch step number (step 5) or the driver path `skills/gauntlet/implement/loop/loop.md` for the continuation point. Add those while keeping the explicit statements that resume runs no separate gate, that `make ci` is never a gate, and that an old log is not fresh evidence.

exit: 0
