bundle-: skills/gauntlet/implement/loop/human-stop.md
bundle+: skills/gauntlet-resume/SKILL.md
bundle+: skills/gauntlet-resume/reference/brief-contract.md

A human invokes `/skill:gauntlet-resume /tmp/plan-brief.md` in the primary checkout `/work/project`. The saved file is:

```text
# Handoff: Finish the parser plan
## Intent
Continue writing the approved parser design's task plan.
## Repo state
toplevel: /work/project
worktree: yes /work/project/.worktrees/parser
branch: feature/parser
HEAD: 2222222222222222222222222222222222222222
base: 1111111111111111111111111111111111111111
dirty: clean
diff-stat: doc/specs/parser.md | 12 ++++++++++++
test cmd: node --test test/parser.test.mjs
## Decisions
- The human approved the parser design and selected the task-plan engine.
## Open questions
- none
## Skills loaded: none
## Process state

Phases:
  ✓ brainstorm
  → plan(author)
  ○ implement
  ○ verify
  ○ ship

No plan active.

Active task: none
Gate history not restored - re-validate before advancing.
```

Read-only tool results: the session is idle; the worktree exists; both checkouts' canonical git common directory is `/work/project/.git`; live HEAD and dirt match the brief. The only spec candidate is `/work/project/.worktrees/parser/doc/specs/parser.md`, added after the candidate base. Its header is:

```markdown
# Parser design

**Engine:** waves
**Amend-grant:** none
```

The spec has one member and no Rework record. The human confirms the selected approved spec. There is no plan file or ledger yet. All tracker mutations that follow the legal arming order succeed. No repair or additional confirmation is needed.

Resume this recorded input. State each tracker call with its arguments, the restored active phase and substep, the plan snapshot, and the continuation boundary. Stop the replay at that boundary, before the plan writer does new work.
