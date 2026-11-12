bundle-: skills/housekeeping/reference/check.md
bundle-: skills/housekeeping/reference/base-rules.md

The human invoked `/skill:housekeeping src/widgets` in the primary checkout on the default branch. Select and Check are complete; show the first card now.

Observed run state:
- root: primary checkout; commit equals the fetched origin default branch.
- rules-from: working tree; delivery: pr-per-class; bounds: on; parallel: 8.
- picks: fix, ticket, ignore; budget: 200.
- files: src/widgets/render.ts, src/widgets/format.ts. Both are tracked, clean, regular text files under the selected directory and match no ignore rule.
- Uncommitted src/widgets/draft.ts was not checked. Ignored src/widgets/cache.ts, deleted src/widgets/old.ts and the out-of-directory src/admin/render.ts are not selected.
- The expected-state comparison passed. No source file, index entry or HEAD changed.
- One issue class: two unused imports, one at src/widgets/render.ts:2 and one at src/widgets/format.ts:3. Both quoted import lines exist and neither imported name is used in its file. No other class shares these files.
- Check id: code-unused. Rule: remove unused imports, variables and modules with no caller. Source: housekeeping base rules, Code; overrides: none; verification mode: read.
- The proposed fix removes the two imports, changes existing code only, changes no dependencies, stored data, public interface or configuration shape, and can be undone by reverting one commit. No regression command is attached to this read check.
- No pick has been recorded and nothing has been executed.
