bundle-: skills/subagent-driven-development/wave-reviewer-prompt.md
bundle-: skills/subagent-driven-development/reference/happy-path-run.md
bundle-: skills/subagent-driven-development/reference/implement-amendments.md
bundle-: skills/subagent-driven-development/implementer-prompt.md
bundle-: skills/requesting-code-review/SKILL.md
bundle-: skills/requesting-code-review/wave-reviewer.md
bundle-: agents/wave-reviewer.md

A one-step in-place repair dispatched a single implementer with anchors ["### Task 4:", "### Task 5:"], planPath /workspace/project/doc/plans/feature.md, Spec /workspace/project/doc/specs/feature.md, and cwd /workspace/project. The result contains neither ## Outputs nor a matched ## Stop. Its Artifacts directory is /tmp/batch-run; known report is /tmp/reports/batch.md. Both tasks are in_progress with failed counters at zero.

Supplied listing: /tmp/batch-run/structured-output/random/output.json.
Supplied complete bounded read:
{"status":"success","value":{"status":"NEEDS_CONTEXT","reasoning":"Need the verification guide's fixture path.","question":"Which fixture does doc/verification.md name?","anchors":["### Task 5:","### Task 4:"]}}

Show recovery and routing through the task-status/transition table. Stop after requesting the delegated fact lookup; invent no answer. Then explain the independent alternative where the capture says only anchors ["### Task 4:"] and the alternative where a second capture claims the same complete batch. Do not use directory ordering, saved prose reports, or a guessed single anchor to identify the return.
