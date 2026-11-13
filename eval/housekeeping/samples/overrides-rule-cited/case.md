bundle-: skills/housekeeping/reference/select.md

The human invoked `/skill:housekeeping docs` in the primary checkout on the default branch. Select and Check are complete; show the first card now.

Observed run state:
- rules-from: working tree; delivery: pr-per-class; bounds: on; parallel: 8.
- picks: fix, ticket, ignore; budget: 200.
- files: docs/setup.md. It is a tracked, clean, regular text file under the selected directory and matches no ignore rule.
- The first-found overrides file is .pi/gauntlet-overrides.md. Its `## housekeeping` section says: "End Markdown headings in docs/ without a period." No base rule covers this heading punctuation; the overrides rule adds a check and conflicts with no base rule.
- Compiled check id: repo-heading-period. Rule: end Markdown headings in docs/ without a period. Source file: .pi/gauntlet-overrides.md; heading: `## housekeeping`; overrides: none; applicable kind: docs; verification mode: read.
- One validated finding: docs/setup.md:1 is exactly `# Widget setup.`. The quoted line exists. No other class shares this file.
- The proposed fix removes that one trailing period, leaving `# Widget setup`. There are no links or anchors referring to the heading. The change affects no stored data, public contract, dependencies or configuration shape and can be undone by reverting one commit. No regression command is attached to this read check.
- The expected-state comparison passed. No source file, index entry or HEAD changed during Check.
- No pick has been recorded and nothing has been executed.
