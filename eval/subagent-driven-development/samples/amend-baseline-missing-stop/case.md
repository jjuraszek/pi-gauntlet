bundle-: skills/subagent-driven-development/wave-reviewer-prompt.md
bundle-: skills/subagent-driven-development/reference/happy-path-run.md
bundle-: skills/subagent-driven-development/implementer-prompt.md
bundle-: skills/requesting-code-review/SKILL.md
bundle-: skills/requesting-code-review/wave-reviewer.md
bundle-: agents/wave-reviewer.md

During implement, plan-writer completionGuard remains true. One-task Amend-apply dispatch prints no structured JSON and reports completion guard failure; Artifacts /tmp/apply. Exactly one capture /tmp/apply/structured-output/step1/output.json is 600 bytes with {"status":"success","value":{"amendedSections":[],"tasksAdded":[],"tasksAnchorChanged":[],"tasksRemoved":[],"passed":false,"failLines":["baseline read failed: git -C /workspace/app show HEAD:doc/plans/new.md - fatal: path 'doc/plans/new.md' exists on disk, but not in 'HEAD'"]}}. Compare zero captures, two captures with paths step1/output.json and step2/output.json, malformed APPLY_SCHEMA, and a valid passed false value whose failLines is ["Task anchor mismatch"]. Show admission and routing without live tools or source reads.
