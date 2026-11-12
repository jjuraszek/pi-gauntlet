bundle-: skills/gauntlet-resume/reference/reconstruction.md
bundle+: skills/brainstorming/reference/legs.md
bundle+: skills/finishing-a-development-branch/reference/legs.md
bundle+: skills/gauntlet-resume/SKILL.md
bundle+: skills/gauntlet-resume/reference/brief-contract.md
# Input

Override replay.md's checkpoint: each independent run below is at coordinated admission before any tracker write, not at plan_check. Narrate only admission through its stop or successful handoff to remaining entry checks; do not restore trackers yet. Use the supplied synthetic observations as tool results; do not execute tools.

Run home /work/repo-a/.worktrees/feature-shared-change; home primary /work/repo-a; branch feature/shared-change; approved home spec doc/specs/shared.md has ordered repo-a, repo-b. Home declares sibling git@github.com:acme/repo-b.git, so the declared primary is /work/repo-b with canonical common dir /work/repo-b/.git. Ordered brief membership matches. Home binding, approval and other entry checks pass. Brief active implement task W2: reader; task plan valid with W1 complete, W2 in_progress. No delivery receipt exists. The companion block records create: script/worktree add <name> <branch>, destroy: script/worktree remove <name>, and no home:, unless a variant says otherwise. Treat variants independently; every found tree exists, has checkout toplevel equal to its realpath, differs from primary and shares its canonical git common dir unless overridden.

A - empty lookup despite a recorded home. Brief companion worktree: missing. This variant records home: .worktrees/<name>. `git -C /work/repo-b worktree list --porcelain` returns only:
```
worktree /work/repo-b
HEAD aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
branch refs/heads/main

```
No linked block holds feature/shared-change. Do not test an expanded home path as a substitute for this result.

B - a found script-placed tree. Brief companion worktree: missing; no home: recorded. Worktree list returns the primary block from A followed by:
```
worktree /work/repo-b-trees/river-shared
HEAD bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
branch refs/heads/feature/shared-change

```
The selected path passes every location identity check. Its live branch is feature/shared-change; its canonical common dir is /work/repo-b/.git. The companion file at /work/repo-b-trees/river-shared/doc/specs/shared.md has **Home:** repo-a feature/shared-change doc/specs/shared.md. Its HEAD equals the brief's last recorded SHA and it is clean.

C - found tree does not bypass remaining admission. Same lookup and identity observations as B, but the companion file at that located path has **Home:** repo-a feature/shared-change doc/specs/other.md. Stop at the failed admission check.

D - an explicit path stays authoritative. Brief companion worktree: /work/repo-b-trees/recorded; it exists and its live branch is feature/shared-change with matching **Home:** tuple, but its canonical common dir is /work/impostor/.git. The declared primary is still /work/repo-b with /work/repo-b/.git. A different linked checkout at /work/repo-b-trees/river-shared would pass all checks if queried. Do not substitute it for the explicit brief path.
