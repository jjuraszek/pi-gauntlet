bundle+: agents/plan-writer.md
bundle-: skills/writing-plans/SKILL.md

Role: plan-writer

Override the generic replay endpoint for this case: narrate each read call with its path and the portion read, in order, before showing the single-task plan fragment and the final one-line reply. This is a text replay using the supplied observations, not a live-tool run. Follow the persona's procedure on the dispatched task; keep the response under 900 words.

Dispatched task:
Write the implementation plan for the approved spec. Worktree: `/workspace/app`. Spec: `/workspace/app/doc/specs/hook.md`. Plan path: `/workspace/app/doc/plans/hook.md`. Plan contract: `/workspace/tools/skills/writing-plans/reference/plan-contract.md`.

Observed reads and commands:
- `/workspace/app/AGENTS.md` names `npm test` as full verification, no style commands, and no happy path. None of the three overrides files exists. No plan exists yet.
- The supplied plan contract path contains the bundled plan contract text in full. Other supplied paths resolve as named.
- The approved spec has no Legs or additional Rules. Its normative lines, with citation numbers that are not file content, are below.
- `src/hook.ts` exports `isHook(value)` and currently returns true for every value. `tests/hook.test.ts` imports that export and checks a valid string. The command `node --test tests/hook.test.ts` selects the existing test file.
- HEAD is abc1234; the full untracked-file status inventory is empty. The scoped command exits 0 with 1 test passed and leaves both HEAD and status unchanged. These are measured baseline observations, not results for the future assertion.
- The saved plan's self-check returns PASS and its judgment checks request no edit. The parent owns stamping and task initialization.

Approved spec:
```text
1 # Validate hook input
2
3 ## Design
4 Make `isHook` return false for non-string input in `src/hook.ts`.
5 Extend `tests/hook.test.ts` with a non-string case and keep the string case passing.
6
7 ## Acceptance criteria
8 - [ ] Hook validation accepts only strings.
```

Show the header, Task 1 Files, Tests with measured baseline, spec anchors and coverage, and TDD-shaped steps. End with the persona's ordinary final reply.
