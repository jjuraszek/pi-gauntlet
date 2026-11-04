# eval report: chase-bug (partial run: nov3-replay)

for: 23bfd4dd025229c0e6b7d0c32d21d607bad09bf75139a5dbb0a442b554bc2f29

wall: 40s

## Change

Replace the three-sentence, under-80-word verdict budget with one shared sectioned report contract. Use optional Context, What is broken, Why it is broken, and How to fix it for real bugs or What happens next for negative verdicts. Keep reports standalone and concise, with literal fixes, role-named mechanisms, visible proof, and trailing citations. Apply the shape to verdicts, reporter drafts, terminal summaries, and post-hotfix responses. End the gate's third section with the recommended pick and one because-clause; omit picks from drafts, summaries, and the hotfix seed. Preserve gate markers, menu numbering and recommendation, returned-ticket truth, citation sources, response confirmation, and hotfix seed evidence without menu recommendations.

Translate investigation shorthand before first use in every report, including Context and recommendation reasons. Explain tests by their changed input and observed result, name components by their actions, and omit implementation citations unless the reader's next action requires opening them. The plain-reader-first-use sample exercises this register in a real-bug gate, cannot-replicate draft and documented-rule not-a-bug summary.

The selected samples exercise report comprehension rather than sentence counting. The removed exact-three-sentence and under-80-word facts are superseded by section, standalone, under-180-word, and concision checks; menu echoes and delivery wrappers remain outside the report. Evidence is partial and does not prove live triage, tracker writes, or hotfix execution.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| nov3-replay | anthropic/claude-opus-5-5 | improved | 25914 | plain-reader: fails -> holds (unplanned improvement); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: holds -> holds (held); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |
| nov3-replay | github-copilot/gpt-6.1-sol | improved | 25992 | plain-reader: fails -> holds (unplanned improvement); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: fails -> holds (unplanned improvement); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |

## Feedback

- nov3-replay / anthropic/claude-opus-5-5: After moves plain-reader from fails to holds: Before leaned on unexplained shorthand ("CI job", "the lint step's results") and, in the font case, never said the fix leaves the card width alone, so a reader who did not open the citation could not reconstruct the whole mechanism; After renames those pieces by their actions ("the automatic build check", "scans the code for rule violations", "the step that writes the final summary") and states "Leave the card width unchanged" explicitly. The sectioned shape stays comfortably under the 180-word cap (roughly 145 and 150 words including headings), each section is a single paragraph with no stray bullets, the menus and eligibility lines are byte-for-byte equivalent in structure, and both gates still end at the closing fence. Nothing regressed; if anything, keep an eye on the dropped citations - After omits `tools/check-job.mjs:73` and `slides/title.css:41` entirely, which is permitted by the "only when useful to open" rule, but for the hotfix case the fixer's next action is literally opening that call site, so appending the identifier after the "one place in the code" claim would satisfy the trailing-citation guidance without hurting readability.
- nov3-replay / github-copilot/gpt-6.1-sol: After improves on Before in two places: the sectioned contract made the second report state the fix as the font rather than the card width (Before never contrasted the two, so a reader could not tell why the card was left alone), and dropping the trailing 'Prior-report search completed...' line means both gates now end at the eligibility line, which Before violated by appending housekeeping after it. Nothing regressed: both reports stay well under 180 words, every section is a single paragraph, the menus keep their row counts, recommendation marks, last rows, and the predicate-6 naming. Two small wording risks worth tightening in the After contract: the CP1 eligibility line lost 'six' ('all predicates pass'), which is still fine for menu-intact but weaker than Before's explicit count, and the menu fence places the eligibility line outside the code block, which is permitted by ends-at-envelope but should be stated as the intended shape so future outputs don't drift the eligibility line inside the fence or add text after it. Keep the instruction that nothing follows the eligibility line, and consider requiring the eligibility line to echo the predicate count so the gate text matches hotfix.md's six-predicate vocabulary.

exit: 0

## Selected-sample coverage for the first-use wording change

The latest runner report above covers nov3-replay only. The following six selected samples were also checked against the current assembly and intent with `node eval/chase-bug/check-report.mjs SAMPLE`. Their committed candidate records contain the paired judgments; no target-wide run was made.

| Sample | Current model pairs | Candidate facts per model | Record |
|---|---|---|---|
| plain-reader-first-use | 2 | 6 hold | [first-use judgments](results/plain-reader-first-use/candidate.json) |
| standalone-report | 2 | 8 hold | [standalone judgments](results/standalone-report/candidate.json) |
| prose-verdict-above-menu | 2 | 8 hold | [gate and draft judgments](results/prose-verdict-above-menu/candidate.json) |
| sectioned-report-order | 2 | 8 hold | [positive and negative gate judgments](results/sectioned-report-order/candidate.json) |
| returned-ticket-link | 2 | 8 hold | [terminal-summary judgments](results/returned-ticket-link/candidate.json) |
| nov3-replay | 2 | 7 hold | [duplicate scan and font judgments](results/nov3-replay/candidate.json) |

RED: the new first-use check failed on the initial sectioned candidate's unexplained investigation terms. A general instruction to translate terms still left bare "API" in a citation label. The reference now supplies role/action translations and a report-body check, including the recommendation reason and citation labels. A refreshed draft also exposed a bare `send it` line; clarifying the existing confirmation as an explicit reply request restored the draft check. GREEN: all six selective checks above pass on current records. Existing samples' facts and closed ledger cells are unchanged.

### Human-readable before and after

These excerpts come from the committed plain-reader-first-use baseline and candidate for the first replay model, not invented ideal output.

| Surface | Before | After |
|---|---|---|
| Real-bug gate | "The CI job spends an extra four minutes running the same lint scan of the source tree twice." | "Every run of the automatic check spends four extra minutes because it scans the code for rule violations twice." |
| Cannot-replicate draft | "Your ten-row sample fixture rendered the chart in both Chrome and Firefox with clean profiles, and clearing the cache changed nothing" | "We tried it in Chrome and Firefox using browser settings with no saved preferences, and the chart appeared each time. Clearing the browser's stored copy of the data did not change the result." |
| Not-a-bug summary | "The router matches addresses exactly" with an implementation path and "API documentation's routing section" | "Nothing is broken. The part that matches web addresses to pages follows the documented rules for page addresses, which accept `/widgets` and do not accept a final slash" followed by the documentation link. |

The approved not-a-bug gate example remains in the shared reference: opening `/widgets/` shows page not found (404); the documented address rule accepts `/widgets` without the final slash; respond with that correct usage. Its existing two-row menu stays intact. The new sample checks the same documented-rule verdict as a terminal summary, with no menu or reporter address.

Coverage is partial: these six samples cover report rendering only, including the anonymized duplicate four-minute scan and missing-font-character cases. gate-line-first and menu-after-numbered-findings were not rerun. No other chase-bug sample, other target, live triage, tracker write, hotfix execution, or full repository verification was run. Judge feedback still suggests stylistic refinements (for example, replacing "The chase found" with "We checked and found"); those suggestions are not additional proven behaviors.
