bundle-: skills/housekeeping/reference/select.md

The human invoked `/skill:housekeeping src/widgets` in the primary checkout on the default branch. Select and Check are complete; show the first card now.

Observed run state:
- rules-from: working tree; delivery: pr-per-class; bounds: on; parallel: 8.
- picks: fix, ticket, ignore; budget: 200.
- files: src/widgets/render.ts. It is a tracked, clean, regular text file under the selected directory and matches no ignore rule.
- The repository's README.md, under `## Diagnostics`, says: "Keep leftover console.debug statements in widget renderers for future debugging."
- The housekeeping base rule code-debug says: "Remove leftover debug statements."
- Compiled check id: code-debug. Rule: remove leftover debug statements. Source file: skills/housekeeping/reference/base-rules.md; kind: Code; overrides: README.md, `## Diagnostics`; applicable kind: code; verification mode: read.
- One validated finding: src/widgets/render.ts:12 is exactly `console.debug("temporary widget trace", widget.id);`. The quoted line exists. It is leftover debugging output, not product logging, and removing it changes no rendering behavior. No other class shares this file.
- The proposed fix removes that one debug statement. It affects no stored data, public contract, dependencies or configuration shape and can be undone by reverting one commit. No regression command is attached to this read check.
- The expected-state comparison passed. No source file, index entry or HEAD changed during Check.
- No pick has been recorded and nothing has been executed.
