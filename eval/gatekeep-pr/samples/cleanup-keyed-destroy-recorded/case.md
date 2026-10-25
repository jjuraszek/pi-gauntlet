bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
## Digest

- pr: { number: 731, title: "Add CSV export", author: "mira-example", state: MERGED, isDraft: false, headRefName: feature/csv-export, baseRefName: main, headRefOid: 7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, url: https://git.example.invalid/orchard/mono/pull/731, merge_commit: 9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b, files: [reports/export.ts, reports/export.test.ts] }
- viewer: { login: "mira-example", is_author: true }
- permissions: { viewer_permission: WRITE, is_cross_repository: false, maintainer_can_modify: true, merge_state_status: CLEAN, can_update_branch: true, head_url: git@git.example.invalid:orchard/mono.git, head_ref: feature/csv-export, head_pushable: true }
- status_checks: [ { name: "ci / test", status: COMPLETED, conclusion: SUCCESS, required: true } ]
- comments: { inline: [], top_level: [] }
- issue_ref: null; issue: null
- worktree: { path: /work/mono-pr-731, branch: feature/csv-export, created: true, destroy: "script/worktree destroy 'pr-731'" }
- overrides at merge-base: `## using-git-worktrees` with `- home: ../mono-<name>`, `- create: script/worktree create <name> <subproject> --branch <branch>`, `- destroy: script/worktree destroy <name>`; no `## cleanup` section
- primary: /work/mono on main, tracked-clean; `git -C /work/mono-pr-731 status --porcelain --untracked-files=no` prints nothing; `git -C /work/mono-pr-731 merge-base --is-ancestor HEAD 7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a` succeeds; `realpath` returns every path unchanged; `script/worktree destroy 'pr-731'` run from /work/mono exits 0

## Entry

The merged terminal menu rendered and the human picked numeric `1` (cleanup from the terminal menu). Narrate the cleanup steps through the re-rendered menu.

## Arguments

`731`
