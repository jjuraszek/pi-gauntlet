bundle+: skills/brainstorming/reference/legs.md
bundle+: skills/finishing-a-development-branch/reference/legs.md
# Input

You are at Step 6 of finishing, not draft-spec publication. Treat the following observations as tool results and narrate the commands and read-backs without executing tools. Give one section per independent observation A-D, at most 1400 words total.

Shared branch: feature/shared-change. Run home: repo-a at /work/repo-a/.worktrees/feature-shared-change. Companion order: repo-b then repo-c. Primaries: /work/repo-a, /work/repo-b, /work/repo-c. All branches, canonical common directories, checkout toplevels, and companion Home tuples pass identity checks. The home spec records these contracts:

| Leg | home | destroy |
|---|---|---|
| repo-a | .worktrees/<name> | git worktree remove <home> && git worktree prune |
| repo-b | absent | script/tree destroy <name> --branch <branch> |
| repo-c | ../repo-c-slot-<name> | script/tree destroy <name> --branch <branch> |

Each primary's worktree list --porcelain has its primary first on main, then exactly one linked block on refs/heads/feature/shared-change. Repo-b's block names /work/repo-b/trees/placed-fix-x, not a flattened-branch folder; repo-c's block names /work/repo-c-slot-fix-x. The brief's repo-b path /work/repo-b/.worktrees/feature-shared-change is stale and absent. No lookup resolves a tree from that brief path. New overrides suggest builtin removal for repo-b; the recorded contract is unchanged. Only home owns receipts, in /work/repo-a/.git/gauntlet/receipts/shared.md/.

A. Coordinated squash has completed and every primary's post-squash verification passed. Each destroy succeeds, and each following read-back finds its tree neither listed nor on disk, with the local feature ref still present. Narrate locating repo-b, each primary-targeted teardown and branch deletion in order, receipt handling, and the final per-repo outcomes. Use shell-word-safe literal arguments, not placeholders. For repo-c, state how its name differs from repo-b's and from the shared flattened branch name.

B. Independent one-member finish after squash, with repo-b as the session home at /work/repo-b/trees/placed-fix-x and its same recorded contract. No companion loop or receipt exists. Show both outcomes separately: B1 destroy exits 1 with `error: final hook failed`, but the read-back finds the tree neither listed nor on disk and refs/heads/feature/shared-change present; B2 destroy exits 0 with `done`, but the read-back finds the tree still listed and on disk with its branch present. State the three read-back probes and the actual branch/tree report for each. No teardown hooks run before these commands.

C. Independent one-member variant of B whose recorded block has neither home nor destroy. New overrides offer a destroy command. State cleanup ownership and whether a command or branch deletion runs. Separately state which source a legacy spec without Legs reads at finish time.

D. Coordinated Discard, same trees/contracts as A, before typed confirmation. List what the confirmation covers (repo-a 2 commits, repo-b 3, repo-c 1) and then separately continue after the user types exactly `discard`. Repo-b's configured teardown hook refuses with `exit 1 tree busy` before its wrapper; read-back finds both tree and branch intact. Repo-c's wrapper and home's builtin removal succeed with trees absent and branches present. Narrate the remaining attempts, branch and receipt outcomes, and whether plan stripping, telemetry sealing, fallback removal, or marking ship complete occurs.
