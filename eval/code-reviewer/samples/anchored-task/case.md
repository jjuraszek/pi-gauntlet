Sample: anchored-task

Dispatch:
planPath: /workspace/project/plan.md
anchors: ["### Task 4:", "### Task 5:"]
Spec: /workspace/project/spec.md
Work from: /workspace/project
Implementer reports: /workspace/project/reports/task4.md, /workspace/project/reports/task5.md
BASE_SHA: synthetic-base
HEAD_SHA: WORKTREE
SCOPED_TEST_COMMANDS: none

State your next read, consume only these observations, and review the integrated diff. No live tools exist.

Read observation /workspace/project/plan.md:
```markdown
### Task 40: Decoy
Files: Create: decoy.mjs
### Task 4: Default flag
Spec: § "Design" L7
Rules: task-rules.md
Files: Create: flag.mjs
Tests: none: supplied review only
### Task 5: Describe default
Spec: § "Design" L8
Rules: task-rules.md
Files: Create: flag.md
Tests: none: documentation
## Next wave
Create wrong-wave.md.
```
Read observation /workspace/project/spec.md:
```markdown
## Legs
### Leg: project
Rules: home-rules.md
## Design
L7: defaultFlag() returns false.
L8: flag.md states Flag: off.
```
Read observations /workspace/project/task-rules.md and /workspace/project/home-rules.md: keep the function pure and document its actual default.
Read observations of both implementer reports: each claims its task complete. Verify rather than trusting them.
Integrated diff and complete file observations:
flag.mjs:1 added `export function defaultFlag() { return true; }`
flag.md:1 added `Flag: off`
No other files changed. No commands were supplied or executed.
Return the review and structured JSON. Include owner task numbers for any needed repair and the required Behaviour-change footer.
