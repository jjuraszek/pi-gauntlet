bundle+: skills/gauntlet-resume/reference/brief-contract.md
# Input

Brief process state (verbatim from the brief):

Phases:
  ⊘ brainstorm (resume: doc/specs/2026-03-02-config-loader.md)
  ⊘ plan (resume: brief)
  → implement
  ○ verify
  ○ ship
Plan:
  ✓ [1] W1: Parse config file
  ✓ [2] W1: Validate schema
  → [3] W2: Wire CLI flag
  ○ [4] W3: Document the loader
Active task: W2: Wire CLI flag

Resolved paths: worktree /work/app/.worktrees/config-loader; plan doc/plans/2026-03-02-config-loader.md; spec doc/specs/2026-03-02-config-loader.md. The plan commit exists (a1b2c3d).

Tool results, in order:

1. `git -C /work/app/.worktrees/config-loader ls-files --error-unmatch -- doc/plans/2026-03-02-config-loader.md` -> exit 0.
2. `git -C /work/app/.worktrees/config-loader status --porcelain -- doc/plans/2026-03-02-config-loader.md` -> prints nothing.
3. `plan_check({ planPath: "/work/app/.worktrees/config-loader/doc/plans/2026-03-02-config-loader.md" })` ->
   FAIL (5 findings)
   quote-integrity @ line 120: Task 1 body does not contain the required verbatim literal `load_config` from its anchored spec lines
   quote-integrity @ line 121: Task 1 body does not contain the required verbatim literal `ConfigError` from its anchored spec lines
   quote-integrity @ line 124: Task 2 body does not contain the required verbatim literal `schema.json` from its anchored spec lines
   quote-integrity @ line 127: Task 3 body does not contain the required verbatim literal `--config` from its anchored spec lines
   quote-integrity @ line 128: Task 3 body does not contain the required verbatim literal `CONFIG_PATH` from its anchored spec lines
   Every row's anchor resolves (no anchor-resolution finding).
4. The second `plan_check` call on the same path -> PASS.
5. Every git and tracker call you make after that succeeds (exit 0).

Narrate the restore from tool result 3 to the closing line.
