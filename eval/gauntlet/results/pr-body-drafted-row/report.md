# eval report: gauntlet (partial run: pr-body-drafted-row)

for: 3191f38ab378b94b1d2b9a3ae80c903ca709ebdda14ab2e3f63e6706a8d8f696

wall: 28s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-drafted-row | anthropic/claude-opus-5-5 | unchanged | 6959 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| pr-body-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 4343 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-drafted-row / anthropic/claude-opus-5-5: No fact moved: After, like Before, drafts exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:`, keeps the release-script PR-body behavior as a criterion, leaves the PR-description listing out of the rows as proof only, and asks no cut or scope question with no none fallback. The one drift to watch is row 1, where After says the directory "contains no test files" while Before said "contains no files"; the Design commitment is that the directory is empty, so the narrower phrasing could be read as a weaker observable and put f2 at risk. Wording that tells the writer to state the drafted row's observable in the Design's own terms (directory is empty) would keep f2 safe, and keeping the explicit statement that a proof sketch is neither an acceptance row nor an Integration entry, and that rewriting a proof needs no scope question, protects f1 and f3 while still delivering the Integration-sorting change.
- pr-body-drafted-row / github-copilot/gpt-6.1-sol: Both outputs satisfy all three facts: each writes exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (empty retired-parser test directory; release script writes the changelog section into the pull request body), each replaces the PR-description proof sketch with a checkout inspection rather than making it a row's observable, and neither asks a cut or scope question or falls back to `none`. Nothing in After moved a fact; f1 was expected to go fails -> holds but Before already holds on this sample, so the wording change shows no observable difference here. After adds the explicit statements that the release script's PR text is functionality rather than an external pipeline result and that the discarded proof sketch creates no Integration entry; keep those, since they make the f1 reasoning explicit without disturbing the two drafted rows or prompting a question.

exit: 0
