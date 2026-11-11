Evaluate the plan contract's authoring rules with the approved spec and observed repository facts below. Produce the plan Markdown that the plan-writer would write, not the orchestrator's dispatch or the persona's final status reply. Treat this as a text-only contract exercise: use the supplied read and baseline observations, make no live-tool or file-write claims, and keep the whole response under 800 words.

Home: /workspace/app. Spec: /workspace/app/doc/specs/retire.md. Plan: /workspace/app/doc/plans/retire.md. Plan skill: /workspace/tools/skills/writing-plans/SKILL.md. Plan contract: /workspace/tools/skills/writing-plans/reference/plan-contract.md.

Observed state:
- No plan exists yet. HEAD is abc1234, and status is clean. Repository conventions specify npm test as the full verification entrypoint and no happy-path command. There are no additional overrides or legs.
- src/legacy.ts exists and contains exactly `export const retired = true;` followed by a newline. No file imports it. No source, test, configuration or documentation file needs editing; the approved change only removes this one file.
- tests/retirement.test.mjs exists, exercises the supported public entrypoint without importing src/legacy.ts and has a file-addressable command `node --test tests/retirement.test.mjs`. At abc1234 this command exits 0 with 2 passing tests, 0 failures and no working-tree or HEAD changes. The test file needs no edits.
- Use the checker-required `---` separator after the plan header and before the first wave. Match each coverage row's full anchor (heading and line range) to an exact member of the owning task's Spec anchor set; use Design L4-L5 and Acceptance criteria L8-L9 in both places.
- Source inspection confirms the facts above. All spec lines are shown below with line numbers for citation only; the numbers are not file content. Self-check the resulting plan, retaining the supplied measured baseline rather than inventing additional work. The parent owns stamping and task initialization.

Approved spec:
```text
1 # Retire unused adapter
2
3 ## Design
4 Remove `src/legacy.ts`; no other repository file changes.
5 Keep the supported public entrypoint working.
6
7 ## Acceptance criteria
8 - [ ] The unused adapter is absent.
9 - [ ] The supported public entrypoint still works.
```
