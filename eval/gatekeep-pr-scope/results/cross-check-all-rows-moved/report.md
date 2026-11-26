# eval report: gatekeep-pr-scope (partial run: cross-check-all-rows-moved)

for: fe8ab5d3633579fb62f48545a418b76c7055fa570612db93b67e74caf30e7b97

wall: 35s

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
| cross-check-all-rows-moved | anthropic/claude-opus-5-5 | improved | 5838 | matched: fails -> holds (intended change); no-drift: fails -> holds (intended change); entries: holds -> holds (held) |
| cross-check-all-rows-moved | github-copilot/gpt-6.1-sol | improved | 9098 | matched: fails -> holds (intended change); no-drift: fails -> holds (intended change); entries: holds -> holds (held) |

## Feedback

- cross-check-all-rows-moved / anthropic/claude-opus-5-5: The After wording moved both targeted facts: its show evidence cross-check line now reads "matched" and states that ticket rows 1-2 match the spec's Integration entries word for word with no row missing or changed, where Before reported "differs on rows 1, 2" and so implied drift on both ticket rows. The entries fact held in both: Before listed the two Integration items as not judged by the gate, and After gives them "no outcome; not requirements of this PR" and raises no blocker. To keep this stable, keep the rule that marked Integration entries count toward accounting for live ticket rows regardless of where the acceptance criteria were drafted from, keep `differs` reserved for a ticket row that is actually missing or reworded, and keep the explicit instruction that Integration entries get no coverage outcome and no blocker. One thing to watch: After's summary says the two ticket items "happen after merge, so this gate does not judge them"; that is fine here, but make sure the wording does not drift into assigning them a disposition such as deferred or pending, which would break the entries fact.
- cross-check-all-rows-moved / github-copilot/gpt-6.1-sol: The After wording moved `matched` and `no-drift` as intended: the cross-check line now reads "matched" and explains that each fetched ticket row matches one Integration entry word for word, where Before reported "differs on rows 1, 2" because the acceptance rows were drafted from the design. `entries` holds in both: After gives the two Integration entries no covered/uncovered outcome and says neither becomes an acceptance criterion or a blocker. The one risk is the standalone bullets "Staging label-count observation: not performed" and "Rollout-date ticket comment: not posted", which sit right after the cross-check and per-row coverage in a flat list and could be read as per-entry outcomes. Before kept the same statements under a Verification heading, where they read as plain facts about what was run. To keep `entries` safe while still delivering the Change, tell the skill to report unperformed Integration observations only as verification facts (grouped with the verification lines, or in one sentence such as "this gate ran no Integration entry"), and never as per-entry status lines next to coverage. Keep the explicit "no outcome, no blocker" sentence and the word-for-word accounting explanation that makes `matched` unambiguous.

exit: 0
