# eval report: chase-bug (partial run: nov3-replay)

for: 23bfd4dd025229c0e6b7d0c32d21d607bad09bf75139a5dbb0a442b554bc2f29

wall: 35s

## Change

Replace the three-sentence, under-80-word verdict budget with one shared sectioned report contract. Use optional Context, What is broken, Why it is broken, and How to fix it for real bugs or What happens next for negative verdicts. Keep reports standalone and concise, with literal fixes, role-named mechanisms, visible proof, and trailing citations. Apply the shape to verdicts, reporter drafts, terminal summaries, and post-hotfix responses. End the gate's third section with the recommended pick and one because-clause; omit picks from drafts, summaries, and the hotfix seed. Preserve gate markers, menu numbering and recommendation, returned-ticket truth, citation sources, response confirmation, and hotfix seed evidence without menu recommendations.

Translate investigation shorthand before first use in every report, including Context and recommendation reasons. Explain tests by their changed input and observed result, name components by their actions, and omit implementation citations unless the reader's next action requires opening them. The plain-reader-first-use sample exercises this register in a real-bug gate, cannot-replicate draft and documented-rule not-a-bug summary.

The selected samples exercise report comprehension rather than sentence counting. The removed exact-three-sentence and under-80-word facts are superseded by section, standalone, under-180-word, and concision checks; menu echoes and delivery wrappers remain outside the report. Evidence is partial and does not prove live triage, tracker writes, or hotfix execution.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| nov3-replay | anthropic/claude-opus-5-5 | improved | 18579 | plain-reader: fails -> holds (unplanned improvement); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: holds -> holds (held); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |
| nov3-replay | github-copilot/gpt-6.1-sol | improved | 21780 | plain-reader: holds -> holds (held); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: fails -> holds (unplanned improvement); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |

## Feedback

- nov3-replay / anthropic/claude-opus-5-5: After keeps every fact Before kept and additionally satisfies plain-reader: Before leaned on unexplained shorthand ("CI job", "the lint step's results") and parenthetical citations, whereas After names the pieces by what they do ("the automatic build check", "the step that builds the final summary", "the heading's font file"), describes the trial by its changed input and observed result, and drops the `tools/check-job.mjs:73` / `slides/title.css:41` identifiers that no reader needs to act on the gate. Word counts stay well under 180 (roughly 125 and 150), each section is a single paragraph, menus and eligibility lines are byte-for-byte compatible with the required shapes, and nothing trails the eligibility line. The only thing to watch is that the 'How to fix it' because-clause stays one sentence and that any future citation you re-add trails its claim rather than sitting mid-sentence; otherwise the After wording is doing exactly what the Change asks.
- nov3-replay / github-copilot/gpt-6.1-sol: After keeps every fact Before kept and additionally fixes ends-at-envelope: Before appended a 'Prior-report search completed... baseline checks were clean' housekeeping line after the eligibility line in both gates, while After stops at the eligibility line. The sectioned shape (What is broken / Why it is broken / How to fix it) stays under the 180-word cap, each section is a single paragraph, menus are unchanged in rows, numbering and recommendation, and the plain-reader explanations are actually stronger in After (glyph as 'the drawing for z', 'do not widen the card', build check named by role, citations dropped since the reader's next action does not require opening them). Two small drifts worth tightening in the wording: the eligibility line should keep the predicate count ('all six predicates pass') so the eligible line stays parallel with the not-eligible line's 'the other five pass', and the Finish row lost its trailing period, so the contract should state that menu rows are echoed verbatim; otherwise the After wording delivers the Change without regressing any fact.

exit: 0

## Selected-sample verification repair

The generated section above is the last single-sample run, `nov3-replay`, not a
target-wide result. This repair refreshed only `standalone-report`,
`sectioned-report-order`, `prose-verdict-above-menu`, `returned-ticket-link`,
`plain-reader-first-use`, and `nov3-replay`. Both replay models were regenerated
and judged once per sample; all baseline records were reused unchanged.

The initial `node eval/chase-bug/check-report.mjs standalone-report` exited 1
with `candidate/anthropic/claude-opus-5-5: current successful reply`. All six
selected candidate records still identified the skill bundle from before the
step-4 ending-sentence correction. Refreshing those bundles repaired evidence
freshness; no candidate fact changed from holds to fails. All twelve current
model comparisons are improved against the pinned baseline, and all candidate
facts hold. No skill, fact, judge instruction, or intent change was needed.

Each command below ran separately with `EVAL_CONCURRENCY=4`; sample runs were
serial so they could not overwrite one another's shared report concurrently.

| Command | Exit | Observed runner result |
|---|---|---|
| `node eval/run.mjs chase-bug standalone-report` | 0 | improved; replay 2, judge 2, confirm 0, wall 37s |
| `node eval/run.mjs chase-bug sectioned-report-order` | 0 | improved; replay 2, judge 2, confirm 0, wall 36s |
| `node eval/run.mjs chase-bug prose-verdict-above-menu` | 0 | improved; replay 2, judge 2, confirm 0, wall 38s |
| `node eval/run.mjs chase-bug returned-ticket-link` | 0 | improved; replay 2, judge 2, confirm 0, wall 23s |
| `node eval/run.mjs chase-bug plain-reader-first-use` | 0 | improved; replay 2, judge 2, confirm 0, wall 50s |
| `node eval/run.mjs chase-bug nov3-replay` | 0 | improved; replay 2, judge 2, confirm 0, wall 35s |

## Reader assessment of selected records

Read the baseline and candidate replies and current judgments for both models
in each row. No behavior regression or new accepted behavior change was found;
intent remains unchanged rather than being widened to pass a check.

| Sample and current candidate evidence | Facts per model | Concrete result |
|---|---|---|
| [standalone-report](results/standalone-report/candidate.json) | 8 | Explains dark becoming light, the later default-theme step, and skipping that step after the saved choice loads; hotfix remains row 3. |
| [sectioned-report-order](results/sectioned-report-order/candidate.json) | 8 | Real-bug report ends in How to fix it; cannot-replicate ends in What happens next, naming the missing dataset size and preserving the discovery-ticket menu. |
| [prose-verdict-above-menu](results/prose-verdict-above-menu/candidate.json) | 8 | Gate report precedes its four-row menu; the independent reporter draft asks for browser and version and ends with confirmation outside the draft. |
| [returned-ticket-link](results/returned-ticket-link/candidate.json) | 8 | Terminal summary cites the returned existing issue 42, claims no new ticket, and contains no response gate or menu. |
| [plain-reader-first-use](results/plain-reader-first-use/candidate.json) | 6 | Explains the repeated four-minute check, asks for the failing data's row count, and gives the documented slash-free address without unexplained first-use shorthand. |
| [nov3-replay](results/nov3-replay/candidate.json) | 7 | Retains four-minute savings and the 312-versus-300-pixel overflow; the external-font check keeps hotfix pickable but recommends brainstorming at row 2. |

The judge's optional suggestions were checked against the actual contract, not
adopted as new requirements. A gate pick does not require opening an implementation
path; the existing test supports the proposed refresh check in standalone-report.
The golden menus use `[x]` for the recommendation, and a bare `eligible` is allowed.
The plain-reader because-clause's "one call" follows its explanation as the single
place that starts the summary step. These are not holds-to-fails regressions.

### Human-readable before and after

These excerpts are from the first replay model's committed
[plain-reader baseline](results/plain-reader-first-use/baseline.json) and
[current candidate](results/plain-reader-first-use/candidate.json), not idealized output.

| Surface | Before | After |
|---|---|---|
| Real-bug gate | "The CI job spends an extra four minutes running the same lint scan of the source tree twice." | "The automatic check that scans the code for rule violations runs that scan twice, adding four unneeded minutes to every run." |
| Cannot-replicate draft | "Your ten-row sample fixture rendered the chart in both Chrome and Firefox with clean profiles, and clearing the cache changed nothing" | "We loaded your ten-row sample data in Chrome and Firefox, using browser settings with no saved preferences, and the chart stayed after each refresh. Clearing the browser's stored copy of the data did not change that." |
| Not-a-bug summary | "The router matches addresses exactly" | "The documented rules for page addresses accept `/widgets` and reject addresses that end with a slash." |

## Final cached-evidence checks

Run in this order after the refreshes; each command exited 0 with the output shown.

| Command | Observed output |
|---|---|
| `node eval/chase-bug/check-report.mjs standalone-report` | `standalone-report: 2 current model pairs, all 8 candidate facts hold; no model calls` |
| `node eval/chase-bug/check-report.mjs sectioned-report-order` | `sectioned-report-order: 2 current model pairs, all 8 candidate facts hold; no model calls` |
| `node eval/chase-bug/check-report.mjs prose-verdict-above-menu` | `prose-verdict-above-menu: 2 current model pairs, all 8 candidate facts hold; no model calls` |
| `node eval/chase-bug/check-report.mjs returned-ticket-link` | `returned-ticket-link: 2 current model pairs, all 8 candidate facts hold; no model calls` |
| `node eval/chase-bug/check-report.mjs plain-reader-first-use` | `plain-reader-first-use: 2 current model pairs, all 6 candidate facts hold; no model calls` |
| `node eval/chase-bug/check-report.mjs nov3-replay` | `nov3-replay: 2 current model pairs, all 7 candidate facts hold; no model calls` |

## Coverage limits

`gate-line-first` and `menu-after-numbered-findings` were not rerun. Their existing
records are not current evidence for this repair. These selected no-tool text
replays do not prove live triage, tracker retrieval or writes, numeric-reply
execution, or hotfix execution. The comparisons attest only the selected facts;
judge feedback is not a separate acceptance contract.
