bundle+: skills/chase-bug/SKILL.md
bundle+: skills/brainstorming/reference/menu-layout.md

Render three independent checkpoints separated by ---. Use only the supplied facts; tools, writes and handoffs are simulated.

## Checkpoint 1 - Real-bug gate

Origin: tracker ticket with a working response CLI. Prior-report search found no match; tracked-file checks are clean. The CI job wastes four minutes repeating a lint scan of the source tree. The summary-builder at tools/check-job.mjs:73 rescans instead of consuming the existing lint results. Both scans take four minutes and produce identical file lists. A falsification test passing the original list to the summary removes the second four minutes without changing its output. The proposed fix changes one call site to reuse that list. All six hotfix predicates pass; recommend hotfix. Render the step-4 gate and stop for a pick.

## Checkpoint 2 - Cannot-replicate reporter draft

Independently, a GitHub issue says a chart disappears after refresh. The reporter's small fixture, containing ten rows of sample data, renders the chart in Chrome and Firefox with clean profiles. Clearing the cache did not change the outcome. The cause is unknown; the number of rows in the failing dataset is missing and needed to continue. The user chose Respond to reporter with this verdict and citation. A working GitHub issue-comment write path is resolved. Render the step-5 draft asking for the missing input, with its confirmation outside the draft; stop without posting.

## Checkpoint 3 - Not-a-bug terminal summary

Independently, a free-text report says opening /widgets/ returns 404. The documented API rule accepts /widgets but not /widgets/; requesting /widgets opens the page and /widgets/ shows page not found. The router at src/router.ts:88 follows this exact-match rule. The API documentation's routing section at https://example.org/docs/widget-addresses states that trailing slashes are not accepted. Verdict: not-a-bug; no fix or ticket is needed. Origin has no response target. The user chose Finish with rendered summary. Render the terminal summary, giving the correct usage and the documented rule that settles the verdict, with no reporter draft or menu.
