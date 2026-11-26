# eval report: gauntlet (partial run: tree-wide-drafted-row)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 51s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| tree-wide-drafted-row | anthropic/claude-opus-5-5 | unchanged | 10223 | split: holds -> holds (intended but unchanged); set-wide: holds -> holds (intended but unchanged); missing: holds -> holds (intended but unchanged); partial: holds -> holds (intended but unchanged); unrelated: holds -> holds (intended but unchanged); ticket: holds -> holds (intended but unchanged) |
| tree-wide-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 6969 | split: holds -> holds (intended but unchanged); set-wide: holds -> holds (intended but unchanged); missing: holds -> holds (intended but unchanged); partial: holds -> holds (intended but unchanged); unrelated: holds -> holds (intended but unchanged); ticket: holds -> holds (intended but unchanged) |

## Feedback

- tree-wide-drafted-row / anthropic/claude-opus-5-5: No fact moved: both outputs satisfy all six, so the three stop facts expected to go from fails to holds already held in Before. The After wording's visible effects are confined to the Ticket branch, where the writer now sorts the row as a criterion via ac-classes.md first and refreshes the Integration-entries block after a repair; neither disturbs the verbatim row, the in-scope disposition, or the /skill:shape-ticket route. The thinnest margin is Partial: both outputs ask for the complete enumeration without naming the uncovered kind outside the quoted row, and After's "whatever covers the kinds the current list leaves out" is only slightly more pointed than Before's "complete list". To make that robust, have the stop question name the uncovered kind from the row's own words (here "size") while still forbidding the writer from proposing a family name for it. Keep the existing wording that the tree-wide split is drafted-only and that a ticket row of that shape stays one verbatim row after sorting, so the new sorting step cannot be read as licence to split or move it.
- tree-wide-drafted-row / github-copilot/gpt-6.1-sol: No fact moved between Before and After: both split the drafted tree-wide and set-wide outcomes into exactly the Design-enumerated family rows under `Drafted from the design, no ticket rows:` with in-scope dispositions, both stop before any spec write on Missing, Partial and Unrelated while quoting the drafted outcome and asking for the complete enumeration in Design without inventing families, and both keep the Ticket #42 row verbatim with in-scope disposition and route splitting through human-authorized `/skill:shape-ticket` before approval. After adds explicit provenance lines, an `other - name it` option and a cancelled-repair return path, none of which disturbs a fact. One thing to watch: After's Ticket branch describes the repair route in prose and no longer renders the cut question with the repair option, where Before showed the full question; the fact still holds because the route and the no-local-split boundary are stated, but if the wording is meant to have the writer answer the human's 'can this be split' question with a rendered choice, keep the explicit question block so the repair route stays an offered option rather than narration. Also keep the instruction that the stop branches quote the drafted outcome verbatim and name the omitted family (size) in the Partial question, since those are what the stop facts key on.

exit: 0
