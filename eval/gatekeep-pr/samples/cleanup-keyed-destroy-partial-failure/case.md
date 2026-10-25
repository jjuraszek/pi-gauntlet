bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
## Digest

- pr: { number: 733, title: "Add CSV export retries", author: "mira-example", state: MERGED, isDraft: false, headRefName: feature/csv-retries, baseRefName: main, headRefOid: 9999999999999999999999999999999999999999, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, url: https://git.example.invalid/orchard/mono/pull/733, merge_commit: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, files: [reports/export.ts, reports/export.test.ts] }
- viewer: { login: "mira-example", is_author: true }
- permissions: { viewer_permission: WRITE, is_cross_repository: false, maintainer_can_modify: true, merge_state_status: CLEAN, can_update_branch: true, head_url: git@git.example.invalid:orchard/mono.git, head_ref: feature/csv-retries, head_pushable: true }
- status_checks: [ { name: "ci / test", status: COMPLETED, conclusion: SUCCESS, required: true } ]
- comments: { inline: [], top_level: [] }
- issue_ref: null; issue: null
- worktree: { path: /work/mono-pr-733, branch: feature/csv-retries, created: true, destroy: "script/worktree destroy 'pr-733'" }
- overrides at merge-base: `## using-git-worktrees` with `- home: ../mono-<name>`, `- create: script/worktree create <name> <subproject> --branch <branch>`, `- destroy: script/worktree destroy <name>`; no `## cleanup` section
- primary: /work/mono on main, tracked-clean; `git -C /work/mono-pr-733 status --porcelain --untracked-files=no` prints nothing; `git -C /work/mono-pr-733 merge-base --is-ancestor HEAD 9999999999999999999999999999999999999999` succeeds; `realpath` returns every path unchanged; `script/worktree destroy 'pr-733'` run from /work/mono removes /work/mono-pr-733, then exits 1 printing `error: database teardown failed for pr-733`; afterwards `git worktree list --porcelain` no longer lists /work/mono-pr-733 or `branch refs/heads/feature/csv-retries`

## Entry

The merged terminal menu rendered and the human picked numeric `1` (cleanup from the terminal menu). Narrate the cleanup steps through the re-rendered menu.

## Arguments

`733`
