# eval report: chase-bug (partial run: nov3-replay)

for: f02b368313bf55c8bede098b6d26e3da1fab908ebf698d312252e0d6bd5eb31b

wall: 52s

## Change

Replace the three-sentence, under-80-word verdict budget with one shared sectioned report contract. Use optional Context, What is broken, Why it is broken, and How to fix it for real bugs or What happens next for negative verdicts. Keep reports standalone and concise, with literal fixes, role-named mechanisms, visible proof, and trailing citations. Apply the shape to verdicts, reporter drafts, terminal summaries, and post-hotfix responses. End the gate's third section with the recommended pick and one because-clause; omit picks from drafts, summaries, and the hotfix seed. Preserve gate markers, menu numbering and recommendation, returned-ticket truth, citation sources, response confirmation, and hotfix seed evidence without menu recommendations.

Translate investigation shorthand before first use in every report, including Context and recommendation reasons. Describe tests at the specificity the case supplies, using changed input and observed result only when recorded, name components by their actions, and omit implementation citations unless the reader's next action requires opening them. Write the complete claim before appending its source or linked label at the sentence's end; name untested causes, unmeasured costs and unverified outcomes as unknown rather than inventing support. Ground every report claim and recommendation reason in supplied facts or their consequences, including who has missing input and how a test ran. The claims-supported facts in sectioned-report-order, prose-verdict-above-menu and nov3-replay reject restated mechanisms that change the recorded action, fix scopes narrower or wider than the case records, unsupported input ownership, invented test inputs or results, and citations before a complete role-named claim ends. Keep the summary's second tree walk to list files distinct from the first rule-violation check, and keep a fix recorded as small and safe at that size rather than inferring a one-comparison limit from a faulty location. Build Context from one repro line and the explanation that survived testing; add a line naming the specific unchecked fact only when one remains. Leave that line absent when nothing remains unchecked, and omit Context when it adds no evidence. The context-earns-place fact covers standalone-report, sectioned-report-order and nov3-replay as well as plain-reader-first-use; it rejects status such as "Nothing was blocked" even beside useful evidence. The plain-reader-first-use sample exercises this register and Context content in a real-bug gate, cannot-replicate draft and documented-rule not-a-bug summary.

## Selected refresh and manual review

Coverage is partial: exactly the six selected samples below were refreshed sequentially with `EVAL_CONCURRENCY=4 node eval/run.mjs chase-bug <sample>`. Each saved candidate uses the assembly hash above and records `improved` for both model cells.

| Selected sample | Saved results |
|---|---|
| standalone-report | `eval/chase-bug/results/standalone-report/candidate.json` |
| prose-verdict-above-menu | `eval/chase-bug/results/prose-verdict-above-menu/candidate.json` |
| sectioned-report-order | `eval/chase-bug/results/sectioned-report-order/candidate.json` |
| returned-ticket-link | `eval/chase-bug/results/returned-ticket-link/candidate.json` |
| plain-reader-first-use | `eval/chase-bug/results/plain-reader-first-use/candidate.json` |
| nov3-replay | `eval/chase-bug/results/nov3-replay/candidate.json` |

`gate-line-first` and `menu-after-numbered-findings` were not rerun. This evidence does not establish a target-wide pass, live triage, tracker writes, or hotfix execution. The Cells and Feedback sections below contain only the runner's last selected sample, `nov3-replay`.

Manual review compared all 12 final saved replies against their corresponding `case.md` files for the four requested claim-support checks: recorded mechanisms and pass purposes, recorded fix scope, ownership of missing input, and complete role-named claims before trailing citations. No reply failed those four checks. In particular, both prose gates keep the fix at "small and safe" without a one-comparison limit; both Nov 3 gates distinguish the rule-violation check from the summary's second walk to list files; missing dataset size remains missing input rather than knowledge attributed to its reporter; and the documented-rule links follow completed claims. This review is limited to those checks, not an attestation of every report-shape requirement.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| nov3-replay | anthropic/claude-opus-5-5 | improved | 30627 | claims-supported: holds -> holds (held); plain-reader: fails -> holds (unplanned improvement); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: holds -> holds (held); context-earns-place: holds -> holds (held); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |
| nov3-replay | github-copilot/gpt-6.1-sol | improved | 31491 | claims-supported: fails -> holds (unplanned improvement); plain-reader: fails -> holds (unplanned improvement); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: fails -> holds (unplanned improvement); context-earns-place: holds -> holds (held); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |

## Feedback

- nov3-replay / anthropic/claude-opus-5-5: After delivers the Change cleanly: both gates use the three fixed headings, each section is a single paragraph, both stay around 150 words, Context is correctly omitted, menus and eligibility lines are untouched, and the second tree walk is described as producing the summary list rather than repeating the rule-violation scan. The only fact that moved is plain-reader, from fails to holds, because After replaces the unexplained 'CI job' and 'lint step' with 'automatic build check' and 'scans the code for rule violations', explains 'drawing' for glyph, and states that the card width stays unchanged, whereas Before left those terms bare and never contrasted the font swap with the card. Two small wording points for the author: the How to fix it sections restate the same sentence twice (the one-call-site scope and the asset-owner coordination appear once as a claim and again verbatim in the because-clause), so tell the contract to let the because-clause carry that reason alone; and the proposed outcome sentences ('This should make the check finish four minutes sooner') sit beside an already-observed controlled run, which is acceptable but could be folded into the observed result to avoid a reader wondering whether the outcome was tested.
- nov3-replay / github-copilot/gpt-6.1-sol: After improves on every fact Before failed and regresses none: it drops the Before claim that the summary 'repeats the rule-violation scan' in favour of 'scans again to produce the same list for the final summary', keeps the one-call-site reuse and font-not-card fix scopes as recorded, labels the hotfix's effect as 'expected' rather than observed, uses role names ('automatic build check', 'summary builder', 'drawing for z') with no citations, and stops at the eligibility line instead of appending the prior-report/baseline housekeeping that Before trailed after the menu. Two spots are worth tightening so the next sample does not slip: in Checkpoint 1 say explicitly that the second pass 'walks the same tree to list files for the summary' so no reader can mistake 'the same list' for a second rule-violation check, and in Checkpoint 2 avoid the slightly overreaching 'the replacement's outcome remains unverified' when the complete-font trial did show 280 pixels - phrase it as 'this repository's tests cannot verify the changed external asset' only. Also consider keeping the recommended pick's because-clause from merely restating the preceding sentence ('one-call-site change' appears twice); one clause tied to the eligibility result would read less redundant while still ending the third section with the pick.

exit: 0
