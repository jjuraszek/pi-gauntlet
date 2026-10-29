Sample: anchored-task

Dispatch:
planPath: /workspace/project/plan.md
anchor: "### Task 4:"
Spec: /workspace/project/spec.md
Work from: /workspace/project
Implementer report: /workspace/project/reports/implementation.md
SCOPED_TEST_COMMANDS: node --test flag.test.mjs

State your next read, consume only these supplied observations, and review. Do not execute commands.

Read observation /workspace/project/plan.md:
```markdown
### Task 40: Decoy
Files: Create: wrong.mjs
### Task 4: Default flag
Leg: worker
Spec: § "Design" L9
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
L9: defaultFlag() returns false.
```
Read observations /workspace/project/task-rules.md and /workspace/project/worker-rules.md: keep the function pure; no extra exports.
Read observation /workspace/project/reports/implementation.md: claims Task 4 complete and tests passed. This is not proof.
Read observation diff: only flag.mjs added; flag.test.mjs already exists unchanged.
Whole-file read observation flag.mjs, line 1: `export function defaultFlag() { return false; }`
Whole-file read observation flag.test.mjs, line 1: `import { defaultFlag } from './flag.mjs';`
Line 2: `import assert from 'node:assert/strict';`
Line 3: `assert.equal(defaultFlag(), false);`
Those are the complete touched file and test. Give a per-clause review and structured JSON. Verify Tests/via/Create by reading, never by running the supplied command.
