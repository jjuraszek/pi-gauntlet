# Repository state

Primary checkout: /work/acme-api, on branch main, `git status --porcelain` prints nothing. `git symbolic-ref --short refs/remotes/origin/HEAD` prints origin/main. The requested feature branch is `rate-limit`.

`.pi/gauntlet-overrides.md` contains:

## using-git-worktrees
- home: ../acme-api-worktrees/<name>

No script named worktree exists anywhere in the repository and AGENTS.md names no wrapper. After any `git worktree add`, `git worktree list --porcelain` lists the added path.
