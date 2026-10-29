Sample: anchored-task

Dispatch:
planPath: /workspace/project/plan.md
anchor: "### Task 4:"
Spec: /workspace/project/spec.md
Work from: /workspace/project
SCOPED_TEST_COMMANDS: none

State your next read, consume these supplied observations, and report the task result. No live tools exist in this replay.

Read observation /workspace/project/plan.md:
```markdown
### Task 40: Decoy
Files: Create: wrong.md
### Task 4: Document a flag
Spec: § "Design" L7
Rules: task-rules.md
Files: Create: flag.md
Tests: none: documentation only
## Next wave
Create wrong-wave.md too.
```
Read observation /workspace/project/spec.md:
```markdown
## Legs
### Leg: project
Rules: home-rules.md
## Design
Create flag.md containing exactly `Flag: off`.
```
Read observations /workspace/project/task-rules.md and /workspace/project/home-rules.md: keep the flag line literal; create no extra files.
Supplied work observation: flag.md was created with exactly `Flag: off`; no other files changed. No commands were supplied or executed.

Also answer an independent inline alternative: the dispatch contains no planPath or anchor, only `Create note.md containing exactly Note: ready. SCOPED_TEST_COMMANDS: none`. Supplied work observation: note.md was created exactly as requested. Explain whether a plan read is needed and report that alternative separately, including structured status.
