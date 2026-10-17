# Repository state

Primary checkout: /work/acme-mono, on branch main, `git status --porcelain` prints nothing. `git symbolic-ref --short refs/remotes/origin/HEAD` prints origin/main. The requested feature branch is `topic;id`. The approved plan says the change touches only the top-level directory `billing/`.

`.pi/gauntlet-overrides.md` contains:

## using-git-worktrees
- home: ../acme-mono-<name>
- create: script/worktree create <name> <subproject> --branch <branch>

`script/worktree` exists and is executable. After the create command runs, `git worktree list --porcelain` prints `worktree /work/acme-mono` and `worktree /work/acme-mono-topic;id`.
