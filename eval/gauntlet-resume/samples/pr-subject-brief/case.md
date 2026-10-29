bundle+: skills/gauntlet-handoff/SKILL.md
bundle+: skills/gauntlet-resume/reference/brief-contract.md
bundle+: skills/gauntlet-resume/reference/reconstruction.md
# Input

Describe each independent operation, using supplied observations instead of making tool calls.

Producer: cohort wrote a valid six-heading brief for /work/demo on branch repair-parser. The active phase is implement, substep W1. Plan status is `Plan: 0/1 done (1 in progress, 0 pending)` with `  → [0] W1: Repair parser`. The run-worktree spec contains a Rework record naming `PR: example/parser#42 - Repair parsing` and `Pre-rework head: 1111111111111111111111111111111111111111`. Show the appended section. Then describe the difference when that spec has no Rework record. Independent rebase variant adds `Rework base: 4444444444444444444444444444444444444444` to that record. Show its producer line order and consumer scan base. In that variant the old original.md and a superseded doc/specs/old-rework.md predate 4444...; only the valid rework.md/spec-plan pair is added after 4444.... Keep the original no-Rework-base variant as fallback.

Consumer: the resulting brief passes existing entry checks and grant validation. PR #42's fetched headRefName is repair-parser. The live branch is repair-parser. The old PR spec doc/specs/original.md predates 1111111111111111111111111111111111111111. Only doc/specs/rework.md and doc/plans/rework.md were added after that SHA; they pair by basename. A merge-base scan would also find original.md. The selected plan_check passes. Describe candidate selection and restoration, including task statuses and the closing warning. No approval, gate history, closure review, or fix-round evidence is supplied.

Repeat consumer branch validation independently with `git -C /work/demo branch --show-current` observed as `unrelated` instead of `repair-parser`. Quote the exact stop and identify whether any tracker write occurs.

Finally describe candidate selection for a brief without the optional pair and for a bare-worktree argument. Retain ordinary entry, grant, plan repair, task evidence, and human confirmation rules. Do not invent observations beyond those supplied.
