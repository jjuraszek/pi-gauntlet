Sample: partial-wave-ship

Dispatch:
planPath: /workspace/project/plan.md
anchors: ["### Task 4:"]
Spec: /workspace/project/spec.md
Work from: /workspace/project
SCOPED_TEST_COMMANDS: none

Read observation plan.md:
```markdown
## Wave 1
### Task 40: Decoy
Spec: Design L20
Files: Create: wrong.mjs
### Task 4: Default flag
Leg: worker
Spec: Acceptance criteria L1; Design L9
Rules: task-rules.md
Files: Create: flag.mjs; Test: flag.test.mjs
Tests: node --test flag.test.mjs
via: defaultFlag
## Wave 2
### Task 5: Later flag
Spec: Acceptance criteria L2; Design L10
Files: Create: later.mjs
```
Read observation spec.md:
```markdown
## Legs
### Leg: home
Rules: wrong-rules.md
### Leg: worker
Rules: worker-rules.md
## Acceptance criteria
L1: defaultFlag() returns false.
L2: laterFlag() returns true.
## Design
L9: Keep: defaultFlag() is pure and has no other exports.
L10: laterFlag() is exported from later.mjs.
L20: Decoy rule.
```
Read observations task-rules.md and worker-rules.md: keep the function pure; no extra exports.
Read observation implementer report: Task 4 complete; Task 5 belongs to wave 2.
Diff: flag.mjs and flag.test.mjs added; no later.mjs exists.
Whole-file read observation flag.mjs, line 1: `export function defaultFlag() { return false; }`
Whole-file read observation flag.test.mjs:
1: `import { defaultFlag } from './flag.mjs';`
2: `import assert from 'node:assert/strict';`
3: `assert.equal(defaultFlag(), false);`

Review only wave 1 and emit matching structured output.
