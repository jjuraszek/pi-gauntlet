# Repository state

Primary checkout: /work/acme-mono, on branch main, `git status --porcelain` prints nothing. `git symbolic-ref --short refs/remotes/origin/HEAD` prints origin/main. The requested feature branch is `csv-export`. The approved plan says the change touches only the top-level directory `reports/`.

`.pi/gauntlet-overrides.md` contains:

## using-git-worktrees
- home: ../acme-mono-<name>
- create: script/worktree create <name> <subproject> --branch <branch>
- destroy: script/worktree destroy <name>
The wrapper symlinks `build/` into the new tree.

`script/worktree` exists and is executable. After the create command runs, `git worktree list --porcelain` prints `worktree /work/acme-mono` and `worktree /work/acme-mono-csv-export`.
