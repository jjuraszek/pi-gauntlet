# eval report: gatekeep-pr-scope (partial run: integration-not-judged)

for: 9792f40c5e710241c5f6af7b1370c1f9dc686de0ba6e475d6bd67a0c422839f9

wall: 47s

## Change

Select the contract from spec paths outside the PR body's Integration block. `integration-names-spec-path` checks that an absent path in a nested Integration line neither selects a contract nor blocks the gate. Rerun `integration-not-judged` and `post-merge-menu` to check that scope accounting and explicitly picked actions remain unchanged.

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| integration-not-judged | anthropic/claude-opus-5-5 | improved | 10398 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change) |
| integration-not-judged | github-copilot/gpt-6.1-sol | improved | 9651 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change) |

## Feedback

- integration-not-judged / anthropic/claude-opus-5-5: After moved the two facts it was meant to move and lost none that Before kept. The cross-check now reads "differs on row 3" and says outright that ticket row 2 matches the spec's Integration entry marked as a tracker update, where Before reported "differs on rows 2, 3". The claim list now carries only the missing-id assertion and states that the body's Integration section is excluded, where Before gave the staging-total line an unverifiable-pre-merge disposition and repeated it in the summary prose. Functionality holds in both: missing-id rejection is covered from src/importer.mjs:12 and the test, the absent line number is the single gap and blocker, and neither the staging confirmation ("an outside observation, not judged here") nor the ticket's column number adds a gap. Entries holds in both: After's explicit "spec Integration entries: no outcome; they are not requirements of this PR" is clearer than Before's after-merge-steps list. To keep these, retain the wording that produces three things: the matched-once note for the marked tracker row, the exclusion of the body's Integration block from the claim list, and the split of the mixed row into a judged behavior and an unjudged observation. One caution: the After evidence no longer lists the after-merge tag step at all at the initial gate. That is fine for these facts, but make sure the wording still surfaces it in the post-merge menu, so the post-merge-menu facts stay intact.
- integration-not-judged / github-copilot/gpt-6.1-sol: After moved two facts and lost none. The cross-check now reads "differs on rows 3", with accounting that matches ticket row 2 to the marked Integration entry and excludes it, so only the added column number shows as drift and it is not raised as a blocker; Before reported "differs on row 2", which pointed at the tracker update. The claims section now gives a disposition only to the missing-id assertion and says the body's Integration section contributes no material claims, where Before marked the staging total as unverifiable-pre-merge. Functionality and entries hold in both: the rejection is covered from the handler and test, the line number is the sole gap and blocker, staging confirmation is called an external obligation rather than a gap, and the tag entry appears only as an unresolved after-merge action with no coverage outcome. To keep this, keep the wording that matches a verbatim marked ticket row once without judging it and that excludes observations under the body's Integration heading from claim dispositions. Also keep the spec's operational entries out of the AC and Design outcome lists, and avoid coverage words such as "covered" or "gap" for the staging confirmation or the tag action. Small nit: "differs on rows 3" should be singular when one row differs.

exit: 0
