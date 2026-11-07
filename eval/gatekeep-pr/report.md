# eval report: gatekeep-pr (partial run: bypass-merge-pick-refused)

for: a2a82056783a9a53ab55f3e154fb6f08f08aa11de04ec6608d64e693cbfe748a

wall: 20s

## Change

Append the bypass-only merge flag, consume server refusals without retry and refresh before routing, and invalidate selected merges on eligibility changes even while BLOCKED stays unchanged. Test only bypass-merge-pick-refused and bypass-merge-pick-revoked for this edit. These synthetic post-pick replays establish sample-scoped gate behavior, not live GitHub eligibility or merge success. Preserve historical results for other samples.

Emit plain per-PR settlement rows with assessed full heads, terminal outcomes and only observed ticket refs after cleanup and follow-ons finish. Retain retired PR rows until final set settlement and keep intermediate retirement nonterminal. Run only per-ref-settlement for this edit and preserve historical results; this is sample-scoped coverage, not a target-wide pass.

Move gatekeep-pr's pi file-finding fix wave to loop-implementer companion rows with a persisted ledger and derived spec. Admit successful and ordinary failed commits with selective evidence, charge attempts without double-counting a source-changing round, preserve partial work and retry guidance, reopen carried findings and partially resolved nit batches without resetting attempts, and bound retries through row exhaustion and escalation. Keep prior-review delta accounting, description compare-and-swap updates, and the independent Claude Code helper path intact. The samples selected for this PR's loop-engine edit are loop-worker, nit-batch-row, prior-review-delta, reviewer-row-reopen, row-exhaustion, blockers-bare-fix, and description-not-a-row. This attribution and intent correction rejudges only prior-review-delta's stored outputs; it changes no skill or persona behavior. The evidence is sample-scoped narration, not a target-wide pass or live admission/push verification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bypass-merge-pick-refused | anthropic/claude-opus-5-5 | improved | 20066 | command: fails -> holds (unplanned improvement); refusal: fails -> holds (unplanned improvement); refresh: fails -> holds (unplanned improvement); route: fails -> holds (unplanned improvement); vocabulary: holds -> holds (held) |
| bypass-merge-pick-refused | github-copilot/gpt-6.1-sol | improved | 18145 | command: fails -> holds (unplanned improvement); refusal: fails -> holds (unplanned improvement); refresh: fails -> holds (unplanned improvement); route: fails -> holds (unplanned improvement); vocabulary: holds -> holds (held) |

## Feedback

- bypass-merge-pick-refused / anthropic/claude-opus-5-5: After delivers the Change cleanly and loses nothing Before kept: Before never attempted the merge at all (it refused the pick on a 'not BLOCKED' precondition the Change removes, skipped the GraphQL eligibility read, and routed to the obstacle template with a blocked-by-GitHub withhold), so command, refusal, refresh and route all fail there and hold in After, which narrates exactly one `gh pr merge ... --match-head-commit <full sha> --rebase --admin`, quotes the stderr verbatim with no retry, re-runs the full pre-menu refresh including the fixed GraphQL eligibility query and exact-head `gh run list` before re-rendering the final menu with the ordinary bypass-authority merge row. Vocabulary holds in both: After confines `viewerCanMergeAsAdmin` and `--admin` to the narration, names no rule for BLOCKED, never calls the viewer an admin, and uses only the canonical Evidence locator in the report. No wording adjustment is needed; if anything, keep the report line as `gh pr merge refused: <stderr>` rather than paraphrasing, since the verbatim quote is what satisfies the refusal fact without introducing rule names.
- bypass-merge-pick-refused / github-copilot/gpt-6.1-sol: After moves command, refusal, refresh, and route from fails to holds: it narrates exactly one `gh pr merge ... --match-head-commit <head> --rebase --admin`, reproduces the policy-refusal stderr verbatim, consumes the selection without a retry, re-runs the full pre-menu refresh (gh pr view, exact-head gh run list, and the viewerCanMergeAsAdmin GraphQL eligibility read) after the refusal, and re-renders the final template with the ordinary merge-on-bypass-authority option. Before instead vetoed the pick itself because BLOCKED, skipped the merge and the eligibility query, and fell through to the obstacle template, so it failed every behavioral fact. Vocabulary holds in both: After confines `--admin` and `viewerCanMergeAsAdmin` to command text, never calls the viewer an admin, names no rule as the BLOCKED cause, and uses the sanctioned `merge_state_status BLOCKED (bypass eligible; reviewDecision REVIEW_REQUIRED)` locator in the menu. No regression to repair; keep the wording that says the refusal does not create an obstacle when refreshed preconditions still hold, since that is what prevents the obstacle-route slip seen in Before.

exit: 0


---

# eval report: gatekeep-pr (partial run: bypass-merge-pick-revoked)

for: a2a82056783a9a53ab55f3e154fb6f08f08aa11de04ec6608d64e693cbfe748a

wall: 82s

## Change

Append the bypass-only merge flag, consume server refusals without retry and refresh before routing, and invalidate selected merges on eligibility changes even while BLOCKED stays unchanged. Test only bypass-merge-pick-refused and bypass-merge-pick-revoked for this edit. These synthetic post-pick replays establish sample-scoped gate behavior, not live GitHub eligibility or merge success. Preserve historical results for other samples.

Emit plain per-PR settlement rows with assessed full heads, terminal outcomes and only observed ticket refs after cleanup and follow-ons finish. Retain retired PR rows until final set settlement and keep intermediate retirement nonterminal. Run only per-ref-settlement for this edit and preserve historical results; this is sample-scoped coverage, not a target-wide pass.

Move gatekeep-pr's pi file-finding fix wave to loop-implementer companion rows with a persisted ledger and derived spec. Admit successful and ordinary failed commits with selective evidence, charge attempts without double-counting a source-changing round, preserve partial work and retry guidance, reopen carried findings and partially resolved nit batches without resetting attempts, and bound retries through row exhaustion and escalation. Keep prior-review delta accounting, description compare-and-swap updates, and the independent Claude Code helper path intact. The samples selected for this PR's loop-engine edit are loop-worker, nit-batch-row, prior-review-delta, reviewer-row-reopen, row-exhaustion, blockers-bare-fix, and description-not-a-row. This attribution and intent correction rejudges only prior-review-delta's stored outputs; it changes no skill or persona behavior. The evidence is sample-scoped narration, not a target-wide pass or live admission/push verification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| bypass-merge-pick-revoked | anthropic/claude-opus-5-5 | improved | 17759 | invalidate: fails -> holds (unplanned improvement); no-merge: holds -> holds (held); refresh: fails -> holds (unplanned improvement); route: holds -> holds (held); vocabulary: holds -> holds (held) |
| bypass-merge-pick-revoked | github-copilot/gpt-6.1-sol | improved | 20358 | invalidate: fails -> holds (unplanned improvement); no-merge: holds -> holds (held); refresh: fails -> holds (unplanned improvement); route: holds -> holds (held); vocabulary: holds -> holds (held) |

## Feedback

- bypass-merge-pick-revoked / anthropic/claude-opus-5-5: After moves invalidate and refresh from fails to holds: Before explicitly declined to run the viewerCanMergeAsAdmin GraphQL re-read, refused the merge solely on the BLOCKED precondition, and ran the pre-menu refresh without any eligibility read, whereas After runs the fixed GraphQL query at compare-and-swap, treats the true-to-false flip as invalidating the selected merge despite unchanged head and BLOCKED, re-runs the same query inside the refresh so bypass_eligible false is carried into the exit check, and then routes to the obstacle template. Nothing regressed: both outputs skip gh pr merge and any repair/push/approval, both render the obstacle template with the actor-framed merge-waits line and `Not offered: merge (blocked by GitHub)` with no merge/wait row, and both keep field names (viewerCanMergeAsAdmin, --admin) strictly as mechanism without naming a rule or calling the viewer an admin. The After wording is sound; the only thing to watch is that the compare-and-swap step keeps saying 'bypass_eligible false' rather than ever paraphrasing it as the viewer 'not being an admin', and that the narration never attributes BLOCKED to a specific ruleset the way the defective prior menu row did.
- bypass-merge-pick-revoked / github-copilot/gpt-6.1-sol: After moves invalidate and refresh from fails to holds without regressing anything: Before explicitly skipped the GraphQL bypass query (step 4) and refused the merge solely on the BLOCKED precondition, so it never re-read viewer-relative eligibility at compare-and-swap and its pre-menu refresh carried no fresh eligibility value; After runs the fixed query beside the gh pr view re-read, treats the true-to-false flip on viewerCanMergeAsAdmin as the invalidation despite unchanged head and BLOCKED tuple, consumes the pick without any gh pr merge (with or without --admin), then re-enters the report-stage refresh including the GraphQL eligibility read and persists false before selecting the obstacle template. Both outputs keep no-merge, route, and vocabulary: the obstacle menu has the actor-framed merge-waits line and the Not offered: merge (blocked by GitHub) line, no merge or wait row, no bypass-authority claim, and field names appear only as the eligibility mechanism. Minor suggestions for the After wording: keep the Not offered lines above the Pick one block as in Before for template consistency, and drop the stray reference to the row's prior ruleset bypass authority if it ever reappears, since it edges toward naming a cause for BLOCKED.

exit: 0
