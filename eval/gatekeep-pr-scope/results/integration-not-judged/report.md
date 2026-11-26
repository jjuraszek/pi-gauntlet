# eval report: gatekeep-pr-scope (partial run: integration-not-judged)

for: fe8ab5d3633579fb62f48545a418b76c7055fa570612db93b67e74caf30e7b97

wall: 55s

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
| integration-not-judged | anthropic/claude-opus-5-5 | improved | 11810 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change) |
| integration-not-judged | github-copilot/gpt-6.1-sol | improved | 10859 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change) |

## Feedback

- integration-not-judged / anthropic/claude-opus-5-5: After moved two facts and lost none. The cross-check line now reads "differs on row 3" instead of "differs on rows 2, 3", so the tracker update that moved into a marked Integration entry is accounted for and only the added column number is reported as drift, still without a blocker. The claims list now matches only the missing-id assertion and says "The description's Integration section is not a claim and was not checked", where Before gave the staging-total line an unverifiable-pre-merge disposition. Functionality and entries held in both: missing-id rejection is covered from src/importer.mjs:12 and the test, the absent line number is the single gap and blocker, staging confirmation is called "neither evidence nor a gap", and the Integration entries explicitly "get no outcome and block nothing". To keep this, preserve the wording that counts a verbatim marked ticket row as accounted for without judging it, and the wording that excludes everything under the body's Integration heading, including nested assertions, from claim dispositions. Keep the two halves of the mixed row judged separately. Two fragile points: the bullet enumerating the Integration entries under "Coverage by requirement" holds only because it states they get no outcome, so the wording should require that explicit statement or keep the entries out of the coverage list; and the cross-check line never says the tracker row is accounted for, so if you want that visible rather than implied by omission, ask for it to be stated without labelling it missing or different.
- integration-not-judged / github-copilot/gpt-6.1-sol: After moved two facts and lost none. The cross-check now reads "differs on row 3" and its accounting matches ticket row 2 to the marked tracker-update Integration entry, where Before reported "differs on row 2". The material-claim list now holds only the missing-id assertion and says the body's Integration section is excluded, where Before gave the staging-total line an unverifiable-pre-merge disposition. Functionality is unchanged in substance: rejection is covered from src/importer.mjs:12 and the test, the line number is the single gap and blocker (L1), and neither staging confirmation nor the column number adds a gap. The six operational entries and the tracker update still get no coverage outcome or blocker; the tag is only noted as having an unresolved command. To keep this stable, keep the wording that makes a marked Integration entry account for a ticket row without judging it, and that reserves `differs` for rows with no verbatim acceptance or marked match. Two phrasings sit close to the line and are worth tightening: the mixed row's staging half should stay "an external observation, neither evidence nor a gap" and never get its own covered/gap label, and the "excluded from the material-claim list" line should stay a single exclusion statement, not a per-entry listing that could read as a disposition. The "do not block this code review" sentence in the opening is fine as long as it stays a non-blocker statement and not an outcome per entry.

exit: 0
