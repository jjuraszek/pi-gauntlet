# eval report: gauntlet (partial run: pr-body-drafted-row)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 30s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-drafted-row | anthropic/claude-opus-5-5 | unchanged | 9803 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| pr-body-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 6526 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-drafted-row / anthropic/claude-opus-5-5: No fact moved between the two outputs: f1 was expected to go from fails to holds, but Before already holds it on its own text. Both outputs render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:`, keep the PR-description listing out of the acceptance rows by re-proving behavior 1 as the directory state, keep the release-script PR-body behavior as a real row, and ask no cut or scope question with no none fallback. After's sorting-rule wording ("functionality that handles pull-request text, which the files deliver" stays an acceptance criterion; the attached proof sketch becomes neither a row nor an Integration entry) delivers the Change cleanly and correctly omits `## Integration`. The one soft spot is After's row 1, "contains no test files": it is slightly weaker than the Design's "test directory is empty" and drops the removal framing that Before kept ("contains no files: every obsolete parser test file has been removed"). To keep f2 robust, tell the writer to state the drafted row's observable in the Design's own terms (directory empty after removing the obsolete tests) rather than paraphrasing it into a narrower condition, and keep the release-script row naming the changelog section and the pull request body explicitly.
- pr-body-drafted-row / github-copilot/gpt-6.1-sol: No fact moved between Before and After: both outputs drop the PR-description listing as an acceptance observable while keeping the release script's pull-request-body behavior as a drafted row (f1), both render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` naming the empty retired-parser test directory and the changelog section written into the pull request body (f2), and both ask no cut or scope question and emit no none fallback (f3). Note that f1 was expected to move fails -> holds, but Before's text already satisfies it, so the observed result is holds -> holds. After's additions are harmless to these facts: it explicitly replaces the PR-description sketch with a checkout-level directory check, routes both checks to Tests, and states the discarded proof is not added as an Integration obligation. To keep all three facts stable, keep the wording that says a proof sketch attached to a behavior is repaired rather than promoted to a row or to Integration, that script-generated PR text is a behavior rather than stage proof, and that rewriting a proof never triggers a scope-cut question; After's fenced-and-indented rendering of the section is the only stylistic drift, so if literal section placement matters downstream, say whether the authored section should be emitted as top-level markdown rather than inside a code block.

exit: 0
