# eval report: chase-bug (partial run: server-cache-owner)

for: b184ef96f57c9121aa8c91ffa6438ed652ee4afac8f52c8302cf13263d5c55f2

wall: 55s

## Change

Replace the three-sentence, under-80-word verdict budget with one shared sectioned report contract. Use optional Context, What is broken, Why it is broken, and How to fix it for real bugs or What happens next for negative verdicts. Keep reports standalone and concise, with literal fixes, role-named mechanisms, visible proof, and trailing citations. Apply the shape to verdicts, reporter drafts, terminal summaries, and post-hotfix responses. End the gate's third section with the recommended pick and one because-clause; omit picks from drafts, summaries, and the hotfix seed. Preserve gate markers, menu numbering and recommendation, returned-ticket truth, citation sources, response confirmation, and hotfix seed evidence without menu recommendations.

Translate investigation shorthand before first use in every report, including Context and recommendation reasons. Describe tests at the specificity the case supplies, using changed input and observed result only when recorded, state each component's everyday role before its first name in each report, and omit implementation citations unless the reader's next action requires opening them. Write the complete claim before appending its source or linked label at the sentence's end; name untested causes, unmeasured costs and unverified outcomes as unknown rather than inventing support. Ground every report claim and recommendation reason in supplied facts or their consequences, including who has missing input and how a test ran. The claims-supported facts in sectioned-report-order, prose-verdict-above-menu and nov3-replay reject restated mechanisms that change the recorded action, fix scopes narrower or wider than the case records, unsupported input ownership, invented test inputs or results, and citations before a complete role-named claim ends. Keep the summary's second tree walk to list files distinct from the first rule-violation check, and keep a fix recorded as small and safe at that size rather than inferring a one-comparison limit from a faulty location. Build Context from one repro line and the explanation that survived testing; add a line naming the specific unchecked fact only when one remains. Leave that line absent when nothing remains unchecked, and omit Context when it adds no evidence. The context-earns-place fact covers standalone-report, sectioned-report-order and nov3-replay as well as plain-reader-first-use; it rejects status such as "Nothing was blocked" even beside useful evidence. The plain-reader-first-use sample exercises this register and Context content in a real-bug gate, cannot-replicate draft and documented-rule not-a-bug summary.

The selected samples exercise report comprehension rather than sentence counting. The removed exact-three-sentence and under-80-word facts are superseded by section, standalone, under-180-word, and concision checks; menu echoes and delivery wrappers remain outside the report. Evidence is partial and does not prove live triage, tracker writes, or hotfix execution.

## Selected refresh and manual review

Remove the verbatim fix-size requirement and state the example's size once in the recommendation's because-clause. Keep the supported-claims rule responsible for preserving recorded scope in everyday wording. Extend Context's closed recipe only by linking to the cleanup residual required by Hotfix record and return; routine successful cleanup and status filler remain excluded.

The earlier six selected samples were rerun against the previous assembly. Each saved candidate has two improved model cells and every candidate fact holds under its unchanged scoped checker.

| Selected sample | Saved results |
|---|---|
| standalone-report | `eval/chase-bug/results/standalone-report/candidate.json` |
| prose-verdict-above-menu | `eval/chase-bug/results/prose-verdict-above-menu/candidate.json` |
| sectioned-report-order | `eval/chase-bug/results/sectioned-report-order/candidate.json` |
| returned-ticket-link | `eval/chase-bug/results/returned-ticket-link/candidate.json` |
| plain-reader-first-use | `eval/chase-bug/results/plain-reader-first-use/candidate.json` |
| nov3-replay | `eval/chase-bug/results/nov3-replay/candidate.json` |
| server-cache-owner | `eval/chase-bug/results/server-cache-owner/candidate.json` |

The server-cache-owner sample was added for the cache-row correction and was the only sample rerun after it; the other six samples' records were not rerun against the corrected row.

`gate-line-first` and `menu-after-numbered-findings` were not rerun. Coverage is partial: these samples do not establish a target-wide pass, live triage, tracker writes, or hotfix execution. The residual exception is checked by reference review, not a new replay scenario.

The first `plain-reader-first-use` invocation exited 0 as improved but its scoped checker exited 1: the saved GPT candidate put `tools/check-job.mjs:73` inside an unfinished claim, so `citations` stayed fails. The first attempt's candidate record was not retained and only this description of its `citations` failure survives; the sample was rerun once without changing skill wording, facts, or checkers. The second invocation and its scoped checker exited 0; both current cells omit the unnecessary implementation path and retain the documented-rule link after its complete claim. The later standalone-report refresh is recorded below.

The standalone-report `proof` fact now rejects source locations, commands or links before or inside their complete supported claim and identifiers the next action does not need opened or run, following plain-reader-first-use's `citations` fact. The first invocation reused the saved replies and rejudged them: the runner exited 0 as improved, but the scoped checker exited 1 on the GPT cell's `proof` failure for the embedded command and path. That attempt was preserved in `eval/chase-bug/results/standalone-report/candidate-rejected-attempt-1.json` and candidate replies were regenerated without changing the assembly or intent. The second invocation and checker exited 0, but manual review caught the Opus cell naming the profile service before its role and repeating Context evidence. That attempt was also preserved in `eval/chase-bug/results/standalone-report/candidate-rejected-attempt-2.json` and candidate replies were regenerated once more. The third invocation and checker exited 0; both final cells omit unnecessary source paths and commands, name the role before the component, omit Context, and hold all nine facts. The other five samples' records remain unchanged.

The Cells and Feedback sections below contain only the server-cache-owner invocation. The earlier six samples remain available in their saved records. The `nov3-replay` comparisons use `eval/chase-bug/results/nov3-replay/baseline.json` (before) and `eval/chase-bug/results/nov3-replay/candidate.json` (after and judgments). Both model cells record baseline `section-order` and `plain-reader` as `fails`, and candidate `section-order` and `plain-reader` as `holds`.


Both server-cache-owner candidate cells hold cache-owner-named, moving from fails to holds. The GPT cell retains a pre-existing menu-intact failure: both arms render three rows rather than the four requested by this checkpoint. The tracker-origin skill menu normally omits File a ticket; this sample explicitly requests four rows. No skill or fact was changed to conceal that coverage limit.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| server-cache-owner | anthropic/claude-opus-5-5 | improved | 29636 | plain-reader: fails -> holds (unplanned improvement); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: holds -> holds (held); ends-at-envelope: holds -> holds (held); context-earns-place: holds -> holds (held); cache-owner-named: fails -> holds (intended change); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |
| server-cache-owner | github-copilot/gpt-6.1-sol | improved | 15101 | plain-reader: fails -> holds (unplanned improvement); under-cap: holds -> holds (held); lists-earn-place: holds -> holds (held); menu-intact: fails -> fails (pre-existing); ends-at-envelope: holds -> holds (held); context-earns-place: holds -> holds (held); cache-owner-named: fails -> holds (intended change); section-order: fails -> holds (unplanned improvement); no-labels: holds -> holds (held) |

## Feedback

- server-cache-owner / anthropic/claude-opus-5-5: After keeps everything Before kept and fixes the two Before failures: Before led with unexplained shorthand ("cache-key builder", "failed to falsify", "baseline and pre-menu checks are clean") and a mid-sentence parenthetical citation, and its first use of "cache" was unexplained; After names the service by role before its name, explains the saved copy and its owner in everyday words, keeps one paragraph per section, lands at roughly 165 words, omits Context cleanly, and ends at the eligibility line. Two small refinements would make the shape more robust without moving any fact: the How-to-fix section is the one place the reader's next action requires opening code, so append the trailing citation after the complete claim ("Add the date to the label used to find the saved copy, in services/price-list.mjs line 52."), and consider using the word "cache" once alongside its everyday gloss ("its own cache, a saved copy of each answer...") so a reader who meets the term elsewhere in the ticket can connect it to the owner named here.
- server-cache-owner / github-copilot/gpt-6.1-sol: After delivers the Change cleanly: the three fixed headings appear in order, the price-list API is introduced by role before its name, 'stored response' and 'cache key' are explained in everyday words with the service named as owner, the mid-sentence code citation is dropped, the fix is stated literally, and the third section ends with the pick plus a because-clause; nothing Before held was lost. The one fact that fails in both outputs is menu-intact: the case explicitly asks for four numbered rows with hotfix alone recommended and Respond to reporter only last, yet both renderings emit the same three-row menu. The After wording should state that the menu row count comes from the checkpoint instruction (render exactly the rows the case specifies, preserving numbering and recommendation) rather than reusing a fixed three-row template; otherwise the sectioned-report contract is working as intended.

exit: 0
