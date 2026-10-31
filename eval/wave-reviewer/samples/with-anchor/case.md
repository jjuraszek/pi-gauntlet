Sample: with-anchor

Dispatch:
planPath: /workspace/project/plan.md
anchors: ["### Task 4:"]
Spec: /workspace/project/spec.md
Work from: /workspace/project
Implementer report: /workspace/project/reports/implementation.md
SCOPED_TEST_COMMANDS: none

Read observation /workspace/project/plan.md:
```markdown
### Task 40: Decoy
Files: Create: wrong.mjs
Spec: Design L11
### Task 4: Default flag
Leg: worker
Spec: Design L9-L10
Rules: task-rules.md
Files: Create: flag.mjs; Test: flag.test.mjs
Tests: node --test flag.test.mjs
via: defaultFlag
## Next wave
Create wrong-wave.mjs.
```
Read observation /workspace/project/spec.md:
```markdown
## Legs
### Leg: home
Rules: wrong-rules.md
### Leg: worker
Rules: worker-rules.md
## Design
L9: defaultFlag() returns false with no arguments.
L10: defaultFlag(true) returns true.
L11: laterFlag() returns false.
```
Task prose omitted the true-argument requirement, but cites L9-L10.
Read observations task-rules.md and worker-rules.md: keep the function pure; no extra exports.
Read observation reports/implementation.md: claims Task 4 complete and tests passed. This is not proof.
Read observation diff: only flag.mjs added; flag.test.mjs already exists unchanged.
Whole-file read observation flag.mjs, line 1: `export function defaultFlag() { return false; }`
Whole-file read observation flag.test.mjs:
1: `import { defaultFlag } from './flag.mjs';`
2: `import assert from 'node:assert/strict';`
3: `assert.equal(defaultFlag(), false);`

Review the cited slice, file contract and test entry point without executing commands. Emit clause rows before findings and matching structured output.
