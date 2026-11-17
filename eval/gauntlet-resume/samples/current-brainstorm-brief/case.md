bundle+: skills/gauntlet-resume/SKILL.md
bundle+: skills/gauntlet-resume/reference/brief-contract.md

A human invokes `/skill:gauntlet-resume /tmp/brainstorm-brief.md` in the primary checkout `/work/project`. The saved file is:

```text
# Handoff: Review the parser design
## Intent
Continue the design review, without treating the draft as approved.
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
- Keep the parser change in one repository.
## Open questions
- Await the human's design approval.
## Skills loaded: none
## Process state

Phases:
  → brainstorm(spec-review)
  ○ plan
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

The spec has one member and no Rework record. There is no plan or ledger. The human confirms this is the draft to continue reviewing, not an approved spec. All tracker mutations that follow the legal arming order succeed. No repair or additional confirmation is needed.

Resume this recorded input. State each tracker call with its arguments, the restored active phase and substep, the plan snapshot, and the continuation boundary. Do not perform later-stage work.
