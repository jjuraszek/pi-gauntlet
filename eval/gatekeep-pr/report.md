# eval report: gatekeep-pr (selected samples only)

Only `plain-report` ran on the merged instructions. The other samples retain their historical results.

| Sample | Outcome |
|---|---|
| [plain-report](results/plain-report/report.md) | On the first merged replay, anthropic/claude-opus-5-5 missed `standing` by reporting the running required check without saying merge had to wait for it; the confirmation held that fact, and both models held every fact on the second replay. |

## Earlier main replay: spec-stale-nit

This evidence predates the merged prompt.

for: 275bcbb5dfe1702db8f7018cd7da28be88aeda55445f5179f7cf2995b9ab13ef

wall: 106s

Only `spec-stale-nit` was rerun, with a fresh baseline for the expanded case. Both candidates gave the blocker no spec edit and its sibling the selected wording. After the pushed spec also changed the sign-in row, both kept the sort point open and dispatched the signed-out-search repair with the prior row and Design clause.

Historical evidence, not rerun here: [action-row-one](results/action-row-one/candidate.json) and [contract-row-judged](results/contract-row-judged/candidate.json) cover menu choices; [consent-contract-change-stop](results/consent-contract-change-stop/candidate.json) covers the pause before a pick. The earlier `spec-stale-nit` result covered cases A-F only; the cells below supersede it and include G-H. This is not a target-wide pass.

## Change

Judge a proposed contract change from the reread ticket, or from whether the PR can deliver its goal under the current wording. Never back dropping the intended outcome itself. Show the exact endpoint paths in the two wordings and explain the choice only in the three sentences, without a standing report, tracker IDs or endpoint paths in the explanation. Case G of `action-row-one` checks that the explanation says the existing address can already serve the build version; a deterministic check alone cannot establish that the recommendation explains the consequence. When a linked ticket could not be read and nothing else decides, name the failed read in the third menu sentence or the report item's one reason. `contract-row-judged` simulates ticket reads and stops at the menu: a text assertion alone cannot tell whether the gate separates the intended outcome from a proposed means. `action-row-one` and `consent-contract-change-stop` cover the surrounding menu and consent rules, including that accepting changes the requirement rather than the PR description; `spec-stale-nit` checks whether the first report distinguishes a stale spec from a blocker. The simulated handoffs show what each worker receives: the blocker gets no spec edit and its sibling gets the selected wording. A pushed spec with an extra change cannot replace the stored rows and Design text used to judge and dispatch the next repair. No worker actually runs. Unselected samples retain historical results.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| spec-stale-nit | anthropic/claude-opus-5-5 | improved | 37453 | backed: fails -> holds (intended change); keep: holds -> holds (held); independent: fails -> holds (unplanned improvement); handoff: holds -> holds (intended but unchanged); addition: fails -> holds (intended change); dispatch: holds -> holds (intended but unchanged); retained: fails -> holds (intended change); worker: fails -> holds (intended change) |
| spec-stale-nit | github-copilot/gpt-6.1-sol | improved | 18013 | backed: fails -> holds (intended change); keep: fails -> holds (unplanned improvement); independent: fails -> holds (unplanned improvement); handoff: fails -> holds (intended change); addition: fails -> holds (intended change); dispatch: fails -> holds (intended change); retained: fails -> holds (intended change); worker: holds -> holds (intended but unchanged) |

## Feedback

- spec-stale-nit / anthropic/claude-opus-5-5: After moved five facts to holding and lost none that Before kept. In A and D the ticket-backed sort change is now a non-blocking "spec was not updated" point with both wordings, the stale-spec warning and a merge offer (A), while D still blocks on the untested never-opened branch. F now appears (Before omitted it entirely) and proposes a Design clause without quoting an invented current one. In H the extra sign-in rewrite now prevents adoption, the sort point stays open, signed-out search is a blocker against the prior row, and the repair task gets the prior row and title-sort Design with the spec file as edit target only. B and C still block for the right reasons, and G still gives the blocker no spec edit and has the reviewer flag any other scope change. Handoff was a close call in Before: it adopted only after review, push and readback, but said only that the readback matched the pair, not that it was the sole scope change; After states this explicitly ("the whole scope change equals the selected edit"), so keep that sentence. To keep these results, preserve the explicit "nothing shows that switching is necessary" reason in C, the "Merging without this edit leaves the spec out of date" sentence inside the D and F items, and the "Authorized spec edit: none" and "Edit target only" labels in G and H. One thing to watch: After's A says the sort-by-title requirement "is not covered" in the standing sentence while also saying nothing blocks, which could read as contradictory; consider wording the standing as "the spec still says title order" instead.
- spec-stale-nit / github-copilot/gpt-6.1-sol: After moves almost every fact by letting the reread ticket, or the goal's deliverability, decide whether a departure from the Design is a blocker or a stale-spec nit. A and D now show the current and proposed wording with the ticket reason and the stale-spec warning, and D still blocks on the untested never-opened branch. F drafts a Design clause without inventing a current one. E and G authorize the exact wording pair for the nit worker only, and E adopts the baseline only after review, push and readback at the rebound head. H refuses adoption because of the unselected sign-in change, keeps the sort point open and calls signed-out search a blocker against the retained row. On `keep`, Before blocked in B and C but for a different reason (the spec governs regardless of the ticket), so I marked it failing as written; After gives the stated reasons: title sorting still delivers lookup in B, and nothing shows the required order cannot deliver the goal in C. Keep those two sentences. On `worker`, Before already handed the repair task the prior row and Design wording as stored scope, so that fact did not move; After's explicit line 'Its current contents do not replace the stored contract' makes it unambiguous and is worth keeping. One loose end: After prints the `gauntlet: gate=... recommended=1` line above the A heading rather than inside A's report, so place it within the case if other checks read A's report as a unit.

exit: 0

## Earlier PR replay: plain-report

This evidence predates the merged prompt. Only `plain-report` ran; unselected samples were not coverage for the change.

for: 9e6ad04224898cc7f016554533b44f8bb47a83cb5388ec32695a223e99146ee7

wall: 122s

The replay checked a functionality-only opening and evidence mapping, with Integration entries omitted from the report, evidence, and menus. The informational ticket cross-check and PR-named steps remain; a spec path named inside the PR body's Integration block is not a contract candidate.

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| plain-report | anthropic/claude-opus-5-5 | unchanged | 29613 | prose: holds -> holds (held); role: holds -> holds (held); sync: holds -> holds (held); scope: holds -> holds (intended but unchanged); findings: holds -> holds (held); standing: holds -> holds (held); language: holds -> holds (held); choices: holds -> holds (held) |
| plain-report | github-copilot/gpt-6.1-sol | inconclusive | 26729 | prose: holds -> holds (held); role: holds -> holds (held); sync: holds -> holds (held); scope: holds -> holds (intended but unchanged); findings: holds -> fails (regression); standing: holds -> holds (held); language: holds -> holds (held); choices: holds -> holds (held) |

- anthropic/claude-opus-5-5: Before already constrained row mapping, finding IDs, and counters to the evidence reply and omitted Integration entries. After still holds, but its standing puts the running required check after the comment sentence; keep that check beside the blockers and mention the actor's merge restriction only once.
- github-copilot/gpt-6.1-sol: Before already kept the report and evidence functionality-only. After named empty categories in prose, which the judge counted as a findings regression even without empty headings. Omit absent categories entirely while retaining the standing, CI evidence, and recommendation.

exit: 1

## Fresh PR replay: plain-report

This evidence predates the merged prompt. Only `plain-report` ran again, after the earlier GitHub Copilot judgment was inconclusive on findings: the fact failed in the primary judgment and held on confirmation.

for: 9e6ad04224898cc7f016554533b44f8bb47a83cb5388ec32695a223e99146ee7

wall: 61s

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| plain-report | anthropic/claude-opus-5-5 | unchanged | 29613 | prose: holds -> holds (held); role: holds -> holds (held); sync: holds -> holds (held); scope: holds -> holds (intended but unchanged); findings: holds -> holds (held); standing: holds -> holds (held); language: holds -> holds (held); choices: holds -> holds (held) |
| plain-report | github-copilot/gpt-6.1-sol | unchanged | 26512 | prose: holds -> holds (held); role: holds -> holds (held); sync: holds -> holds (held); scope: holds -> holds (intended but unchanged); findings: holds -> holds (held); standing: holds -> holds (held); language: holds -> holds (held); choices: holds -> holds (held) |

## Feedback

- plain-report / anthropic/claude-opus-5-5: No fact moved on this case, including scope, which was expected to go from fails to holds: Before already described the behaviors in the opening without row numbers, printed the 1-5 row mapping, P1/L1/P2/C1 and the 1 of 4 counters only in the show evidence reply, and named no Integration entry, latency observation or `not judged` outcome. After keeps all of that, so the functionality-only wording is delivered, but this case does not show a gain. The weakest point in After is standing in snapshot A: the second part now opens with only "Two problems block merging:", and the still-running required unit check has moved two paragraphs down, after the comment sentence, where it no longer reads as something that must finish before merge. I counted it as holding because the check is still called required and still running, but it is borderline; restore Before's shape, e.g. "Two problems block merging, and a required unit check is still running in CI." After's sync sentence is slightly better than Before's, since it drops the unsupplied "and pushed" and keeps "no commits were dropped". Its C report states the block twice ("GitHub reports the merge as blocked for you" and "Merge is not offered because GitHub blocks this actor"); one sentence is enough, but keep it in prose so it never becomes a "Not offered:" line. Keep comment-73, export_header and the file locators as they are, and keep SHAs, run IDs, the log path and usage counters behind show evidence, as both outputs do.
- plain-report / github-copilot/gpt-6.1-sol: No fact moved in this case: both outputs satisfy all eight as written, so the expected plain-report/scope fails -> holds is not visible here. Before already described the behaviours in a two-sentence opening without row numbers, named no Integration entry or status, had no `not judged` or post-merge observation, and printed the 1-5 mapping, P1/L1/P2/C1 and 1 of 4 counters only after `show evidence`. After does improve two things worth keeping: it states coverage as outcomes ("CSV download and header format are covered") where Before's "The spec covers..." could be read as describing the spec rather than the PR, and its standing sentence joins the fixes and the running required unit check as things that precede merge, where Before put the check in a later paragraph. One risk to tighten: "your team acme/reviewers" asserts a membership the snapshot never supplies (it lists Team acme/reviewers only as a requested reviewer); the role fact still holds because robin and acme/reviewers are preserved and alex is excluded, but "robin and the team acme/reviewers are requested reviewers" delivers the same thing without the invented relationship. Keep the raw values (SHAs, run 7001, the log path, "binding", "assessed head") confined to the evidence response as both outputs do, and keep the evidence mapping free of Integration entries so the scope fact stays held.

exit: 0

## Earlier PR replay: plain-report after the commit-body wording change

This evidence predates the merged prompt; the table at the top reports the merged replay.

for: f0ef39ea892df20ae120cb4cb6d320ab65db21581fa06d587287382f3715ef5f

wall: 73s

Saved rows for other samples predate the commit-body wording change and were not rerun.

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. Keep `differs` for missing or changed ticket rows; neither result changes the judgment.

Report functionality-only coverage in plain-report, both in the opening and in the evidence mapping. Omit Integration entries and their statuses from the report, evidence, and menus; retain the informational cross-check and PR-named steps, including open actions without trusted commands. Keep observation-only clauses out of post steps without promising a later judgment. A spec path named inside the PR body's Integration block is not a contract candidate for the merge gate.

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| plain-report | anthropic/claude-opus-5-5 | unchanged | 25162 | prose: holds -> holds (held); role: holds -> holds (held); sync: holds -> holds (held); scope: holds -> holds (intended but unchanged); findings: holds -> holds (held); standing: holds -> holds (held); language: holds -> holds (held); choices: holds -> holds (held) |
| plain-report | github-copilot/gpt-6.1-sol | unchanged | 26893 | prose: holds -> holds (held); role: holds -> holds (held); sync: holds -> holds (held); scope: holds -> holds (intended but unchanged); findings: holds -> holds (held); standing: holds -> holds (held); language: holds -> holds (held); choices: holds -> holds (held) |

## Feedback

- plain-report / anthropic/claude-opus-5-5: No fact moved on this case: the expected plain-report/scope shift from fails to holds is not visible, because Before already described functionality only in the opening and the evidence mapping, with no Integration entry or status, and After does the same. After is still at risk in three places. In B and C the recommendation paragraph now carries standing material: "You cannot approve your own PR" in B, and in C a repeat of the block sentence using the internal-sounding "this actor". Wording that keeps the third part to the single recommendation sentence, and puts standing facts only at the start of the second part addressed to "you", would protect prose and standing. A's evidence response now prints "verdict: fixable", which is tolerable only because it sits inside the requested inspection, so say explicitly that the verdict value never appears as a line in the report itself. After's C deliver row replaced the numeric attempt allowance with "a fresh allowance", and B no longer mentions that the review is approved; neither breaks a fact, but stating that supplied human facts such as approval are preserved would keep them stable. After's A sync sentence is closer to the supplied record than Before's, which added an unsupported "and pushed"; keep that.
- plain-report / github-copilot/gpt-6.1-sol: No fact moved on this case: both outputs satisfy all eight as written, so the expected plain-report/scope move from fails to holds does not show here. Before already described the five behaviors by function in a two-sentence opening without row numbers, printed the 1-5 row mapping, P1/L1/P2/C1 and 1 of 4 rounds and syncs only in the show evidence response, and named no Integration entry, latency observation or `not judged` outcome. After keeps all of that and makes two things clearer: the evidence record drops Before's `cross-check: not supplied`, `check dispositions` and `claim dispositions` filler lines, and A's standing sentence now puts the fixes and the still-running required unit check together ahead of merge, where Before left the check to a later paragraph. To keep every fact, hold the current shape: the scope opening in two functionality-only sentences, the row mapping, IDs and usage counters confined to the inspection response, SHAs, run IDs and the log path out of the report prose, and the recommendation as a separate sentence directly above Pick one. Two wordings carry some risk: 'also requested to review' could be read as counting the author among the reviewers, and A's body now runs to several paragraphs between the opening and the recommendation, which strains the three-part shape. If the Change is meant to show on this case, the input would need an Integration entry or observation-only clause for the wording to omit, since nothing in this snapshot exercises it.

exit: 0
