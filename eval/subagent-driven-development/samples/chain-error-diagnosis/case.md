bundle-: skills/subagent-driven-development/wave-reviewer-prompt.md
bundle-: skills/subagent-driven-development/reference/happy-path-run.md
bundle-: skills/subagent-driven-development/reference/implement-amendments.md
bundle-: skills/subagent-driven-development/implementer-prompt.md
bundle-: skills/requesting-code-review/SKILL.md
bundle-: skills/requesting-code-review/wave-reviewer.md
bundle-: agents/wave-reviewer.md

The initial two-task wave chain failed without ## Outputs or a matched ## Stop. Artifacts: /tmp/chain-run and reports /tmp/reports/task4.md, /tmp/reports/task5.md are known. Manifest: planPath /workspace/project/doc/plans/feature.md, spec /workspace/project/doc/specs/feature.md, anchors ### Task 4: and ### Task 5:. The primary may list this run's capture paths; the supplied listing observation is no output.json files. Saved reports and source reads remain delegated except for the bounded report rule.

Show the listing and diagnosis dispatch, then route from this hypothetical structured diagnosis: tasks [{task:4,status:"DONE",reportPath:"/tmp/reports/task4.md",patchPath:"/tmp/chain-run/worktree-diffs/step-0/task-0-implementer.patch",diagnostic:"Task 4 has valid output and a nonempty patch."},{task:5,status:"BLOCKED",reportPath:"/tmp/reports/task5.md",diagnostic:"Required structured output is absent."}], decision:"repair", diagnostic:"Retain task 4 and repair task 5." Also explain retry/stop decisions and diagnosis-child failure. Do not rerun accepted siblings or invent missing task 5 verdicts.
