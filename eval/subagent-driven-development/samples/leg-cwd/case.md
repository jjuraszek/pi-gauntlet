bundle-: skills/subagent-driven-development/reference/fix-loop.md
bundle-: skills/subagent-driven-development/stop-note.md
bundle+: skills/brainstorming/reference/legs.md
bundle+: skills/subagent-driven-development/SKILL.md
bundle+: agents/implementer.md
bundle+: agents/spec-reviewer.md
bundle+: agents/code-reviewer.md
bundle+: skills/writing-plans/reference/plan-contract.md
bundle+: agents/plan-writer.md
# Input

At wave dispatch. Spec has repo-a then repo-b, shared branch feature/shared-change. Home /work/repo-a/.worktrees/feature-shared-change, companion /work/repo-b/.worktrees/feature-shared-change. repo-a base aaaaaaa, repo-b base bbbbbbb. Both own src/parser.ts; their paths are distinct by (leg,path). W1 Task 1 home edits src/parser.ts, Rules: AGENTS.md. W2 Task 2 depends on Task 1, Leg: repo-b before Files:, Modify: src/parser.ts, Test: test/parser.test.mjs, Tests: node --test test/parser.test.mjs, baseline: bbbbbbb pass, Rules: pkg-x/AGENTS.md. plan_check passed. Describe wave roots, captures, implementation and both reviews. Independent run: plan_check rejects leg-unknown for repo-z. Another draft places both tasks in one wave.

Use the supplied synthetic observations as tool results. Narrate the prescribed actions and stops; do not execute tools. Treat independent observations as separate runs.
