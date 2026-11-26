# eval report: gatekeep-pr-scope (partial run: integration-not-judged)

for: 725ec2f9ad4da1f33f9424dc1be932b6eb11313da8547e38e7227cb388b03a0b

wall: 55s

## Change

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| integration-not-judged | anthropic/claude-opus-5-5 | improved | 11070 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change) |
| integration-not-judged | github-copilot/gpt-6.1-sol | improved | 10661 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change) |

## Feedback

- integration-not-judged / anthropic/claude-opus-5-5: After moved the two facts it was meant to move and lost none. The cross-check line now reads "differs on row 3" instead of "differs on rows 2, 3", so the tracker update that the spec moved into Integration is no longer reported as drift, and the drift still does not block. The claim list now states that the body's Integration section is excluded, so the staging-total assertion no longer gets the "unverifiable-pre-merge" disposition that Before gave it, while the missing-id claim is still matched to src/importer.mjs:12 and test/importer.test.mjs:8. Functionality held in both: the rejection is covered, the line number is a gap and the single blocker, and the staging confirmation is explicitly not judged. Entries held in both, and After makes it firmer with the explicit "Spec Integration entries - no outcome" line. To keep these, retain the wording that matches a marked ticket row once without judging it and that drops anything under the body's Integration heading from the claim list. Keep the tag step's "open" status clearly a post-merge step status, so it is not read as a coverage outcome. Two things to watch: the prose sentence "The spec's staging and production checks are confirmed after deploy and are not part of this review" is fine as is, but it should not grow into per-entry statements that read as dispositions; and the After evidence repeats the "gauntlet: gate=" header before the re-rendered menu, which Before did not, though this affects no fact here.
- integration-not-judged / github-copilot/gpt-6.1-sol: After moved both expected facts and lost none. The cross-check now reads "differs on row 3" and says outright that ticket row 2 matches the spec's marked Integration entry and is excluded, where Before reported "differs on row 2" and so treated the tracker update as the drift while never naming the column number. The claims section now gives a disposition only to "The importer rejects records with no id." and says the PR body's Integration section is excluded from claim checking, where Before gave the staging-total assertion "unverifiable-pre-merge". Functionality and entries hold in both: the missing-id rejection is covered from src/importer.mjs:12 and the test, the line number is the single gap and blocker, staging confirmation and the column number add no gap, and the operational entries and tracker update get no coverage outcome or blocker. To keep this, hold on to the wording that matches a verbatim marked ticket row once without judging it and reports only the remaining drift by ticket row number. Also keep the explicit statement that body Integration observations get no claim disposition. Two risks to watch: the mixed row is labelled "Covered" with the staging clause quoted inside it, so keep the adjacent sentence saying the staging confirmation is an external observation and neither proof nor a gap, or a reader may take the staging part as covered. And the list of Integration entries says "receive no acceptance outcomes"; keep that as a single blanket statement rather than per-entry lines, which could read as coverage outcomes.

exit: 0
