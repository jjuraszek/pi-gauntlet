bundle+: skills/writing-plans/SKILL.md

## Fixed observations
Use only the Project overrides block from the bundled writing-plans skill, not its planning workflow. The first found overrides file is .pi/gauntlet-overrides.md. Its supplied content is:
```markdown
## conventions
Use American English in generated documents.
## writing-plans
Name plan examples with the prefix demo-.
```
Trace A: brainstorming enters with no overrides content in context, reads that file successfully, and completes its stage. writing-plans follows in the same session with that content still in context.
Trace B: an independent writing-plans entry is unsure whether the overrides content is in context. The file exists and a read succeeds with the supplied content above.

## Narrated read actions
Label traces A and B. Narrate ordered reads, stage transitions, and application of the supplied conventions. Only the overrides handling is under test; do not write a plan or invoke tools.
