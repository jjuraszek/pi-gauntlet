# eval report: gatekeep-pr-scope (partial run: integration-not-judged)

for: c90090ed9730dbe5d97f89090389b8e2b559be8a964d9db3b458a37f6445a02d

wall: 55s

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. With one ticket row absent from both spec sections, report `differs` for that original ticket row only. Omit Integration entries and their statuses from the report, evidence, and menus; retain the informational cross-check and PR-named steps, including open actions without trusted commands. Keep observation-only clauses out of post steps without promising a later judgment.

Select the contract from spec paths outside the PR body's Integration block. `integration-names-spec-path` checks that an absent path in a nested Integration line neither selects a contract nor blocks the gate. Rerun `integration-not-judged` and `post-merge-menu` to check that scope accounting and explicitly picked actions remain unchanged.

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. State the reason tagging the release is open without giving it a runnable row, and promise no later judgment of the mixed row's staging confirmation. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| integration-not-judged | anthropic/claude-opus-5-5 | improved | 13210 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change); open-tag: holds -> holds (intended but unchanged); no-later-judgment: fails -> holds (intended change) |
| integration-not-judged | github-copilot/gpt-6.1-sol | improved | 13483 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change); open-tag: holds -> holds (intended but unchanged); no-later-judgment: fails -> holds (intended change) |

## Feedback

- integration-not-judged / anthropic/claude-opus-5-5: After moved three facts and lost none. The cross-check now reads "differs on row 3" where Before read "differs on rows 2, 3", so the tracker update is accounted for and only the added column number shows as drift. The claim list now states that the body's Integration section is excluded, which removes Before's "unverifiable-pre-merge" disposition for the staging total. Row 1 now says the staging confirmation "counts neither as evidence nor as a gap", replacing Before's "checked after merge", "not judged here" and "left to /skill:check-delivery", so no later judgment is promised. Functionality, entries and open-tag held in both: the line number is still the only gap and blocker, no Integration entry gets a coverage outcome, and tagging is still shown as open with its reason (no command in the merge-base documents) and no menu row. To keep this, retain the explicit exclusion wording in the claims header, the "neither evidence nor a gap" phrasing for observation clauses, and the open-step reason. One residual risk is the fixed cross-check tail "/skill:check-delivery judges the ticket": it sits near a ticket row that contains the staging confirmation, so keep it scoped to ticket drift so it cannot be read as deferring that confirmation. Another is the drafted payload, which now adds a docs/import.md update; keep that framed as part of the line-number repair so it is not read as a separate gap.
- integration-not-judged / github-copilot/gpt-6.1-sol: After moved three facts and kept the other three. The cross-check now reads "differs on row 3", and the ticket accounting says the tracker update matches the marked ticket-only entry and the column number is not added to the gate's requirements; Before said "differs on row 2". The claims section now says the body's Integration section contributes no material claims, where Before gave the staging-total assertion an unverifiable-pre-merge disposition. The opening no longer says the staging confirmation "is checked after merge", and the mixed row is judged covered on the rejection alone, with the staging confirmation called an external observation. Three wordings are worth tightening to keep these stable. First, say explicitly that the cross-check row number is the original ticket row, since Before's bare "row 2" was ambiguous between spec and ticket numbering. Second, "not a pre-merge requirement" could be read as implying a post-merge check, and the retained "/skill:check-delivery judges the ticket" line sits close to a later-judgment promise; wording such as "an observation this gate does not judge" avoids both. Third, the "Ticket row 2 matches the marked ticket-only entry" line is close to naming an Integration entry, which the Change asks to omit; keep it as ticket-row accounting only, with no status attached. Keep stating the reason the tag action is open (no trusted command) in both the summary and the after-merge block, and keep it out of the numbered menu.

exit: 0
