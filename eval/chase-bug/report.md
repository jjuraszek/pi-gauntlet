# eval report: chase-bug (partial run: nov3-replay)

for: cfab7d5a9bcf791fb5fc7b3952260bd311e3353488f4e7a726c7a7de000076fa

wall: 41s

## Change

Replace the three-sentence, under-80-word verdict budget with one shared sectioned report contract. Use optional Context, What is broken, Why it is broken, and How to fix it for real bugs or What happens next for negative verdicts. Keep reports standalone and concise, with literal fixes, role-named mechanisms, visible proof, and trailing citations. Apply the shape to verdicts, reporter drafts, terminal summaries, and post-hotfix responses. End the gate's third section with the recommended pick and one because-clause; omit picks from drafts, summaries, and the hotfix seed. Preserve gate markers, menu numbering and recommendation, returned-ticket truth, citation sources, response confirmation, and hotfix seed evidence without menu recommendations.

Translate investigation shorthand before first use in every report, including Context and recommendation reasons. Explain tests by their changed input and observed result, name components by their actions, and omit implementation citations unless the reader's next action requires opening them. Keep Context limited to the one-line repro, the explanation that survived testing, and what could not be checked; omit it when none exists rather than filling it with tracker-search results, status, or housekeeping. The plain-reader-first-use sample exercises this register and Context content in a real-bug gate, cannot-replicate draft and documented-rule not-a-bug summary.

The selected samples exercise report comprehension rather than sentence counting. The removed exact-three-sentence and under-80-word facts are superseded by section, standalone, under-180-word, and concision checks; menu echoes and delivery wrappers remain outside the report. Evidence is partial and does not prove live triage, tracker writes, or hotfix execution.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| nov3-replay | anthropic/claude-opus-5-5 | improved | 20460 | plain-reader: fails -> holds (unplanned improvement); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: holds -> holds (held); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |
| nov3-replay | github-copilot/gpt-6.1-sol | improved | 25400 | plain-reader: fails -> holds (unplanned improvement); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: fails -> holds (unplanned improvement); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |

## Feedback

- nov3-replay / anthropic/claude-opus-5-5: After delivers the Change cleanly: both gates use the Context / What is broken / Why it is broken / How to fix it headings, every section is a single paragraph, word counts sit well under 180, menus and eligibility lines are untouched, and nothing trails the envelope. The move on plain-reader comes from After translating the shorthand Before left bare ('CI job' becomes 'the automatic build check', 'lint step' becomes 'scans the code for rule violations') and from the second gate stating 'leave the card width unchanged', which Before never said. One thing to tighten: the first gate's Context ends with 'Nothing was blocked', which is status-shaped filler rather than a repro, surviving explanation, or blocked check; the wording should say to drop the sentence when there is no blocked check (keep only 'A timing trace showed two four-minute passes over the code with identical file lists.'). The citations Before carried (`tools/check-job.mjs:73`, `slides/title.css:41`) were dropped entirely in After; that is acceptable under the 'only when the reader's next action requires opening them' rule, but the wording could state explicitly that a hotfix recommendation makes the call site worth citing after the fix sentence, so the hotfix seed keeps its evidence without re-adding citations elsewhere.
- nov3-replay / github-copilot/gpt-6.1-sol: After keeps every fact Before kept and repairs the two Before failed: the sectioned report explains the duplicate scan, the four wasted minutes and the reuse of existing results in checkpoint 1, and in checkpoint 2 it defines glyph on first use, names the wider substitute font, gives 312 versus 300 pixels and says to replace the font rather than widen the card, whereas Before's compressed paragraph omitted the card alternative and leaned on 'browser substitution' with a trailing CSS citation to carry the explanation; After also stops at the eligibility line instead of appending the prior-report-search and baseline-check housekeeping that Before tacked on. Nothing moved from holds to fails: both reports are well under 180 words, each section is a single paragraph, the menus keep their row counts, recommendations and eligibility lines. One thing to watch in the wording rather than this output: After dropped both citations entirely (tools/check-job.mjs:73 and slides/title.css:41), which the plain-reader fact tolerates, but the hotfix recommendation in checkpoint 1 is exactly the case where the reader's next action is to open the call site, so the contract should say 'keep the citation trailing the claim when the recommended pick is to edit that location' to avoid over-pruning; it should also pin the eligible line to 'all six predicates pass' and keep 'the other five pass' on the not-eligible line so the predicate count stays explicit.

exit: 0

## Selected coverage

Partial coverage: the six explicitly selected samples below were replayed with
`EVAL_CONCURRENCY=4 node eval/run.mjs chase-bug <sample>`. Each run produced two
current candidate replies and two judgments, reused the baseline replies, and
exited 0 with `improved`. The Cells and Feedback sections above describe only
`nov3-replay`, the final invocation; the linked records retain every selected
sample's current evidence.

| Sample | Current candidate record | Facts holding in both model pairs | Scoped check exit |
|---|---|---|---|
| standalone-report | [candidate](results/standalone-report/candidate.json) | 8 | 0 |
| sectioned-report-order | [candidate](results/sectioned-report-order/candidate.json) | 8 | 0 |
| prose-verdict-above-menu | [candidate](results/prose-verdict-above-menu/candidate.json) | 8 | 0 |
| returned-ticket-link | [candidate](results/returned-ticket-link/candidate.json) | 8 | 0 |
| plain-reader-first-use | [candidate](results/plain-reader-first-use/candidate.json) | 7 | 0 |
| nov3-replay | [candidate](results/nov3-replay/candidate.json) | 7 | 0 |

Each scoped check used `node eval/chase-bug/check-report.mjs <sample>` and
reported `2 current model pairs, all <count> candidate facts hold; no model calls`.
The `context-earns-place` fact holds for both plain-reader-first-use candidates;
both omit Context at all three checkpoints. Adding that fact before the skill
edit rejected the saved search-status-only Context, with runner exit 1 and
scoped check exit 1. `wc -l skills/chase-bug/reference/verdict-report.md` reports
185 lines (exit 0); only the Context rule row changed in that reference.

## Coverage limits

`gate-line-first` and `menu-after-numbered-findings` were not rerun. Their existing
records are not current evidence for this repair. These selected no-tool text
replays do not prove live triage, tracker retrieval or writes, numeric-reply
execution, or hotfix execution. The comparisons attest only the selected facts,
not a target-wide pass. Only plain-reader-first-use explicitly judges Context
content: nov3-replay's Opus candidate still adds "Nothing was blocked" to its
first Context, which its judge flags as status-shaped filler despite all selected
facts holding. That residual needs follow-up rather than a broader pass claim.
