bundle-: skills/gauntlet/ship/pr-branch-push.md
bundle-: skills/gauntlet-resume/reference/restore-loop.md
bundle-: skills/gauntlet-resume/reference/coordinated.md
Workflow stage: Step 6, after a successful local squash-merge (option 3).

# State

PRIMARY is /work/acme-mono on branch main; WORKTREE is /work/acme-mono-fix-x; FEATURE is fix-x. `realpath` of both paths returns them unchanged.

`.pi/gauntlet.md` at the primary contains:

# shared
## worktrees
- home: ../acme-mono-<name>
- destroy: script/worktree destroy <name>

`script/worktree destroy 'fix-x'` run from /work/acme-mono exits 1 and prints `error: worktree fix-x has unsynced changes`.
