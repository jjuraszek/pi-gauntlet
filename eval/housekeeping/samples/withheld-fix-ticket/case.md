bundle-: skills/housekeeping/reference/check.md
bundle-: skills/housekeeping/reference/base-rules.md

The human invoked `/skill:housekeeping src/api` in the primary checkout on the default branch. Select and Check are complete; show the first card now.

Observed run state:
- root: primary checkout; commit equals the fetched origin default branch.
- rules-from: working tree; delivery: pr-per-class; bounds: on; parallel: 8.
- picks: fix, ticket, ignore; budget: 200.
- files: src/api/profile.ts. It is a tracked, clean, regular text file under the selected directory and matches no ignore rule.
- The expected-state comparison passed. No source file, index entry or HEAD changed.
- One issue class: one public response field in src/api/profile.ts:18 uses `displayName` rather than the required `display_name`. The observed line is `return { displayName: profile.name };`. No other class shares this file.
- Check id: repo-response-names. Rule: public JSON response field names use snake_case. Source: AGENTS.md, API naming; overrides: none; verification mode: read. The source and finding were validated, and the rule is not in doubt.
- The literal proposed fix renames the exported JSON field from `displayName` to `display_name`. Existing clients consume `displayName`; this changes the public API contract. It changes no stored schema, adds no file or dependency, and can be undone by reverting one commit. No regression command is attached to this read check.
- No pick has been recorded and nothing has been executed.
