Sample: unreadable-anchor

Dispatch:
planPath: /workspace/project/plan.md
anchor: "### Task 4:"
Spec: /workspace/project/spec.md
Implementer report: /workspace/project/reports/implementation.md
SCOPED_TEST_COMMANDS: node --test flag.test.mjs

State your next read, then consume this supplied observation. No live tools exist.
Read observation /workspace/project/plan.md:
```markdown
### Task 40: Decoy
Files: Create: decoy.mjs
## End
```
Task 4 is absent. The implementer claims success, but no selected task can be read. Emit your report and matching structured JSON without asking the parent to read the plan or running any commands.
