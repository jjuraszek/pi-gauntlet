# eval report: gauntlet-resume (partial run: legacy-cap-brief)

for: 292c077d78678d04478c6424b6890be5257381d6995ef4c0d0d10ad7ed38d23e

wall: 73s

## Change

Restore cap from every admitted ledger at one shared boundary before implement or verify/ship continuation, without re-resolving loopEngine settings. Stop even completed legacy ledgers there; a durable grant resumes the original phase. Render cap, iterations, attempts, funding/retry allowances and decision history, distinguishing operational row decisions. New durable-cap and legacy-cap-brief samples are baseline-skipped: new sample, no pre-edit sample evidence; the runner still generates genuine baseline and candidate evidence.

Restore loop runs from the existing ledger: pair by its Spec header, prefer it to a task plan, validate before implement, preserve counters/retry data, and stop on invalid or dirty state. Produce and consume the contract-owned loop brief fields. With Engine loop and no ledger, arm through brainstorm start/skip after check 6 before driver Entry steps 1-5, with ledger creation at step 4. Use the resolved spec path in the exact plan-skip reason `resume: <spec> (loop engine)`. Give valid ledger brief fields precedence over retained `No plan active.` and admit the ledger instead of phase-only restoration.

PR-subject baseline: `1b0f7dd2bbbf926a8ff65109414d05aa97acaa58`. Handoff carries the PR identity and full pre-rework head only for a rework spec. Resume binds that identity to the live PR branch before tracker writes and selects rework artifacts from the pre-rework head, excluding the PR's earlier spec from added candidates. Ordinary briefs and bare worktrees keep their existing behavior.

Resume routes baseline-line and substantive baseline-form open-questions findings to a fresh foreground plan-writer with Findings: rerun baseline before citation classification. The parent rechecks, returns to the originating restore with snapshot task identities and statuses on PASS, and retains plan in_progress without tracker initialization while presenting the fix-first/narrow/amend menu or restore-and-rerun on remaining baseline failures. Contract questions use the answers path. Citation repair retains its mechanical table and rollback. Discovery applies the shared menu-layout contract when presenting candidates and resolving numeric picks.

Resume verify-stage Ledger briefs, including ship-stage briefs restored at verify, in loop-implementation's After the loop from full ledger verification after the restored start verify, retaining whole-diff review, happy path when triggered, fresh conformance and finishing without task-tracker calls.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| legacy-cap-brief | anthropic/claude-opus-5-5 | improved | 25192 | boundary: fails -> holds (unplanned improvement); grant: fails -> holds (unplanned improvement); continue: fails -> holds (unplanned improvement); dirty: fails -> holds (unplanned improvement) |
| legacy-cap-brief | github-copilot/gpt-6.1-sol | improved | 23070 | boundary: fails -> holds (unplanned improvement); grant: fails -> holds (unplanned improvement); continue: holds -> holds (held); dirty: holds -> holds (held) |

## Feedback

- legacy-cap-brief / anthropic/claude-opus-5-5: Before never stops at a cap boundary: it treats `cap +5` as a no-op, writes nothing, never restores or renders a cap, and leaves dirty-tree cleanup as an implied repair/rerun with no human authorization, so all four facts fail there. After moves every fact to holds: the shared cap boundary runs in A, B and C before any dispatch or verification, stops even with all rows closed on the exact `Stopped: ledger has no cap: line - seeded under the old loopEngine contract` message, explicitly refuses to derive cap from settings/`maxIterationsPerRow`, writes `cap: 12` plus `cap +5 |` in one `loop: raise cap` parent commit preserving iterations 7 and attempts 2, renders cap and the Decisions history, and then resumes implement at the ordered table (rule 1 exit) and verify/ship at After the loop step 1 with full verification, reviews, fresh conformance and finishing, no reseed or task-tracker calls, and ship still parked at verify; dirty-tree handling is separated from the cap stop, never offers `cap +N`, preserves changes and requires explicit human authorization. Two small tightenings would make After safer without losing anything: in the implement continuation, make step 5 (After the loop) explicitly conditional on step 3's success rather than listing it after the failure branch, and in A step 10 say the cap render shows `cap:` absent *as the reason for the upcoming stop* so the pre-grant render and the post-grant `cap: 12` render are clearly two distinct states.
- legacy-cap-brief / github-copilot/gpt-6.1-sol: After moved boundary and grant from fails to holds: Before explicitly refused to stop on the missing cap ("all rows are closed, so the dispatch cap does not cause a stop", "Inventing a cap stop would contradict the ordered checks") and refused to apply cap +5 at all, whereas After places the shared missing-cap boundary before dispatch/verification in all three branches with the exact `ledger has no cap: line - seeded under the old loopEngine contract` line, writes `cap: 12` and `cap +5 |` with a single parent `loop: raise cap` commit preserving iterations 7 and attempts 2, and renders cap plus decision history. The continuation and dirty-tree facts held in both: After keeps implement at Before each dispatch with rule 1 exit verification, verify/ship at After the loop step 1 after the restored start verify with full verification, reviews, fresh conformance and finishing, no task tracker, ship never jumping to ship, and the dirty tree stopping without a cap grant pending human authorization. No fact regressed; the After wording delivers the Change while preserving everything Before kept, so no further rewording is needed.

exit: 0
