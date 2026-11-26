# eval report: gatekeep-pr-scope (partial run: integration-not-judged)

for: f4621590debcafc1e261c75e1979a7c39b18174539c1150f3c1cd5bec74e99a5

wall: 54s

## Change

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| integration-not-judged | anthropic/claude-opus-5-5 | improved | 12379 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change) |
| integration-not-judged | github-copilot/gpt-6.1-sol | improved | 12314 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change) |

## Feedback

- integration-not-judged / anthropic/claude-opus-5-5: Two facts moved from fails to holds and none regressed. The cross-check moved because After prints "differs on row 3" and adds a ticket accounting line that matches ticket row 2 to the spec's marked tracker-update entry; Before printed "differs on rows 2, 3", reporting the moved tracker row as drift. The claims fact moved because After says outright that the PR body's Integration section is not a claim and was excluded, where Before gave the nested staging-total assertion an unverifiable-pre-merge disposition and repeated it in the opening prose. Functionality holds in both: rejection is covered from src/importer.mjs:12 and test/importer.test.mjs:8, the missing line number is the only gap and blocker, and neither the staging confirmation nor the column number adds one. Entries also holds in both; After's explicit "no outcome; they never block" line is safe, but keep it as one collective non-outcome line, because listing the entries individually could read as per-entry coverage. To keep these results, keep the wording that matches a verbatim marked ticket row once and silently, and the wording that withholds any disposition label from Integration-heading observations (naming them only as excluded). Two side effects are worth checking against intent: After's menu drops the "overrule <n>" hint that Before had, and After widens the repair to docs/import.md and calls the docs lacking, although the spec does not require a docs change.
- integration-not-judged / github-copilot/gpt-6.1-sol: After moved both expected facts and lost none that Before held. The cross-check now names only the third ticket row (the added column number) and says outright that the tracker-update row is accounted for by the spec's marked Integration entry, where Before reported a difference on row 2. The claims section now matches only the missing-id assertion and excludes the body's whole Integration section, including the nested staging-total assertion, where Before gave that assertion an unverifiable-pre-merge disposition. Functionality and entries still hold: missing-id rejection is covered from the handler and test, the absent line number is the single gap and blocker, staging confirmation and column numbers add no gap, and the operational entries and tracker update get no coverage outcome or blocker. To keep this stable, keep the explicit sentences that the marked tracker row is matched and not drift, that drift is judged by check-delivery and is out of this gate's scope, and that Integration entries get no outcomes or dispositions. Keep the tag-the-release line worded as an unresolved after-merge action so it cannot read as a coverage outcome or blocker. Three small points sit outside the facts: "differs on rows 3" should read "row 3", the menu footer dropped Before's "overrule <n>" hint, and the mixed row is still quoted whole as "covered", so consider splitting its promised behavior from the staging observation so the observation is plainly unjudged.

exit: 0
