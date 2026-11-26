# eval report: gauntlet (partial run: tree-wide-drafted-row)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 46s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| tree-wide-drafted-row | anthropic/claude-opus-5-5 | unchanged | 12761 | split: holds -> holds (intended but unchanged); set-wide: holds -> holds (intended but unchanged); missing: holds -> holds (intended but unchanged); partial: holds -> holds (intended but unchanged); unrelated: holds -> holds (intended but unchanged); ticket: holds -> holds (intended but unchanged) |
| tree-wide-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 10256 | split: holds -> holds (intended but unchanged); set-wide: holds -> holds (intended but unchanged); missing: holds -> holds (intended but unchanged); partial: holds -> holds (intended but unchanged); unrelated: holds -> holds (intended but unchanged); ticket: holds -> holds (intended but unchanged) |

## Feedback

- tree-wide-drafted-row / anthropic/claude-opus-5-5: No fact moved: both outputs satisfy all six. Both split the drafted rows into exactly the Design families (three for Split, two for Set-wide) under `Drafted from the design, no ticket rows:` with in-scope dispositions, both stop before any spec write on Missing, Partial and Unrelated while quoting the row and asking for the complete enumeration in Design, and both keep Ticket #42's single row verbatim with the split routed through `/skill:shape-ticket` before approval. After is slightly stronger on Partial, because it names the uncovered `size` findings explicitly, where Before only said the list does not cover the whole row. The one risk in After is the new option B on the three stop questions ("you take a scope decision on this outcome instead (keep, deviate or defer it)"). It does not drop an outcome by itself and the recommendation still asks for the enumeration, so the facts hold, but it puts a deferral path beside the enumeration request and a stricter reader could count it as offering to drop the outcome. To keep these facts safe while delivering the Change, state that the tree-wide stop question offers only the complete-enumeration answer plus `other`, and keep the scope-cut options (in-scope/deviates/deferred) for ticket rows; also keep After's habit of naming the uncovered family in the Partial question.
- tree-wide-drafted-row / github-copilot/gpt-6.1-sol: No fact moved between Before and After on this sample. Both outputs split the drafted tree-wide outcome into exactly three unchecked in-scope rows under `Drafted from the design, no ticket rows:`, and both split the set-wide lint outcome into two in-scope rows scoped to src/. In Missing, Partial and Unrelated, both stop before any spec write, quote `zero prose, renderer and size findings across the tree`, and ask for the complete Design enumeration without inventing families. In Ticket, both keep the `Ticket #42, Acceptance criteria, rows verbatim:` row intact and in-scope, and route the split through human ticket repair via /skill:shape-ticket before approval. After's differences are cosmetic: section headings, an added `C) other - name it` option on the stop questions, `anywhere in src/` instead of `throughout src/`, and a note about refreshing Integration blocks and cancellation after repair. None of these changes a fact, but two are worth guarding. The `other - name it` option should not read as licence to proceed without a complete enumeration. The Integration-sorting wording from the Change should stay scoped to ticket rows that actually move, so it never suggests rewriting or re-indexing a single verbatim ticket row. Keeping the explicit statements that drafted rows split only on a complete Design enumeration, and that ticket rows split only through human-authorized repair, will preserve all six facts.

exit: 0
