Scenario A: missing result and blocked decision

The owning checkout is /workspace/project, absolute planPath /workspace/project/doc/plans/feature.md, authoritative Spec /workspace/project/doc/specs/feature.md. Manifest anchors are ### Task 1:, ### Task 2: and ### Task 3:. WAVE_BASE_SHA is 1111111111111111111111111111111111111111; tracker indices are stable and in_progress during repair. All inputs are synthetic fixed observations. Task 1 returns DONE with a valid patch while Task 2 returns BLOCKED with a takeable in-task decision under amend permission and one ordinary attempt left; Task 3 has missing structured output. No capture matches Task 3. Identity-matched artifacts are available for diagnosis. Show next concrete commands and dispatches; invent no execution.

Scenario B: lookup only

Independently, both dispatched tasks have structured results. Task 1 returns DONE; Task 2 returns NEEDS_CONTEXT asking for a fixture path, which the delegated lookup resolves. No task or dispatch failed. Show the continuation. Narrate your procedure reads in order for each scenario.
