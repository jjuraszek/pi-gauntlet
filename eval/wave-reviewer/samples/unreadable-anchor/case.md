Sample: unreadable-anchor

Dispatch:
planPath: /workspace/project/plan.md
anchors: ["### Task 4:", "### Task 7:"]
Spec: /workspace/project/spec.md
Work from: /workspace/project
SCOPED_TEST_COMMANDS: none

Read observation /workspace/project/plan.md (complete):
```markdown
### Task 40: Decoy
Spec: Design L40
### Task 4: Default flag
Spec: Design L9
Files: Create: flag.mjs
### Task 70: Another decoy
Spec: Design L70
```
The exact heading `### Task 7:` is absent. No other observations are available. Emit the report and structured output; do not ask the parent to read the plan.
