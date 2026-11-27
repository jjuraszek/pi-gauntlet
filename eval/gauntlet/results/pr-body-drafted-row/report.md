# eval report: gauntlet (partial run: pr-body-drafted-row)

for: 26d1c1f3e56ec9aa53ab90ddeed921b06ff3c19296da7ff12b5341e3cd1f9b91

wall: 27s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-drafted-row | anthropic/claude-opus-5-5 | unchanged | 5733 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| pr-body-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5209 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-drafted-row / anthropic/claude-opus-5-5: No fact moved between Before and After: both outputs draft exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (the retired parser's test directory is empty; the release script writes the changelog section into the pull request body), both move the PR-description proof sketch out of the acceptance rows and re-prove the directory outcome with a checkout listing, both keep the release-script PR-body behavior as a criterion under sorting rule 1, and neither asks a cut or scope question or falls back to `none`. Note that f1 was expected to move fails -> holds but Before already holds on its text, so the After wording shows no observable gain on this case. To keep all three facts stable while delivering the Change, retain the explicit wording that a proof sketch naming pull-request text is neither an acceptance row nor an Integration entry, that the outcome is preserved while only its proof changes (so no cut question), and that functionality producing PR text via delivered files stays a criterion; After's row for behavior 2 dropped 'with a changelog' and says 'places' rather than 'writes', which still satisfies f2 but drifts from the Design phrasing - keeping the committed behavior's own verbs would make the row harder to misjudge.
- pr-body-drafted-row / github-copilot/gpt-6.1-sol: Neither output moved a fact: both render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` (retired parser test directory empty after removing obsolete tests; release script writes the changelog section into the pull request body), both replace the PR-description proof sketch with checkout inspection of the directory rather than making deleted-file listing an acceptance observable, and both explicitly state no clarification or scope-cut question is needed with no `none` fallback. Note that f1 was expected to go fails -> holds, but Before already holds on its text, so the observed result is unchanged rather than improved. After's first row reorders the wording to lead with the removal ('files are removed, leaving the ... directory empty'), which still names the empty-directory observable; to keep this robust, keep the wording that anchors the row on the directory-empty state, keeps the PR-description listing out of rows as stage proof only, and retains the script-generated PR body text as a delivered behavior, while leaving the ticketless drafted-row path free of ownership or cut questions as the Change intends.

exit: 0
