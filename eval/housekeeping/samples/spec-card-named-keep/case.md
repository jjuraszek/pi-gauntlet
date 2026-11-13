bundle-: skills/housekeeping/reference/check.md
bundle-: skills/housekeeping/reference/base-rules.md

The human invoked `/skill:housekeeping doc` on the primary checkout's default branch. Select and Check are complete; show the first card now.

Observed run state:
- root: primary checkout, clean and equal to the fetched default branch; worktree home is ignored.
- rules-from: working tree; delivery: pr-per-class; bounds: on; parallel: 8.
- picks: fix, ticket, ignore; budget: 200.
- files: empty. specs: doc/specs/retired-widget.md. Spec dirs: doc/specs, docs/specs; plan dirs: doc/plans, docs/plans.
- One issue class, check id spec-superseded, with one line finding at doc/specs/retired-widget.md:3. The title block carries `> **Superseded by:** [doc/specs/widget.md](./widget.md) - fully` above its first section or code fence.
- Source: housekeeping reference/base-rules.md, Specs; overrides: none; verification mode: derived.
- README.md is the only tracked file outside the spec and plan dirs containing retired-widget.md as a fixed string. Its successor also names it, inside doc/specs.
- The expected-state comparison passed. No source file, index entry or HEAD changed during Check.
- No pick has been recorded and nothing has been executed.
