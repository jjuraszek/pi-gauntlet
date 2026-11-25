bundle-: skills/gauntlet/brainstorm/spec-finalization.md
bundle+: skills/gauntlet/plan/plan.md

## Fixed observations
Use only the Project overrides block from the bundled plan instructions, not its planning workflow. The first found overrides file is .pi/gauntlet.md. Its supplied content is:
```markdown
# gauntlet
Use American English in generated run documents.
## plan
Name plan examples with the prefix demo-.
```
Trace A: brainstorming enters with no overrides content in context, reads that file successfully, and completes its stage. planning follows in the same session with that content still in context.
Trace B: an independent planning entry is unsure whether the overrides content is in context. The file exists and a read succeeds with the supplied content above.

## Narrated read actions
Label traces A and B. Narrate ordered reads, stage transitions, and application of the supplied conventions. Only the overrides handling is under test; do not write a plan or invoke tools.
