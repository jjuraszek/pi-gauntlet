bundle-: skills/housekeeping/reference/check.md
bundle-: skills/housekeeping/reference/base-rules.md

The human invoked `/skill:housekeeping #42` for an open PR. Select and Check are complete; show the first card now.

Observed run state:
- root: a non-primary PR worktree, clean and equal to its remote head; push dry-run passed.
- rules-from: merge-base commit; delivery: commit-push; bounds: off; parallel: 1.
- picks: fix, ignore; budget: 200.
- files: empty. specs: doc/specs/retired-widget.md. Spec dirs: doc/specs, docs/specs; plan dirs: doc/plans, docs/plans.
- One issue class, check id spec-superseded, with one line finding at doc/specs/retired-widget.md:3. The title block carries `> **Superseded by:** [doc/specs/widget.md](./widget.md) - fully` above its first section or code fence.
- Source: housekeeping reference/base-rules.md, Specs; overrides: none; verification mode: derived.
- No tracked file outside the spec and plan dirs contains retired-widget.md as a fixed string. Its successor names it, inside doc/specs.
- The expected-state comparison passed. No source file, index entry or HEAD changed during Check.
- No pick has been recorded and nothing has been executed.
