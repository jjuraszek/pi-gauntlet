# eval report: gauntlet-resume (partial run: loop-ledger-worktree)

for: 1a684ac3d2f07b6df70d3e6ccdd730a185fff56204fd682b60dfaf8e9d8b8abd

wall: 44s

## Change

Use the human's existing admission answer and render the recovered rows from disk. Show the ledger allowance before continuing verify and ship briefs, even when all rows are closed.

Accept only current-format briefs and ledgers through the single gauntlet-resume entry point. Load loop restoration, plan restoration and plan repair from their owning references, and load coordinated rules only for multi-leg briefs. Preserve the continuation skill, phase, exact task snapshot and fresh-gate boundary for current-format brainstorm, plan, implement, verify and ship briefs. Recover current ledger returns from ledger-held attribution before dispatch, without a tracker call for the ledger list and with only non-ledger tasks initialized before plan_check on verify or ship restore, without counting a consumed attempt twice; preserve mixed verification/conformance tasks and plan baseline upgrades. Stop old ledgers at admission with the unsupported-format sentence and recovery pointer, without conversion or tracker mutation. Selected text replays compare supplied observations with the pre-tracker driver; they do not prove live reads or tracker execution. Coverage is sample-scoped, not a target-wide pass.

Stop before restoring either tracker: name the numbered gauntlet command only for an identified spec PR, point a recorded create failure to the create-only retry, and otherwise ask for the draft PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| loop-ledger-worktree | anthropic/claude-opus-5-5 | improved | 11386 | pairing: holds -> holds (held); restore: fails -> holds (unplanned improvement); durable: holds -> holds (held); stops: holds -> holds (held) |
| loop-ledger-worktree | github-copilot/gpt-6.1-sol | improved | 11720 | pairing: holds -> holds (held); restore: fails -> holds (unplanned improvement); durable: holds -> holds (held); stops: holds -> holds (held) |

## Feedback

- loop-ledger-worktree / anthropic/claude-opus-5-5: The only fact that moved is `restore`, and it moved in the intended direction. Before followed pending recovery with `plan_tracker refresh` and `plan_tracker status` calls, which breaks 'no task tracker call'. After replaces that step with 'Render from disk, with no task-tracker call', while keeping the same ordered sequence: entry check 6, start brainstorm, skip brainstorm with the resume reason, start plan, `plan_check` on the ledger, skip plan with `resume: <resolved spec> (loop engine)`, start implement, then pending recovery. `pairing`, `durable` and `stops` hold in both outputs. After still pairs by the `**Spec:**` header rather than basename and ranks the ledger ahead of the task plan. It still renders allowance 4, iterations 7, row 2 at 3 of 5 with the audit value 4 ignored, and resumes at loop step 5 'Before each dispatch'. It still stops on FAIL without plan repair or `plan.md`, and stops a dirty tree before dispatch. Two things to tighten: After's disk render drops the per-row evidence text that Before showed (it survives only in the confirmation question), so have the render-from-disk wording require each row's evidence alongside attempts and effective allowance. Also keep the explicit 'no task-tracker call' and the 'audit value is ignored, effective allowance = header + retries' sentences, since those are what carry `restore` and `durable`.
- loop-ledger-worktree / github-copilot/gpt-6.1-sol: After moved `restore` from fails to holds: Before followed Pending recovery with `plan_tracker refresh` on the ledger path and `plan_tracker status`, which are task tracker calls, while After drops both and says outright "Do not initialize a task tracker with the ledger rows". Keep that explicit no-tracker sentence, and keep the ordered sequence of check 6, brainstorm start and skip, plan start, `plan_check` on the ledger, plan skip with the exact `resume: <resolved spec> (loop engine)` reason, implement start, then Pending recovery. `pairing`, `durable` and `stops` hold in both, so keep the wording that carries them: pairing by the path-only Spec header with ledger precedence over the basename task plan; the rendered rows and last decision line with allowance 4, iterations 7, attempts 3, the historical `allowed attempts 4` cell, effective allowance 5 and continuation at loop step 5 `Before each dispatch`; and the FAIL stop with no plan repair plus the dirty-tree stop before dispatch. Two After additions risk muddying this and could be tightened: the closing caveat that the step 8 success lines are conditional on unsupplied admission fields, and the dirty-tree phrase "finish eligible migration", which sits awkwardly beside the Change's no-conversion rule for ledgers.

exit: 0
