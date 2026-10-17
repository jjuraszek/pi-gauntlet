# Repository state

Primary checkout: /work/acme-web, on branch main, `git status --porcelain` prints nothing. `git symbolic-ref --short refs/remotes/origin/HEAD` prints origin/main. The requested feature branch is `login-copy`.

No gauntlet overrides file exists. No native worktree tool is available. No script named worktree exists and AGENTS.md names no wrapper. `git check-ignore -q .worktrees` exits 1. After any `git worktree add`, `git worktree list --porcelain` lists the added path.
