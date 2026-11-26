# eval report: gatekeep-pr-scope (partial run: cross-check-all-rows-moved)

for: 02ffb799ff2ffd5a86fcafc25504d8ac87ec8f895789c331a7885606773325d4

wall: 33s

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
| cross-check-all-rows-moved | anthropic/claude-opus-5-5 | improved | 10468 | matched: fails -> holds (intended change); no-drift: fails -> holds (intended change); entries: holds -> holds (held); differs: fails -> holds (intended change); report-omits-entries: holds -> holds (intended but unchanged) |
| cross-check-all-rows-moved | github-copilot/gpt-6.1-sol | improved | 10062 | matched: fails -> holds (intended change); no-drift: fails -> holds (intended change); entries: holds -> holds (held); differs: fails -> holds (intended change); report-omits-entries: fails -> holds (intended change) |

## Feedback

- cross-check-all-rows-moved / anthropic/claude-opus-5-5: The After wording moved three facts as intended: A's show evidence now prints `cross-check: matched` instead of `differs on rows 1, 2`, so no ticket row is reported missing or drifted, and B now reads `differs on row 2` only, because the first ticket row is still accounted for by its marked Integration entry. The other two facts held in both outputs: neither names an Integration entry, gives one a coverage outcome, or raises a blocker. That means `report-omits-entries` was already satisfied in Before rather than moving from fails to holds as expected. No fact regressed, so nothing needs restoring. One thing to tighten: B's `row 2` is ambiguous, because the evidence block also numbers the spec acceptance rows 1 and 2. Have the wording say `ticket row 2` (or `original ticket row 2`) so the reader cannot take it for the spec's second acceptance row. Keep the instruction that the cross-check line summarizes ticket-row accounting only, without quoting Integration entry text or its marker, so the omission continues to hold.
- cross-check-all-rows-moved / github-copilot/gpt-6.1-sol: After moved four facts in the intended direction and lost none that Before held. The show evidence cross-check now reads `matched` instead of `differs on rows 1, 2`, so the marked Integration entries are counted against the ticket rows and neither row is reported as drifted, even though the acceptance rows were drafted from the design. B now reads `differs on row 2` only, so removing the rollout-date entry is pinned to that one original ticket row while row 1 stays accounted for. After also drops Before's `Staging verification: not run` and `Ticket comment: not posted` lines, which were stating statuses for the Integration entries inside the evidence; the report, evidence and menus now name neither entry. Neither output gives an Integration entry a coverage outcome or a blocker, so that fact held both times. To keep this, hold the rule that Integration entries feed only the one-line cross-check accounting and never appear under verification, coverage or the menu, and keep the wording that the `differs` line names original ticket row numbers only. Two small things to tighten: label B's line explicitly (After prints it with no `B:` marker, so it could be read as part of A's menu), and keep the `- the spec governs here; /skill:check-delivery judges the ticket` suffix only on `differs` lines, as After does.

exit: 0
