# eval report: gauntlet-resume (partial run: loop-ledger-worktree)

for: eaef17c9d2176b859e0b1f2449be4fbf2f8b48340b3aae3ce10253ffe88ac91d

wall: 54s

## Change

Accept only current-format briefs and ledgers through the single gauntlet-resume entry point. Load loop restoration, plan restoration and plan repair from their owning references, and load coordinated rules only for multi-leg briefs. Preserve the continuation skill, phase, exact task snapshot and fresh-gate boundary for current-format brainstorm, plan, implement, verify and ship briefs. Recover current ledger returns from ledger-held attribution before dispatch, without a tracker call for the ledger list and with only non-ledger tasks initialized before plan_check on verify or ship restore, without counting a consumed attempt twice; preserve mixed verification/conformance tasks and plan baseline upgrades. Stop old ledgers at admission with the unsupported-format sentence and recovery pointer, without conversion or tracker mutation. Selected text replays compare supplied observations with the pre-tracker driver; they do not prove live reads or tracker execution. Coverage is sample-scoped, not a target-wide pass.

Stop before restoring either tracker: name the numbered gauntlet command only for an identified spec PR, point a recorded create failure to the create-only retry, and otherwise ask for the draft PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| loop-ledger-worktree | anthropic/claude-opus-5-5 | improved | 13017 | pairing: holds -> holds (held); restore: fails -> holds (unplanned improvement); durable: holds -> holds (held); stops: holds -> holds (held) |
| loop-ledger-worktree | github-copilot/gpt-6.1-sol | improved | 9780 | pairing: holds -> holds (held); restore: fails -> holds (unplanned improvement); durable: holds -> holds (held); stops: holds -> holds (held) |

## Feedback

- loop-ledger-worktree / anthropic/claude-opus-5-5: The only fact that moved is restore, and it moved in the intended direction: Before followed pending recovery with `plan_tracker refresh` and `status` calls to build the task list, while After renders rows straight from the ledger on disk ("Render from disk") and makes no task tracker call, with the ordered sequence intact (entry check 6, start/skip brainstorm, start plan, plan_check on the ledger, skip plan with `resume: <resolved spec> (loop engine)`, start implement, pending recovery). Pairing, durable and stops hold in both outputs: each pairs by the `**Spec:**` header over basename and ranks the ledger above the task plan, each continues at loop step 5 `Before each dispatch` with allowance 4, iterations 7, attempts 3, audit value 4 and effective allowance 5, and each stops on FAIL with findings and no plan repair and stops a dirty tree before dispatch. To keep these, keep the explicit wording that ledger restores make no `plan_tracker` call and render rows from disk, that the retry's "allowed attempts" is audit-only and the effective allowance is header plus retry count, and that a ledger never enters plan repair. One thing to tighten: After's step 7 render omits the row evidence (it appears only in the confirmation question), so require the rendered state to include evidence per row so durable does not depend on the question block. After also asserts the `returned:` line is present rather than flagging it as an assumption; consider wording that makes the output say what it observed versus assumed at admission.
- loop-ledger-worktree / github-copilot/gpt-6.1-sol: The only fact that moved is restore, and it moved in the intended direction: Before followed Pending recovery with `plan_tracker refresh` and `plan_tracker status` calls, which breaks 'no task tracker call', while After goes from `start implement` through the loop driver read and Pending recovery straight to rendering the ledger with no plan_tracker call at all. After keeps everything Before kept: pairing by the path-only Spec header ahead of the basename task plan, the exact `resume: <resolved spec> (loop engine)` skip reason, the durable rendering (allowance 4, iterations 7, row 2 attempts 3, historical 'allowed attempts 4' retained, effective allowance 5), the handoff to loop step 5 'Before each dispatch', and both stops (FAIL leaves plan in progress with findings and no repair; dirty tree stops before dispatch). To keep this stable, keep the explicit 'do not initialize a task-plan snapshot' sentence. Consider also stating outright that no plan_tracker call is made for the ledger list, so that the absence is asserted rather than merely implied, and keep Pending recovery placed after `start implement` and before any dispatch or dirty-tree stop.

exit: 0
