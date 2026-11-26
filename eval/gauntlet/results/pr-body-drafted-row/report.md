# eval report: gauntlet (partial run: pr-body-drafted-row)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 7s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-drafted-row | anthropic/claude-opus-5-5 | unchanged | 5975 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| pr-body-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5347 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-drafted-row / anthropic/claude-opus-5-5: No fact moved between Before and After: both render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (retired parser test directory empty; release script writes the changelog section into the PR body), both drop the PR-description listing as a row observable while keeping the release-script PR-text behavior as an acceptance row, and neither asks a cut or scope question or falls back to `none`. Note the expected f1 fails -> holds did not show here because Before already rewrote the stage proof to the directory-empty observable. After's additions (explicit statement that PR body text is neither an acceptance row nor an `## Integration` entry, omitting the empty Integration section, citing sorting rule 1 for the script-produced PR text, and moving the proof to `## Tests`) deliver the Change without cost. To keep these facts stable, retain the wording that a functionality producing pull-request text stays an acceptance criterion because the files deliver it, that a proof sketch attached to a committed outcome is rewritten rather than cut, and that rewriting a proof never triggers a scope question; After's row 1 says `no test files` where Before said `no files`, so if the directory must be literally empty consider keeping the Design's `empty` wording to avoid a weaker observable.
- pr-body-drafted-row / github-copilot/gpt-6.1-sol: No fact moved between Before and After: both outputs drop the PR-description proof as a row, keep the release-script pull-request-body behavior as an acceptance row, render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:`, and ask no cut or scope question with no `none` fallback. Note that f1 was expected to move fails -> holds, but the Before text already holds it (it explicitly omits the PR-description listing as workflow-stage proof and retains the script-generated body), so the After wording shows no observable gain on this sample. After's additions are harmless here: it restates the proof replacement (inspect the retired parser's test directory at the delivered commit), states that the PR-description listing creates no Integration entry, and words the second row closer to the Design commitment verbatim. To keep these facts stable, retain the wording that distinguishes PR text produced by a script (a behavior, kept as a row) from PR text describing the work (stage proof, never a sole observable), and keep the rule that rewriting a proof sketch is not a scope cut and needs no question.

exit: 0
