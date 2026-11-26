# eval report: gatekeep-pr-scope (partial run: integration-names-spec-path)

for: 02ffb799ff2ffd5a86fcafc25504d8ac87ec8f895789c331a7885606773325d4

wall: 13s

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. With one ticket row absent from both spec sections, report `differs` for that original ticket row only. Omit Integration entries and their statuses from the report, evidence, and menus; retain the informational cross-check and actions already offered by the post-merge menu.

Select the contract from spec paths outside the PR body's Integration block. `integration-names-spec-path` checks that an absent path in a nested Integration line neither selects a contract nor blocks the gate. Rerun `integration-not-judged` and `post-merge-menu` to check that scope accounting and explicitly picked actions remain unchanged.

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| integration-names-spec-path | anthropic/claude-opus-5-5 | improved | 5677 | contract: fails -> holds (intended change); no-blocker-or-stop: fails -> holds (intended change) |
| integration-names-spec-path | github-copilot/gpt-6.1-sol | improved | 4823 | contract: fails -> holds (intended change); no-blocker-or-stop: fails -> holds (intended change) |

## Feedback

- integration-names-spec-path / anthropic/claude-opus-5-5: Both facts moved in the intended direction and nothing Before held was lost. Before treated the Integration-nested `doc/specs/staging-import-totals.md` as a second candidate, left the scope source unresolved, stopped to ask the human to pick between two specs, and held a conditional missing-spec blocker in reserve; After selects `doc/specs/import-validation.md` from the `## Contract` section, explicitly excludes the Integration block (including the nested Reference line) from contract selection, and reports no blockers or stops. The wording that restricts selection to spec paths outside the PR body's Integration block is what delivered this; keep that rule stated as covering nested lines under Integration entries and as applying to both candidacy and the missing-contract blocker, so an absent Integration-only path can neither select nor block. The trailing remark about not offering coverage posting to a ticket strays slightly past the selection boundary but does not affect either fact; if you want the replay output tighter, limit the selection step's output to the scope record plus blockers and stops.
- integration-names-spec-path / github-copilot/gpt-6.1-sol: Both facts moved as intended. Before selected the missing `doc/specs/staging-import-totals.md` because it treated the first spec-directory path in the body as governing, including one nested under Integration, and raised a blocker for the absent file. After selects `doc/specs/import-validation.md` from the Contract section, populates its row and design from the head spec, and states explicitly that the missing staging-totals file does not block selection, with no blockers, stops, or request to choose a spec. The wording that produced this is the rule to select the contract only from spec paths outside the PR body's Integration block; keep that phrasing explicit (an Integration path neither selects a contract nor triggers the missing-contract blocker) so the old 'first path named in the body governs' reading cannot return. No fact that Before held was lost in this case, since Before held neither. One minor note: After's `cross_check: "not run: no reference found"` is consistent with the no-ticket input and does not affect either fact.

exit: 0
