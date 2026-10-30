Sample: unreadable-anchor

Dispatch:
planPath: /workspace/project/plan.md
anchors: ["### Task 4:", "### Task 5:"]
Spec: /workspace/project/spec.md
HEAD_SHA: WORKTREE
SCOPED_TEST_COMMANDS: none

State your next read, then consume this supplied observation. No live tools exist.
Read observation /workspace/project/plan.md:
```markdown
### Task 4: Present task
Files: Create: flag.mjs
### Task 50: Decoy, not Task 5
Files: Create: decoy.mjs
## End
```
The second anchor is absent. No reviewable complete task union exists. Do not review the partial union as successful or ask the parent to read it. Emit the report and structured JSON with the normal footer.
