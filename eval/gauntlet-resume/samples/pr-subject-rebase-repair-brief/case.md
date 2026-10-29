bundle+: skills/gauntlet-handoff/SKILL.md
bundle+: skills/gauntlet-resume/reference/brief-contract.md
bundle+: skills/gauntlet-resume/reference/reconstruction.md
# Input

Describe candidate resolution and restoration using supplied observations instead of making tool calls.

A valid six-heading brief for /work/demo on branch repair-parser has no Process state. Its PR lines are:
PR: example/parser#42
Pre-rework head: 1111111111111111111111111111111111111111
Rework base: 4444444444444444444444444444444444444444
The brief's Intent is "Repair parsing" and Decisions is "Keep the parser API". Entry checks and grant validation pass. PR #42's fetched headRefName and the live worktree branch both equal repair-parser.

The configured directories are doc/specs and doc/plans. Both doc/specs/rework.md and doc/plans/rework.md were committed before rebase-form Task 1 rebased the committed artifacts and recorded HEAD 4444444444444444444444444444444444444444 as Rework base. Both files are tracked at that boundary. The added-file diff from that SHA to HEAD returns nothing, and there are no untracked artifacts. The run-worktree spec doc/specs/rework.md contains a Rework record listing PR: example/parser#42 - Repair parsing, the full Pre-rework head above, and the Rework base above. Its Problem lists doc/specs/original.md as the member-carried spec. That earlier spec and its carried plan are tracked at base too. There is no other record matching the brief's PR identities. The active task plan doc/plans/rework.md pairs by basename with rework.md. No ledger exists.

The plan has one task, Repair parser, with Files: Modify: src/parser.ts. The plan add-commit query in 4444444444444444444444444444444444444444..HEAD returns nothing; cat-file for the plan at that base succeeds. One post-base commit touches src/parser.ts. The working tree is clean. The human confirms the approved spec, continuation, proposed task status and stage when asked. plan_check passes. No gate history, closure review, or fix-round evidence is supplied.

Explain the scan base, explicit artifact identity and pairing, route, task-evidence boundary, human confirmation and restoration. Do not invent observations or stop at the empty added-file diff.
