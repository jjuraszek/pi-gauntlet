# eval report: gatekeep-pr-scope (partial run: cross-check-all-rows-moved)

for: c90090ed9730dbe5d97f89090389b8e2b559be8a964d9db3b458a37f6445a02d

wall: 31s

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
| cross-check-all-rows-moved | anthropic/claude-opus-5-5 | improved | 9662 | matched: fails -> holds (intended change); no-drift: fails -> holds (intended change); entries: holds -> holds (held); differs: fails -> holds (intended change); report-omits-entries: holds -> holds (intended but unchanged) |
| cross-check-all-rows-moved | github-copilot/gpt-6.1-sol | improved | 9945 | matched: fails -> holds (intended change); no-drift: fails -> holds (intended change); entries: holds -> holds (held); differs: fails -> holds (intended change); report-omits-entries: fails -> holds (intended change) |

## Feedback

- cross-check-all-rows-moved / anthropic/claude-opus-5-5: The After wording moved three facts by counting marked Integration entries toward ticket-row accounting: A's cross-check now reads `matched` instead of `differs on rows 1, 2`, no ticket row is reported as missing or drifted, and B narrows to `differs on row 2` once the rollout-date entry is absent from both spec sections. The `entries` fact held in both outputs, since neither gives an Integration entry a coverage outcome or raises a blocker. `report-omits-entries` also held in both, contrary to the expected fails -> holds: Before never named the staging-count or rollout-date entries or gave either a status, and its `differs on rows 1, 2` line is only ticket-row accounting, so this case does not demonstrate that part of the Change. To keep these results, keep the rule that a verbatim, marked Integration entry accounts for its ticket row without being judged, and keep the cross-check line limited to `matched` or the original ticket row numbers, with no entry text or status. Unrelated to the facts, After also added a 'PR to gate' header with `+? -?` placeholders and dropped the merge-state line from show evidence; confirm both are intended.
- cross-check-all-rows-moved / github-copilot/gpt-6.1-sol: The After wording moved four facts in the intended direction and lost none. In A, show evidence now prints `cross-check: matched`, where Before printed `differs on rows 1, 2` because it treated the design-drafted acceptance rows as drift instead of counting the marked Integration entries as accounting for both ticket rows. In B, After reports `differs on row 2` only, where Before again reported rows 1 and 2. After also drops Before's `Staging verification: not run` and `Ticket comment: not posted` lines, which stated a status for each Integration entry, so the report, evidence and menus no longer name or status those entries. The `entries` fact held in both: neither output gives an Integration entry a coverage outcome or a blocker. To keep this, retain the wording that counts marked Integration entries toward ticket-row accounting without listing them, and keep verification lines limited to checks actually tied to acceptance rows. One small point: After's B answer is not labelled `B:` and directly follows A's re-rendered menu, so consider wording that keeps the separately requested line visibly distinct from the gate output.

exit: 0
