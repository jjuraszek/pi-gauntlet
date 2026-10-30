# eval report: subagent-driven-development (partial run: direct-report-read)

for: 46a7d2f3957534efeaa0011af916cf085536bf3c669cc8c3a7ea764885e3e0e3

wall: 99s

## Change

The bounded-read overflow check names the `Parallel-safe:` line as the report footer (`TRAJECTORY:` on a re-review), not the first-line `Verdict:`.
Localize implement amendments to affected entries and historical evidence, preserving staged repairs during no-execution maintenance. Attribute retained failures by command/assertion/path plus corresponding repair evidence, not task membership. Preserve semantic inventory through failed apply and retry; keep grant, redraw and unrelated-regression stops and parent stamping. The local-amend-revalidation sample exercises these distinctions. Full model reports/results remain parent verification-owned.
Replace per-task spec and per-wave code review with one post-gate integrated wave review. Read unresolved child reports directly once at limit 300 with one compact retry; retain delegated source/spec/plan reads. Repair on the current integrated tree, using committed clean snapshots and delta-only apply for isolated waves, direct edits in-place. Rebuild only after repair delta apply failure; preserve siblings and original wave base. Fold escalation, convergence, funding and transcript-only recovery into one transition table. These are behavior-changing instructions; parent verification owns model results.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| direct-report-read | anthropic/claude-opus-5-5 | improved | 16346 | protocol: fails -> holds (intended change) |
| direct-report-read | github-copilot/gpt-6.1-sol | improved | 22408 | protocol: fails -> holds (intended change) |

## Feedback

- direct-report-read / anthropic/claude-opus-5-5: After satisfies the protocol fact end to end: structured JSON is consumed first, Task 2's report gets one `read({limit: 300})` with explicit no-offset/no-pagination/no-relay rules, the FIX_FIRST overflow is judged by the `Parallel-safe:` footer at line 340 rather than the line-1 `Verdict:`, the same wave-reviewer is re-dispatched exactly once with the literal "Compact report: findings and footer only, at most 150 lines" instruction, and the second overflow produces a hard stop that names the oversized compact path and the original. Before failed because it declared the footer irrelevant, skipped the compact retry, and dispatched a repair worker instead of stopping on the second overflow. Two wording cautions to keep the fact robust: in section B the answer/evidence child is handed the report path alongside the structured concern lines — keep it phrased as a delegated spec/source lookup (which the Change retains) and make explicit that no report text is pasted into it, so a reader cannot mistake it for a scout/relay worker; and the overflow rule could state once, generically, that the footer is `Parallel-safe:` on an initial review and `TRAJECTORY:` on a re-review so the check reads as a rule rather than an observation specific to this case.
- direct-report-read / github-copilot/gpt-6.1-sol: Before fails the protocol because it refuses any primary bounded read ("would not issue primary cat, sed"), pushes the report into child-owned carriers (a delegate relay in effect), and never shows the same-reviewer compact retry with the 150-line findings-and-footer bound; it does correctly cite the `Parallel-safe:` footer at line 340 as the overflow test. After moves the fact to holds: it consumes structured verdict/severity/counts first, performs exactly one `read({limit: 300})` per report path with explicit no-pagination/no-offset, tests overflow by whether the `Parallel-safe:` footer (not the line-1 `Verdict:`) is reached, dispatches the same `wave-reviewer` once with "Compact report: findings and footer only, at most 150 lines", reads that once, and stops on the second overflow. Two small tightenings would make it airtight: have the final stop block explicitly name the overflowed compact report path (e.g. "Stopped: `${REPORT_DIR}/wave-compact-review.md` exceeded the 300-line bound without reaching `Parallel-safe:`") rather than only describing it, and add a one-line note that on a repair re-review the footer to reach is `TRAJECTORY:` so the rule reads complete even though this case is an initial review.

exit: 0
