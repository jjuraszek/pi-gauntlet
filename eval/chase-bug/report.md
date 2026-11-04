# eval report: chase-bug (partial run: nov3-replay)

for: dc19f605f06c85cc7ba0e667233c65a8d1315acd23c06947ebde1a5c588154f7

wall: 38s

## Selected evidence and coverage

The six selected samples ran sequentially with `EVAL_CONCURRENCY=4` at the assembly above. Each saved candidate has two improved model cells with all candidate facts holding:

| Selected sample | Saved candidate |
|---|---|
| standalone-report | [eval/chase-bug/results/standalone-report/candidate.json](results/standalone-report/candidate.json) |
| prose-verdict-above-menu | [eval/chase-bug/results/prose-verdict-above-menu/candidate.json](results/prose-verdict-above-menu/candidate.json) |
| sectioned-report-order | [eval/chase-bug/results/sectioned-report-order/candidate.json](results/sectioned-report-order/candidate.json) |
| returned-ticket-link | [eval/chase-bug/results/returned-ticket-link/candidate.json](results/returned-ticket-link/candidate.json) |
| plain-reader-first-use | [eval/chase-bug/results/plain-reader-first-use/candidate.json](results/plain-reader-first-use/candidate.json) |
| nov3-replay | [eval/chase-bug/results/nov3-replay/candidate.json](results/nov3-replay/candidate.json) |

`gate-line-first` and `menu-after-numbered-findings` were not rerun. Other samples remain untested at this assembly; this is not a target-wide pass. The Cells and Feedback sections below retain the last selected run, `nov3-replay`, including its observed baseline outcomes.

Manual review compared all 12 final candidate replies with their cases. The prose-verdict gates now report confirmation of the cause without inventing a slash-removal test result. The sectioned-report negative gates request the missing dataset size without asserting who else possesses it. Their recommendation reasons refer to the failed reproduction or supplied small sample. The other selected replies describe the supplied theme-overwrite test, duplicate-scan run, font trial, documented address rule, and existing ticket without adding test procedures or results. This review found no unsupported factual claim in the final report bodies; it does not prove live triage, tracker writes, or hotfix execution. The initial refreshed prose-verdict candidate failed claims-supported, and a later draft overstated matching the reporter's setup; both were rejected and the rule was tightened before these final saved replies.

## Change

Replace the three-sentence, under-80-word verdict budget with one shared sectioned report contract. Use optional Context, What is broken, Why it is broken, and How to fix it for real bugs or What happens next for negative verdicts. Keep reports standalone and concise, with literal fixes, role-named mechanisms, visible proof, and trailing citations. Apply the shape to verdicts, reporter drafts, terminal summaries, and post-hotfix responses. End the gate's third section with the recommended pick and one because-clause; omit picks from drafts, summaries, and the hotfix seed. Preserve gate markers, menu numbering and recommendation, returned-ticket truth, citation sources, response confirmation, and hotfix seed evidence without menu recommendations.

Translate investigation shorthand before first use in every report, including Context and recommendation reasons. Describe tests at the specificity the case supplies, using changed input and observed result only when recorded, name components by their actions, and omit implementation citations unless the reader's next action requires opening them. Write the complete claim before appending its source or linked label at the sentence's end; name untested causes, unmeasured costs and unverified outcomes as unknown rather than inventing support. Ground every report claim and recommendation reason in supplied facts or their consequences, including who has missing input and how a test ran. The claims-supported facts in sectioned-report-order and prose-verdict-above-menu reject unsupported exclusivity and invented test inputs or results. Build Context from one repro line and the explanation that survived testing; add a line naming the specific unchecked fact only when one remains. Leave that line absent when nothing remains unchecked, and omit Context when it adds no evidence. The context-earns-place fact covers standalone-report, sectioned-report-order and nov3-replay as well as plain-reader-first-use; it rejects status such as "Nothing was blocked" even beside useful evidence. The plain-reader-first-use sample exercises this register and Context content in a real-bug gate, cannot-replicate draft and documented-rule not-a-bug summary.

The selected samples exercise report comprehension rather than sentence counting. The removed exact-three-sentence and under-80-word facts are superseded by section, standalone, under-180-word, and concision checks; menu echoes and delivery wrappers remain outside the report. Evidence is partial and does not prove live triage, tracker writes, or hotfix execution.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| nov3-replay | anthropic/claude-opus-5-5 | improved | 22725 | plain-reader: fails -> holds (unplanned improvement); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: holds -> holds (held); context-earns-place: holds -> holds (held); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |
| nov3-replay | github-copilot/gpt-6.1-sol | improved | 21939 | plain-reader: holds -> holds (held); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: fails -> holds (unplanned improvement); context-earns-place: holds -> holds (held); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |

## Feedback

- nov3-replay / anthropic/claude-opus-5-5: After kept every fact Before kept and moved plain-reader from fails to holds: Before leaned on unexplained shorthand ("CI job", "the lint step's results") and never said the fix replaces the font rather than the card, while After names the lint step by its action ("scans the code for rule violations"), says "automatic build check", states "leave the card width unchanged", and drops the file:line citations that the reader does not need for the next pick. Section bodies stayed to one paragraph each, both reports sit well under 180 words, Context was omitted rather than padded with status like "Nothing was blocked", the menus and eligibility lines are unchanged, and each gate still ends at its envelope. One minor wording note: the Change asks for "the recommended pick and one because-clause" at the end of the third section; After's "Choose hotfix because the change is that small and the controlled run already showed the summary stays the same" stacks two reasons, and the second gate's "This repository's tests also cannot check the new font" sits in How to fix it rather than being left to the eligibility line, so tightening to a single because-clause would match the contract more exactly without risking any of the facts above.
- nov3-replay / github-copilot/gpt-6.1-sol: After moves ends-at-envelope from fails to holds by dropping the trailing "Prior-report search completed ... baseline checks were clean" housekeeping line that Before appended after the eligibility line; everything Before kept (plain register, word cap, one-paragraph sections, intact menus, no Context pollution) is preserved, and the new What is broken / Why it is broken / How to fix it headings with a closing because-clause deliver the sectioned contract. Two small refinements would strengthen the After wording without risking any fact: the hotfix case drops the call-site citation entirely (tools/check-job.mjs:73), yet the reader's next action is to open that call site, so the contract should say 'keep a trailing citation when the recommended pick requires opening the location' rather than letting the model omit all citations; and the glyph case never states the pre-overflow width proof in What is broken (280 vs 312 is split across sections), so instruct that the measured before/after numbers accompany the claim they support. Also consider wording the eligibility line as 'all six predicates pass' so the count is visible, matching the not-eligible line's explicit predicate naming.

exit: 0
