bundle-: skills/gauntlet/implement/loop/human-stop.md
bundle+: skills/gauntlet-resume/SKILL.md
bundle+: skills/gauntlet-resume/reference/brief-contract.md

A human invokes `/skill:gauntlet-resume /tmp/ship-brief.md` in the primary checkout `/work/project`. The saved file is:

```text
# Handoff: Deliver the parser change
## Intent
Continue the interrupted delivery with fresh verification.
## Repo state
toplevel: /work/project
worktree: yes /work/project/.worktrees/parser
branch: feature/parser
HEAD: 2222222222222222222222222222222222222222
base: 1111111111111111111111111111111111111111
dirty: clean
diff-stat: doc/plans/parser.md | 30 ++++++++++++++++++++++++++++++
test cmd: node --test test/parser.test.mjs
## Decisions
- The human approved the parser design and selected the task-plan engine.
## Open questions
- none
## Skills loaded: none
## Process state

Phases:
  ✓ brainstorm
  ✓ plan
  ✓ implement
  ✓ verify
  → ship

Plan: 3/3 done (1 skipped)

  ✓ [0] W1: parser contract
  ⊘ [1] W1: optional adapter
  ✓ [2] W2: parser implementation

Active task: none
Gate history not restored - re-validate before advancing.
```

Read-only tool results: the session is idle; the worktree exists; both checkouts' canonical git common directory is `/work/project/.git`; live HEAD and dirt match the brief. The only spec/plan pair added after the candidate base is `/work/project/.worktrees/parser/doc/specs/parser.md` and `/work/project/.worktrees/parser/doc/plans/parser.md`. The spec header is:

```markdown
# Parser design

**Engine:** waves
**Amend-grant:** none
```

The spec has one member and no Rework record. The human confirms the selected approved spec and saved task snapshot. The task plan is present, clean, tracked, and passes `plan_check` on its absolute path once the flow is armed. There is no ledger. All tracker mutations that follow the legal arming order succeed. No repair or additional confirmation is needed.

Resume this recorded input. State each tracker call with its arguments, the restored active phase, the complete task snapshot, and the continuation boundary. Stop the replay at that boundary, before running fresh verification or delivery.
