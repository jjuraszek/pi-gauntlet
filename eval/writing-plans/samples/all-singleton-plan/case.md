# Input

Approved synthetic spec: /workspace/project/doc/specs/numbers.md. Worktree: /workspace/project. Plan path: /workspace/project/doc/plans/numbers.md. Skill files are installed at /opt/pi/skills/writing-plans/SKILL.md and /opt/pi/skills/writing-plans/reference/plan-contract.md. Phase status: plan in_progress. No plan exists yet. Overrides: none.

The approved code scope is three linear tasks with disjoint files: Parse integers (src/parse.mjs, tests/parse.test.mjs), Format integers (src/format.mjs, tests/format.test.mjs), Label integers (src/label.mjs, tests/label.test.mjs). Each task has its corresponding `node --test tests/<name>.test.mjs` scoped command and requires the previous task's summary. The writer must group them as three singleton waves without Solo lines.

Tool observations when called:
1. The fresh plan-writer returns PLAN WRITTEN /workspace/project/doc/plans/numbers.md.
2. The parent's plan_check on that path returns PASS - plan verified and stamped for implement-start.
3. A single read shows Wave 1 with Task 1: Parse integers, Wave 2 with Task 2: Format integers, Wave 3 with Task 3: Label integers. There are no Solo lines and no Open Questions.

Describe the writer dispatch, grouping/template constraints it follows, parent check, ordered tracker initialization and direct execution handoff. Do not write plan steps yourself. End after invoking the next skill. Stay under 850 words.
