bundle-: skills/housekeeping/reference/check.md
bundle-: skills/housekeeping/reference/base-rules.md

The human invoked `/skill:housekeeping #42` for an open draft PR. Select and Check are complete; show the first card now.

Observed run state:
- The session is in the primary checkout, outside the PR worktree. The PR is in this repository.
- root: the reused non-primary worktree on feature/widget-colors, clean and equal to the PR's remote head. The push dry-run passed.
- rules-from: merge-base commit; delivery: commit-push; bounds: off; parallel: 1.
- picks: fix, ignore; budget: 200.
- files: src/widgets/render.ts, src/widgets/format.ts. Both are modified by the PR against its merge-base, regular text files and match no ignore rule.
- Unchanged src/admin/render.ts, ignored src/widgets/cache.ts and deleted src/widgets/old.ts are not selected.
- The expected-state comparison passed. No source file, index entry or HEAD changed during Check.
- One issue class: two unused imports, one at src/widgets/render.ts:2 and one at src/widgets/format.ts:3, both in changed line ranges. Both quoted import lines exist and neither imported name is used in its file.
- Check id: code-unused. Rule: remove unused imports, variables and modules with no caller. Source: housekeeping base rules, Code; overrides: none; verification mode: read.
- The proposed fix removes the two unused imports. No regression command is attached to this read check.
- No pick has been recorded and nothing has been executed.
