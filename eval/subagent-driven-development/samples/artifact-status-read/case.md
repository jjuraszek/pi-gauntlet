bundle-: skills/subagent-driven-development/wave-reviewer-prompt.md
bundle-: skills/subagent-driven-development/reference/happy-path-run.md
bundle-: skills/subagent-driven-development/reference/implement-amendments.md
bundle-: skills/subagent-driven-development/implementer-prompt.md
bundle-: skills/requesting-code-review/SKILL.md
bundle-: skills/requesting-code-review/wave-reviewer.md
bundle-: agents/wave-reviewer.md

The initial wave chain failed without ## Outputs or a matched ## Stop. Its two isolated tasks were dispatched separately with anchors "### Task 4:" and "### Task 5:". Owning checkout: /workspace/project. planPath: /workspace/project/doc/plans/feature.md. Spec: /workspace/project/doc/specs/feature.md. Leg: project; combined Rules carried in the manifest. Reports: /tmp/reports/task4.md and /tmp/reports/task5.md. Artifacts: /tmp/chain-run. WAVE_BASE_SHA: 1111111111111111111111111111111111111111. Both task indices remain in_progress and both failed counters are zero.

Supplied listing observation: /tmp/chain-run/structured-output/a/output.json and /tmp/chain-run/structured-output/b/output.json.
Supplied complete bounded reads:
- a/output.json: {"status":"success","value":{"status":"DONE","reasoning":"Scoped tests pass.","anchor":"### Task 4:"}}
- b/output.json: {"status":"success","value":{"status":"NEEDS_CONTEXT","reasoning":"Need the documented fixture path.","question":"Which fixture is named in the verification guide?","anchor":"### Task 5:"}}
Task 4's Artifacts patch /tmp/chain-run/worktree-diffs/step-0/task-0-implementer.patch is nonempty; Task 5's patch is zero bytes. Supplied Task 4 apply observation: exit 0. No other operation ran. The verification guide is /workspace/project/doc/verification.md, and its location is a fact lookup, not a design choice.

Show capture listing and bounded reads, then the next integration and question-routing operations. Stop after the fact-lookup dispatch; do not invent its answer, rerun Task 4, or open saved reports merely to relay statuses. Explain the fallback for a missing conditional field or truncated capture and the stop for two captures claiming Task 5.
