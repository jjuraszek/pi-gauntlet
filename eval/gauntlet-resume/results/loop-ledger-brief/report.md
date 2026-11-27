# eval report: gauntlet-resume (partial run: loop-ledger-brief)

for: eaef17c9d2176b859e0b1f2449be4fbf2f8b48340b3aae3ce10253ffe88ac91d

wall: 72s

## Change

Accept only current-format briefs and ledgers through the single gauntlet-resume entry point. Load loop restoration, plan restoration and plan repair from their owning references, and load coordinated rules only for multi-leg briefs. Preserve the continuation skill, phase, exact task snapshot and fresh-gate boundary for current-format brainstorm, plan, implement, verify and ship briefs. Recover current ledger returns from ledger-held attribution before dispatch, without a tracker call for the ledger list and with only non-ledger tasks initialized before plan_check on verify or ship restore, without counting a consumed attempt twice; preserve mixed verification/conformance tasks and plan baseline upgrades. Stop old ledgers at admission with the unsupported-format sentence and recovery pointer, without conversion or tracker mutation. Selected text replays compare supplied observations with the pre-tracker driver; they do not prove live reads or tracker execution. Coverage is sample-scoped, not a target-wide pass.

Stop before restoring either tracker: name the numbered gauntlet command only for an identified spec PR, point a recorded create failure to the create-only retry, and otherwise ask for the draft PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| loop-ledger-brief | anthropic/claude-opus-5-5 | improved | 15420 | producer: holds -> holds (held); consumer: fails -> holds (unplanned improvement); continuation: holds -> holds (held); fail: holds -> holds (held); verify-ledger: fails -> fails (pre-existing); gate-owner: holds -> holds (held) |
| loop-ledger-brief | github-copilot/gpt-6.1-sol | improved | 14826 | producer: holds -> holds (held); consumer: fails -> holds (unplanned improvement); continuation: holds -> holds (held); fail: holds -> holds (held); verify-ledger: fails -> holds (unplanned improvement); gate-owner: holds -> holds (held) |

## Feedback

- loop-ledger-brief / anthropic/claude-opus-5-5: After moved `consumer` to holds by dropping Before's `plan_tracker refresh` and status read on the ledger path and rendering rows, allowance and the last decision from disk instead, while keeping the exact `resume: <spec> (loop engine)` skip reason and the precedence of the ledger fields over `No plan active.`. On `verify-ledger`, After fixed the things Before got wrong: init is now limited to non-ledger tasks, placed before `plan_check` and omitted for a ledger-only brief, and there is no ledger tracker call. It still fails because the verify/ship section never states the shared restore boundary or renders `allowance: 4` from disk before verification; it jumps from the restore calls to the closing line, and the allowance only surfaces implicitly as `repairs < 4`. To hold it, make the verify/ship restore wording explicitly require the same restore-boundary step as implement (read loop.md, skip seeding, one `loopEngine` read, render `allowance: 4`, iterations, rows and last decision from disk without a tracker call) after `start verify` and before continuing at After the loop step 1. Keep the current wording that gate execution belongs to the loop skill with a fresh LOG_DIR, the evidence-derived command, exit code plus log path, and never `make ci` or an old log, since that keeps `gate-owner`, and keep the FAIL stop without plan repair or planning.
- loop-ledger-brief / github-copilot/gpt-6.1-sol: After moved two facts from fails to holds and lost none. Before restored the ledger list with `plan_tracker refresh` plus `status` after `start implement`, and on verify/ship restore it initialized the entire saved task list with ledger suffixes stripped, so it failed `consumer` and `verify-ledger`. After drops the tracker call for the ledger list and initializes only observed non-ledger tasks before `plan_check`, with no `init` for a ledger-only brief, which satisfies both. The producer block, the FAIL stop without plan repair, the continuation at Before each dispatch with allowance 4, iterations 5 and attempts 2 preserved, and loop-driver gate ownership with a fresh LOG_DIR and `node --test parser.test.mjs` (never `make ci` or an old log) hold in both. Two points in After are implicit and worth making explicit so `verify-ledger` stays robust: the verify/ship section says only "the same... disk-state rendering" rather than stating that `allowance: 4` is rendered at the shared restore boundary before verification, and the After-the-loop continuation names whole-diff review, happy-path and conformance review but not finishing. Likewise, say outright that pending recovery runs after `start implement` with no tracker call for the ledger list, rather than leaving it inferred from the absence of a refresh.

exit: 0
