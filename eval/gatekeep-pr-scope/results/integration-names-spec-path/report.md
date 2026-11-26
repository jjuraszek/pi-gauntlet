# eval report: gatekeep-pr-scope (partial run: integration-names-spec-path)

for: 9792f40c5e710241c5f6af7b1370c1f9dc686de0ba6e475d6bd67a0c422839f9

wall: 11s

## Change

Select the contract from spec paths outside the PR body's Integration block. `integration-names-spec-path` checks that an absent path in a nested Integration line neither selects a contract nor blocks the gate. Rerun `integration-not-judged` and `post-merge-menu` to check that scope accounting and explicitly picked actions remain unchanged.

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| integration-names-spec-path | anthropic/claude-opus-5-5 | unchanged | 3793 | contract: holds -> holds (intended but unchanged); no-blocker-or-stop: holds -> holds (intended but unchanged) |
| integration-names-spec-path | github-copilot/gpt-6.1-sol | improved | 4233 | contract: fails -> holds (intended change); no-blocker-or-stop: fails -> holds (intended change) |

## Feedback

- integration-names-spec-path / anthropic/claude-opus-5-5: Neither fact moved between the two outputs: both Before and After select `doc/specs/import-validation.md` at the head as the contract, treat the Integration-nested `doc/specs/staging-import-totals.md` as a non-candidate, and report no blocker, stop, or request to choose a spec. This means the expected fails -> holds movement is not visible in this pair, since Before already satisfied both facts. After's wording states the exclusion more directly (the Integration block, including its nested Reference line, is excluded from contract-path selection; the path's absence creates no blocker; the two-candidate stop does not apply), which delivers the Change; keep those explicit statements, and keep the explicit 'None' under blockers or stops so the no-blocker fact stays unambiguous.
- integration-names-spec-path / github-copilot/gpt-6.1-sol: Both facts moved as intended and neither was held by Before, so nothing regressed. Before selected the first spec-directory path in the PR body (`doc/specs/staging-import-totals.md` under Integration) and raised a blocker for its absence at the assessed head; After selects `doc/specs/import-validation.md` from the Contract section, fills in the row and design from the head spec, and states explicitly that the Integration-nested reference is excluded from selection and its missing file does not block. The wording that excludes spec paths inside the PR body's Integration block from contract selection is what moved both facts; keep that exclusion phrased so it covers nested lines under Integration entries (as here) and keep the explicit statement that an absent Integration-only path raises neither a blocker nor a selection stop, so the output continues to say so plainly rather than leaving it implied.

exit: 0
