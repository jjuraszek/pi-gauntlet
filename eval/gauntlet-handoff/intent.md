for: 5da2d7c1c4aae855f456e27ff00cddb9e4707b5d58ba8066c9a16da4ea62a1cc

## Change

Drop exactly the trailing phase_tracker status line when it starts with `Context: ` before appending Process state. Copy every other phase-status line and the complete plan-status output verbatim. Keep the byte-exact brief layout, tracker grammar, example block, and resume parser unchanged. Cover the change with the synthetic status-context-line replay; it narrates supplied observations, not live tool execution. Run only this sample and preserve all other report rows as prior evidence, not current coverage.

## Expected to move

- status-context-line/context-tail: fails -> holds - Omit only the trailing Context reading while copying all remaining status text verbatim.
- status-context-line/unchanged-grammar: fails -> holds - Preserve the shared layout and terminal gate-history line without adding a brief field.
- status-context-line/read-only: holds -> holds - Keep tracker reads, cohort's core, the single brief append, and the final resume report unchanged.
