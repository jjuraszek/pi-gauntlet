# Subagent-driven development review sources

Check that every plan task uses the N >= 1 wave loop, pre-integration SR reads each task's applied tree, and integrated CR reads staged and unstaged work against the fixed wave base. Repairs use tree-before/tree-after deltas even when the worker commits; acceptance precedes the folded wave commit and tracker completion.

The target loads `## Fix-Loop Rounds` through (excluding) `## When a Subagent Fails` from `skills/subagent-driven-development/SKILL.md` on both arms, plus its implementer and quality-review templates and the requesting-code-review skill/template. Text replays test dispatch decisions; `scripts/wave-review.test.mjs` executes the shipped shell recipes against real Git fixtures, including whole-diff committed-range reviews outside this target.

| Sample | Must hold |
|---|---|
| all-singleton-waves | Three linear code tasks each use nested singleton implementation, SR, integration, scoped tests, initial CR and accepted wave commit before completion; chain treePath or fallback snapshot supplies SR. Plain repairs/escalation and doc-only SR-only waves remain exceptions. |
| chain-wave-dispatch | One initial implementation-to-SR chain, prose SR verdicts, task-only spec-gap repair and snapshot re-review before integrated CR. |
| chain-stop-blocked | Identity-matched artifact recovery, independent stop/error diagnosis, retained sibling snapshot SR and no second chain in the same wave. |
| patch-review-snapshot | Older runtime materializes each task's patch at its base with isolated SR cwd and retains snapshots until terminal reports are saved. |
| snapshot-apply-failure | Failed snapshot setup stops review; never reviews unchanged parent files as implementation. |
| integrated-wave-repair | Singleton integrated repair runs in place with no commit/staging payload instruction; committed new-file repair still yields a repair-only tree delta; SR precedes CR, then folded commit and completion. |
| test-gate-repair | Dirty integrated test-gate repair runs in place, reruns both scoped commands, stages changes and renews affected-task SR before initial CR. |
| singleton-apply-failure | Zero surviving integration patches skip empty gates and commit, retry from unchanged clean base within two attempts, then stop without completion. |

All inputs are synthetic. Run `node eval/run.mjs subagent-driven-development` per `eval/README.md`. The deleted committed-sequential-review sample describes no supported plan-task execution path.
