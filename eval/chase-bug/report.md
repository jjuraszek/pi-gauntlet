# eval report: chase-bug (partial run: nov3-replay)

for: 3b04fcd54a21bc338552b5c5c7b3ca279db77b2dd210c99f1d8318ae88d768f4

wall: 21s

refresh: complete; sample: nov3-replay; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](results/nov3-replay/candidate.json)

## Change

Replace the three-sentence, under-80-word verdict budget with one shared sectioned report contract. Use optional Context, What is broken, Why it is broken, and How to fix it for real bugs or What happens next for negative verdicts. Keep reports standalone and concise, with literal fixes, role-named mechanisms, visible proof, and trailing citations. Apply the shape to verdicts, reporter drafts, terminal summaries, and post-hotfix responses. End the gate's third section with the recommended pick and one because-clause; omit picks from drafts, summaries, and the hotfix seed. Preserve gate markers, menu numbering and recommendation, returned-ticket truth, citation sources, response confirmation, and hotfix seed evidence without menu recommendations.

The selected samples exercise report comprehension rather than sentence counting. The removed exact-three-sentence and under-80-word facts are superseded by section, standalone, under-180-word, and concision checks; menu echoes and delivery wrappers remain outside the report. Evidence is partial and does not prove live triage, tracker writes, or hotfix execution.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| nov3-replay | anthropic/claude-opus-5-5 | improved | 20273 | plain-reader: holds -> holds (held); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: holds -> holds (held); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |
| nov3-replay | github-copilot/gpt-6.1-sol | improved | 17169 | plain-reader: holds -> holds (held); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: fails -> holds (unplanned improvement); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |

## Feedback

- nov3-replay / anthropic/claude-opus-5-5: Nothing moved: After keeps every fact Before kept while delivering the sectioned contract. Both After gates use the fixed headings, each section is a single paragraph, Context stays at two evidence lines, word counts land well under 180, the citation trails the claim, and the menus and eligibility lines are unchanged and terminal. Two small points to watch as you tighten the wording: the first After report's because-clause says 'every predicate passes' and the second leans on 'needs that coordination' without naming predicate 6 in the body, so if the contract wants the gate's third section to be readable without the eligibility line, prefer a because-clause like 'because it touches one call site and all six hotfix checks pass' / 'because the font lives outside this repo and its tests cannot verify it (predicate 6)'. Also note After's menu seeds say 'with this evidence' rather than 'with the above'; harmless here, but keep the menu text fixed if any downstream check compares it literally.
- nov3-replay / github-copilot/gpt-6.1-sol: After keeps every fact Before kept and additionally fixes ends-at-envelope: Before appended a 'Prior-report search completed... baseline checks were clean' housekeeping line after the eligibility line in both gates, while After stops at the eligibility line as required. The sectioned What is broken / Why it is broken / How to fix it shape reads plainly, each section is a single paragraph, citations trail the claims they support, both reports stay well under 180 words, and the menus match the expected row counts, recommendations, and eligibility statements (Checkpoint 2 names predicate 6 and the unverifiable external font). Two small wording nits worth tightening so the shape stays stable: keep the eligibility line explicit ('all six predicates pass' rather than 'all predicates pass') so the eligible line mirrors the not-eligible line's predicate specificity, and keep punctuation on the last menu row ('Finish with rendered summary.') consistent with the other rows so the row text is byte-identical to the menu contract. Otherwise the After wording delivers the Change without moving any fact in the wrong direction.

exit: 0

## Partial coverage and inspection

Selected model comparisons in this iteration (two baseline/candidate model pairs
per sample):

| Sample | Committed records | Candidate facts |
|---|---|---|
| `prose-verdict-above-menu` | [records](results/prose-verdict-above-menu/) | 8/8 hold on both models |
| `sectioned-report-order` | [records](results/sectioned-report-order/) | 8/8 hold on both models |
| `returned-ticket-link` | [records](results/returned-ticket-link/) | 8/8 hold on both models |
| `standalone-report` | [records](results/standalone-report/) | 8/8 hold on both models |
| `nov3-replay` | [records](results/nov3-replay/) | 7/7 hold on both models |

`gate-line-first` and `menu-after-numbered-findings` were not rerun. Their saved
records are not evidence for this change. No target-wide or cross-target sweep
ran. The final comparison above is sample-scoped; use
`node eval/chase-bug/check-report.mjs nov3-replay` to check its committed replies,
judgments and mechanical facts without model calls, substituting another selected
sample name to check that sample.

The implementer read both models' outputs for all five selected samples. The
saved-theme report explains the late default overwriting dark with light; the CI
report separates the repeated scan from the one-call-site fix; the font report
shows 312 pixels overflowing a 300-pixel card and changes the font, not the card.
The negative gate names missing dataset size without inventing a cause; the draft
asks for browser/version; the summary preserves the existing ticket. These are
readable causal stories without opening the cited files.

Row 4 remains open despite passing judged plain-reader facts: some outputs still
use unexplained terms such as "falsification test", "small fixture", "lint", or
"predicate". Tighten first-use explanations and recheck the affected samples in
a later iteration; the checker verifies saved judgments, not independent human
comprehension. The prose draft's confirmation can also include words after the
`send it` token rather than making that token the literal last line.

The Nov 3 baseline actually lacked section headings in both models, while the
current plain-reader judgments hold on both. An earlier judgment called one
baseline's plain-reader a failure for not saying the card width stays unchanged;
the refresh audit in candidate.json retains that disagreement. This is observed
judge variability, not evidence that the baseline was uniformly unreadable.

The hotfix path was checked by reading its handoff and presentation instructions,
not by executing mutations. Ungated drafts and push-failure fallback routing are
covered by the shared read instruction, not separate model checkpoints. The
predecessor spec banner remains for the parent: this worker cannot edit specs.
