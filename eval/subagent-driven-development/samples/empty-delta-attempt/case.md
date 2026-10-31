bundle-: skills/subagent-driven-development/wave-reviewer-prompt.md
bundle-: skills/subagent-driven-development/reference/happy-path-run.md
bundle-: skills/subagent-driven-development/reference/implement-amendments.md
bundle-: skills/subagent-driven-development/implementer-prompt.md
bundle-: skills/requesting-code-review/SKILL.md
bundle-: skills/requesting-code-review/wave-reviewer.md
bundle-: agents/wave-reviewer.md

The owning checkout is /workspace/project, absolute planPath /workspace/project/doc/plans/feature.md, authoritative Spec /workspace/project/doc/specs/feature.md. Manifest anchors are ### Task 1: and ### Task 2:. WAVE_BASE_SHA is 1111111111111111111111111111111111111111; tracker indices are stable and in_progress during repair. All inputs are synthetic fixed observations.

Scenario 1: A FIX_FIRST repair returns DONE with no tracked change; scratch tree-before and tree-after are identical. Task 1 failed counter is 1 before this result. Show the next operation.

Scenario 2, independent initial wave: Task 1 returns {"status":"DONE","reasoning":"Complete.","anchor":"### Task 1:"}, but its Artifacts patch path is missing. Compare a present zero-byte patch. Task 2 has already been accepted and integrated, and failed[1] is zero. Show patch admission, counter and repair; preserve Task 2. Compare a nonempty initial patch whose git apply fails.

Scenario 3, independent in-place wave: Task 1 returns DONE with no exported patch. Show the gate/review path without inventing a new empty-diff check.

Show concrete next commands and one-step schema-bound file-only foreground carriers. Do not invent outcomes.
