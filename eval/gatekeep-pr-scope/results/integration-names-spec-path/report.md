# eval report: gatekeep-pr-scope (partial run: integration-names-spec-path)

for: c90090ed9730dbe5d97f89090389b8e2b559be8a964d9db3b458a37f6445a02d

wall: 13s

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
| integration-names-spec-path | anthropic/claude-opus-5-5 | improved | 4872 | contract: fails -> holds (intended change); no-blocker-or-stop: fails -> holds (intended change) |
| integration-names-spec-path | github-copilot/gpt-6.1-sol | improved | 4922 | contract: fails -> holds (intended change); no-blocker-or-stop: fails -> holds (intended change) |

## Feedback

- integration-names-spec-path / anthropic/claude-opus-5-5: After's instruction to select the contract only from spec paths outside the PR body's Integration block moved both facts: the output now picks `doc/specs/import-validation.md` from the `## Contract` section, treats the nested `doc/specs/staging-import-totals.md` reference as a non-candidate, and explicitly reports no blocker or stop, whereas Before treated both paths as candidates, stopped to ask the human to choose, and left the scope source unresolved with a conditional blocker for the missing staging spec. Before held neither fact, so there is nothing to recover; to keep the gain stable, keep the wording explicit that nested lines under Integration (including `Reference:` sub-bullets) are excluded from contract-path selection and that an absent path named only there cannot mint the 'PR names a spec that is not at its head' blocker or trigger a selection question, while a missing path named outside Integration still does.
- integration-names-spec-path / github-copilot/gpt-6.1-sol: Both facts moved from fails to holds, as expected. Before selected the absent `doc/specs/staging-import-totals.md` because it treated the first spec path in the body as governing even when nested under Integration, and raised a missing-spec blocker; After selects `doc/specs/import-validation.md` from the Contract section, fills its acceptance row and design, and explicitly states that the Integration-nested reference is excluded from selection and its absence does not block. The wording that delivered this is the rule to select the contract from spec paths outside the PR body's Integration block; keep that phrasing explicit about both halves (an Integration path neither selects a contract nor triggers the missing-contract blocker or a selection stop), since Before held neither fact and there is nothing here that After lost. If you tighten further, keep the output stating the reason the Integration path was ignored, as that is what makes the no-blocker outcome legible to a reader.

exit: 0
