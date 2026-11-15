# eval report: gauntlet-handoff (partial run: status-context-line)

for: 5da2d7c1c4aae855f456e27ff00cddb9e4707b5d58ba8066c9a16da4ea62a1cc

wall: 20s

## Change

Drop exactly the trailing phase_tracker status line when it starts with `Context: ` before appending Process state. Copy every other phase-status line and the complete plan-status output verbatim. Keep the byte-exact brief layout, tracker grammar, example block, and resume parser unchanged. Cover the change with the synthetic status-context-line replay; it narrates supplied observations, not live tool execution. Run only this sample and preserve all other report rows as prior evidence, not current coverage.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| status-context-line | anthropic/claude-opus-5-5 | improved | 5637 | context-tail: fails -> holds (intended change); unchanged-grammar: fails -> holds (intended change); read-only: holds -> holds (intended but unchanged) |
| status-context-line | github-copilot/gpt-6.1-sol | improved | 6506 | context-tail: fails -> holds (intended change); unchanged-grammar: fails -> holds (intended change); read-only: holds -> holds (intended but unchanged) |

## Selected repair evidence

Only `status-context-line` ran for this repair. The case and expectation now use the specified `Context: 31.0% of window` reading. Both candidates hold 3/3 facts; both baselines hold 1/3. The run refreshed both arms because the case input changed; no bundle changed, so neither baseline-only seeding nor judgment-only refresh was needed.

Observed command: `timeout -k 30 600 node eval/run.mjs gauntlet-handoff status-context-line`.
Observed output: `gauntlet-handoff: improved (report.md written; replay 4, judge 2, confirm 0, wall 20s)`; exit 0.

## Retained prior partial-report rows (not rerun)

These rows retain prior evidence from bundle `4abb224d5dde3f77e1e0b90c06e35ca1e50f71f131e768d958ff674a42372827`, not current coverage. Their result records are unchanged.

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| gate-line-first | anthropic/claude-opus-5-5 | unchanged | 9489 | target: holds -> holds (held); first-line: holds -> holds (intended but unchanged) |
| gate-line-first | github-copilot/gpt-6.1-sol | unchanged | 6446 | target: holds -> holds (held); first-line: holds -> holds (intended but unchanged) |
| ledger-task-list | anthropic/claude-opus-5-5 | unchanged | 12016 | implement: holds -> holds (intended but unchanged); verify: holds -> holds (intended but unchanged); read-only: holds -> holds (intended but unchanged); rejection: holds -> holds (intended but unchanged) |
| ledger-task-list | github-copilot/gpt-6.1-sol | unchanged | 15397 | implement: holds -> holds (intended but unchanged); verify: holds -> holds (intended but unchanged); read-only: holds -> holds (intended but unchanged); rejection: holds -> holds (intended but unchanged) |
| multi-repo | anthropic/claude-opus-5-5 | unchanged | 16492 | home: holds -> holds (intended but unchanged); layout: holds -> holds (intended but unchanged); missing: holds -> holds (intended but unchanged); single: holds -> holds (intended but unchanged) |
| multi-repo | github-copilot/gpt-6.1-sol | unchanged | 15669 | home: holds -> holds (intended but unchanged); layout: holds -> holds (intended but unchanged); missing: holds -> holds (intended but unchanged); single: holds -> holds (intended but unchanged) |

## Feedback

- status-context-line / anthropic/claude-opus-5-5: The After wording moved context-tail and unchanged-grammar as intended: the appended block now omits only the trailing `Context: 31.0% of window` line while every other phase-status line and the full plan-status output (including its blank line and the `→ [0] Write checks` row) are copied verbatim, and the layout runs blank line, `## Process state`, blank line, phase status, blank line, plan status, blank line, `Active task: Write checks`, terminal gate-history line with no Context field or invented field; Before copied the Context line into the brief, which failed both. read-only held in both: status-only tracker reads, one append to cohort's reported file, six-heading core preserved, no second state file, and the `/skill:gauntlet-resume /tmp/pi-handoff/context-check.md` report after the `gauntlet: done brief-written` marker. To keep this stable, keep the drop rule scoped narrowly to the final phase-status line only when it starts with `Context: `, and state that nothing else is trimmed or reflowed. One thing to watch: After additionally prints a `Brief tail` re-display block with a `...` placeholder under `## Skills loaded`; it is presentation only and did not move a fact, but wording that says to show the single append once and then the final report would avoid a reader mistaking it for a second append or an altered core.
- status-context-line / github-copilot/gpt-6.1-sol: The After wording's instruction to drop only the trailing `Context: ` line from the phase status is what moved context-tail and unchanged-grammar: the appended block now contains the five phase lines with no `Context: 31.0% of window` line, followed by a blank line, the full plan status (including its internal blank line and the `→ [0] Write checks` row), `Active task: Write checks`, and the terminal gate-history line, with no extra field inside the heredoc. Before copied the Context line verbatim into the brief, which failed both facts. read-only holds in both: each output makes a single append to cohort's reported file `/tmp/pi-handoff/context-check.md`, leaves the six-heading core alone, writes no second state file, and reports `/skill:gauntlet-resume /tmp/pi-handoff/context-check.md` after the `gauntlet: done brief-written` marker. To keep this stable, keep the drop rule phrased narrowly (only the final phase-status line, only when it starts with `Context: `) and keep stating that all other phase lines and the whole plan status are copied verbatim, so the model does not also trim the plan's blank line or the task row. Minor drifts in After that did not move any fact but are worth pinning down if the report wording is meant to be fixed: the path label changed from `Handoff path:` to `Handoff written:`, the resume command moved from a fenced block to inline code, and the blank line after the marker disappeared; if those are part of the contract, spell the final-report format out explicitly alongside the drop rule.

exit: 0
