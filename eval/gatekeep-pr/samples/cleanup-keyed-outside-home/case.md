bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
## Digest

- pr: { number: 732, title: "Tighten retry backoff", author: "mira-example", state: MERGED, isDraft: false, headRefName: feature/backoff, baseRefName: main, headRefOid: 8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, url: https://git.example.invalid/orchard/mono/pull/732, merge_commit: 5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d, files: [queue/retry.ts] }
- viewer: { login: "mira-example", is_author: true }
- permissions: { viewer_permission: WRITE, is_cross_repository: false, maintainer_can_modify: true, merge_state_status: CLEAN, can_update_branch: true, head_url: git@git.example.invalid:orchard/mono.git, head_ref: feature/backoff, head_pushable: true }
- status_checks: [ { name: "ci / test", status: COMPLETED, conclusion: SUCCESS, required: true } ]
- comments: { inline: [], top_level: [] }
- issue_ref: null; issue: null
- worktree: { path: /home/dev/scratch/backoff, branch: feature/backoff, created: false, destroy: null }
- overrides at merge-base: `## using-git-worktrees` with `- home: ../mono-<name>`; no `## cleanup` section
- primary: /work/mono on main, tracked-clean; `git -C /home/dev/scratch/backoff status --porcelain --untracked-files=no` prints nothing; `git -C /home/dev/scratch/backoff merge-base --is-ancestor HEAD 8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c` succeeds; `realpath` returns every path unchanged; `git worktree list --porcelain` lists `branch refs/heads/feature/backoff` for /home/dev/scratch/backoff

## Entry

The merged terminal menu rendered and the human picked numeric `1` (cleanup from the terminal menu). Narrate the cleanup steps through the re-rendered menu.

## Arguments

`732`
