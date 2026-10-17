# Repository state

Primary checkout: /work/acme-ops, on branch main, `git status --porcelain` prints nothing. `git symbolic-ref --short refs/remotes/origin/HEAD` prints origin/main. The requested feature branch is `alerts`.

`.pi/gauntlet-overrides.md` contains:

## using-git-worktrees
Use the project's wrapper: `script/worktree create <name>`. It provisions an isolated database and copies `.env.local`. Never call `git worktree add` directly.

`script/worktree` exists and is executable; `script/worktree create alerts` creates /work/acme-ops-alerts and prints that path. After it runs, `git worktree list --porcelain` lists /work/acme-ops-alerts.
