bundle+: skills/gauntlet-handoff/SKILL.md
bundle+: skills/gauntlet-resume/reference/brief-contract.md
bundle+: skills/gauntlet-resume/reference/reconstruction.md
# Input

Describe each independent operation using supplied observations instead of tool calls.

Producer: cohort wrote a valid six-heading brief for /work/demo on branch repair-parser. Phase status is implement(W1); plan status is `Plan: 0/1 done (1 in progress, 0 pending)` with `  → [0] W1: Repair parser`. The run-worktree spec has these top-level Rework record groups in order:
PR: example/parser#42 - Repair parsing
Pre-rework head: 1111111111111111111111111111111111111111
Threads: home-thread
PR: example/parser#43 - Parser errors
Pre-rework head: 2222222222222222222222222222222222222222
Threads: member-thread
PR: example/parser#44 - Parser boundaries
Pre-rework head: 3333333333333333333333333333333333333333
Threads: boundary-thread
The record also has `### PR #42`, `### PR #43`, and `### PR #44` detail subsections. Show the appended section, then describe the no-record and N=1 cases.

Consumer success: the resulting brief passes entry checks and grant validation. The first pair's fetched headRefName is repair-parser and the actual branch is repair-parser. Member branches are not supplied. Ordered record identities match the brief. After the first pair's pre-rework SHA, the scan finds doc/specs/rework.md, doc/plans/rework.md, doc/specs/member-errors.md, and doc/plans/member-errors.md. The carried member-errors.md task plan pairs by basename with doc/specs/member-errors.md. Reading rework.md shows the record above and lists doc/specs/member-errors.md under member #43 in `## Problem`. That member spec has no Rework record. The rework spec/plan pair is valid; plan_check passes. Describe selection and restore, preserving the task snapshot without inventing gate history or approval.

Variant pr-list-brief-mismatch: change only the actual branch to unrelated. Quote the exact stop and state whether tracker calls occur.

Variant pr-list-brief-order: keep the matching branch but change only the brief pair order to #42, #44, #43 (each head remains paired with its identity). Quote the stop with both fully qualified orders and state whether tracker calls occur.

Finally describe ordinary no-pair reconstruction and the case where two genuine rework candidates remain after member-path exclusion. Do not infer approval or choose by filename.
