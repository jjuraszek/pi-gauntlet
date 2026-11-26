# eval report: gatekeep-pr-scope (partial run: integration-names-spec-path)

for: fe8ab5d3633579fb62f48545a418b76c7055fa570612db93b67e74caf30e7b97

wall: 18s

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. Keep `differs` for missing or changed ticket rows, and give Integration entries no outcome or blocker.

Select the contract from spec paths outside the PR body's Integration block. `integration-names-spec-path` checks that an absent path in a nested Integration line neither selects a contract nor blocks the gate. Rerun `integration-not-judged` and `post-merge-menu` to check that scope accounting and explicitly picked actions remain unchanged.

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| integration-names-spec-path | anthropic/claude-opus-5-5 | improved | 4898 | contract: fails -> holds (intended change); no-blocker-or-stop: fails -> holds (intended change) |
| integration-names-spec-path | github-copilot/gpt-6.1-sol | improved | 5238 | contract: fails -> holds (intended change); no-blocker-or-stop: fails -> holds (intended change) |

## Feedback

- integration-names-spec-path / anthropic/claude-opus-5-5: Both facts moved as intended. Before treated the Integration-nested path `doc/specs/staging-import-totals.md` as a second contract candidate, so it stopped to ask the human to choose between two specs, left the scope source unresolved, and held open a conditional blocker for the missing file; After excludes the path inside the Integration block from contract selection, selects `doc/specs/import-validation.md` from the Contract section with its row and design populated, and states explicitly that selection produced no blockers, no stops and no spec-choice question. Before held neither fact, so there is nothing to preserve from it here; to keep After's result stable, keep the wording that spec paths inside the PR body's Integration block (including nested Reference lines) are never contract candidates and that their absence at head neither mints a blocker nor triggers a selection stop, and keep the missing-contract blocker tied only to paths named outside Integration.
- integration-names-spec-path / github-copilot/gpt-6.1-sol: Both facts moved from fails to holds as intended. In Before, the output selected `doc/specs/staging-import-totals.md` (the path nested in the Integration block) as the contract, explicitly stated that the first spec-directory path governs selection even inside Integration, and raised a blocker for its absence at the assessed head. In After, the wording that restricts contract selection to spec paths outside the PR body's Integration block led the output to select `doc/specs/import-validation.md`, populate its acceptance row and design from the head spec, and state explicitly that the absent staging reference creates no selection blocker and that no blockers or stops arise. No fact that Before held was lost, since Before held neither. To keep this stable, retain the explicit statement that Integration-nested paths neither select a contract nor trigger the missing-contract blocker, and keep the exclusion phrased as applying to any line under the Integration heading (including nested Reference lines) so that the 'first spec path named in the body' rule cannot be read as overriding it; the `cross_check: not run: no reference found` result is consistent with no ticket reference being found and need not change.

exit: 0
