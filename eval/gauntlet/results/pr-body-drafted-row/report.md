# eval report: gauntlet (partial run: pr-body-drafted-row)

for: ddcbb009f7f1e1c9d3bb8b1185445141ea426e3415665e4d69479a9a0be23470

wall: 25s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-drafted-row | anthropic/claude-opus-5-5 | unchanged | 5049 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| pr-body-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 6426 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-drafted-row / anthropic/claude-opus-5-5: Nothing in After moved a fact relative to Before: both outputs render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (retired parser test directory empty; release script puts the changelog section in the PR body), both demote the PR-description listing of deleted files from row observable to a non-row proof note while keeping the release-script PR-text behavior as a criterion under sorting rule 1, and neither asks a cut or scope question nor falls back to `none`. Note that f1 was expected to move fails -> holds but Before already holds on this sample, so the change shows no observable improvement here. To keep all three facts, retain the wording that a proof sketch attached to a commitment is neither an acceptance row nor an Integration entry, that functionality handling pull-request text remains a criterion, and that rewriting a proof never triggers a cut question; After's row 2 phrasing ('produces a pull request body that contains') is slightly weaker than the Design's 'writes ... into the pull request body', so prefer the Design's verb to avoid drift on f2.
- pr-body-drafted-row / github-copilot/gpt-6.1-sol: No fact moved between Before and After, so the expected f1 fails -> holds improvement does not show here: Before already replaced the PR-description deletion list with a checkout inspection and kept the release-script row as functionality. Both outputs render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:`, ask no cut or scope question, and emit no `none` fallback. The one drift in After is that the first row shortens to "The retired parser's test directory is empty." and drops the "after the obsolete parser test files are removed" clause that Before carried. It still names the committed behavior, since the removal is stated in the surrounding step, but a stricter reader could say the row no longer names the removal itself. To keep f2 safe, the wording should tell the writer to state the Design behavior's action and its observable in the drafted row (for example "obsolete parser test files are removed; the retired parser's test directory is empty") when it swaps out a stage-only proof sketch, rather than reducing the row to the end state alone.

exit: 0
