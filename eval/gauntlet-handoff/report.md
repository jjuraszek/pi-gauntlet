# eval report: gauntlet-handoff (partial run: status-context-line)

for: 5da2d7c1c4aae855f456e27ff00cddb9e4707b5d58ba8066c9a16da4ea62a1cc

wall: 18s

## Change

Drop exactly the trailing phase_tracker status line when it starts with `Context: ` before appending Process state. Copy every other phase-status line and the complete plan-status output verbatim. Keep the byte-exact brief layout, tracker grammar, example block, and resume parser unchanged. Cover the change with the synthetic status-context-line replay; it narrates supplied observations, not live tool execution. Run only this sample and preserve all other report rows as prior evidence, not current coverage.

## Cells

Only `status-context-line` ran against the current bundle. All other rows are preserved prior evidence from bundle `4abb224d5dde3f77e1e0b90c06e35ca1e50f71f131e768d958ff674a42372827`, not current coverage.

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| gate-line-first | anthropic/claude-opus-5-5 | unchanged | 9489 | target: holds -> holds (held); first-line: holds -> holds (intended but unchanged) |
| gate-line-first | github-copilot/gpt-6.1-sol | unchanged | 6446 | target: holds -> holds (held); first-line: holds -> holds (intended but unchanged) |
| ledger-task-list | anthropic/claude-opus-5-5 | unchanged | 12016 | implement: holds -> holds (intended but unchanged); verify: holds -> holds (intended but unchanged); read-only: holds -> holds (intended but unchanged); rejection: holds -> holds (intended but unchanged) |
| ledger-task-list | github-copilot/gpt-6.1-sol | unchanged | 15397 | implement: holds -> holds (intended but unchanged); verify: holds -> holds (intended but unchanged); read-only: holds -> holds (intended but unchanged); rejection: holds -> holds (intended but unchanged) |
| multi-repo | anthropic/claude-opus-5-5 | unchanged | 16492 | home: holds -> holds (intended but unchanged); layout: holds -> holds (intended but unchanged); missing: holds -> holds (intended but unchanged); single: holds -> holds (intended but unchanged) |
| multi-repo | github-copilot/gpt-6.1-sol | unchanged | 15669 | home: holds -> holds (intended but unchanged); layout: holds -> holds (intended but unchanged); missing: holds -> holds (intended but unchanged); single: holds -> holds (intended but unchanged) |
| status-context-line | anthropic/claude-opus-5-5 | improved | 5721 | context-tail: fails -> holds (intended change); unchanged-grammar: fails -> holds (intended change); read-only: holds -> holds (intended but unchanged) |
| status-context-line | github-copilot/gpt-6.1-sol | improved | 6023 | context-tail: fails -> holds (intended change); unchanged-grammar: fails -> holds (intended change); read-only: holds -> holds (intended but unchanged) |

## Feedback

- status-context-line / anthropic/claude-opus-5-5: The After wording moved context-tail and unchanged-grammar exactly as intended: the append now drops only the trailing `Context: 26.0% of window` line, copies the five phase rows and the full plan status (including its blank line and the `→ [0] Write checks` row) verbatim, and keeps the layout of blank line, `## Process state`, blank line, phase status, blank line, plan status, blank line, `Active task: Write checks`, and the terminal gate-history line with no Context field or invented field. Before failed both because it copied the Context line into the brief and stated so explicitly. read-only held in both: status-only tracker reads, one append to cohort's reported file, the six-heading core untouched, no second state file, and the `/skill:gauntlet-resume /tmp/pi-handoff/context-check.md` report following the `gauntlet: done brief-written` marker. To keep this stable, keep the rule phrased as dropping only the final phase-status line when it starts with `Context: ` and copying everything else verbatim, so the model does not generalise it into trimming other lines or the plan status; the new step about reading the brief contract and the explicit core check are harmless additions, but make sure the wording does not encourage any extra file writes or tracker calls beyond the two status reads and the single append.
- status-context-line / github-copilot/gpt-6.1-sol: The After wording moved context-tail and unchanged-grammar as intended: the appended Process state now drops only the trailing `Context: 26.0% of window` line, copies the five phase rows and the full plan status (header, blank line, `→ [0] Write checks`) verbatim, and keeps the layout of blank line, `## Process state`, blank line, phase status, blank line, plan status, blank line, `Active task: Write checks`, and the terminal gate-history line with no Context field or invented field. Before failed both because it copied the Context line into the brief. read-only holds in both: a single append to cohort's reported file, the six-heading core preserved, no second state file, and the resume command reported; After actually improves on Before here by placing `gauntlet: done brief-written` in the final report ahead of the resume command rather than at the very top of the output before the work is narrated. To keep this stable, keep the wording that says to drop only the final phase-status line when it starts with `Context: ` and copy everything else verbatim, and state explicitly that the done marker opens the final report and the resume command follows it; also consider pinning the report label (Before echoed cohort's `Handoff written:`, After used `Handoff brief:`) and whether the resume command is fenced, since those drifted between runs even though no fact depends on them.

exit: 0
