# State

PRIMARY is /work/acme-mono on branch main; WORKTREE is /work/acme-mono-fix-x; FEATURE is fix-x. `realpath` of both paths returns them unchanged.

`.pi/gauntlet-overrides.md` at the primary contains:

## using-git-worktrees
- home: ../acme-mono-<name>
- destroy: script/worktree destroy <name>

`script/worktree destroy 'fix-x'` run from /work/acme-mono exits 1 and prints `error: worktree fix-x has unsynced changes`.
