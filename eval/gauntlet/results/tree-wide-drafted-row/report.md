# eval report: gauntlet (partial run: tree-wide-drafted-row)

for: c4a998790b00da8a2ddb379fc6330df343e3a0f6b3a3fe3e7dc43cad44ebd062

wall: 53s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| tree-wide-drafted-row | anthropic/claude-opus-5-5 | unchanged | 13870 | split: holds -> holds (intended but unchanged); set-wide: holds -> holds (intended but unchanged); missing: holds -> holds (intended but unchanged); partial: holds -> holds (intended but unchanged); unrelated: holds -> holds (intended but unchanged); ticket: holds -> holds (intended but unchanged) |
| tree-wide-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 9378 | split: holds -> holds (intended but unchanged); set-wide: holds -> holds (intended but unchanged); missing: holds -> holds (intended but unchanged); partial: holds -> holds (intended but unchanged); unrelated: holds -> holds (intended but unchanged); ticket: holds -> holds (intended but unchanged) |

## Feedback

- tree-wide-drafted-row / anthropic/claude-opus-5-5: No fact moved on this sample: both outputs satisfy all six facts, so the predicted fails -> holds on missing, partial and unrelated does not show in the text, because Before already stops before any spec write, quotes the row and requests the complete Design enumeration without inventing families. After is more explicit in two places worth keeping: the Partial question names size as the uncovered part, where Before only says the list "does not cover the whole row" and passes more narrowly, and the stop questions repeat the row's own kinds (prose, renderer, size) without proposing family names. The Change's sorting step shows up in After's Ticket branch as an ac-classes sort and an Integration-block refresh; it left the single verbatim row, its in-scope disposition and the human repair route through /skill:shape-ticket intact. To keep that safe, keep the wording that the Tree-wide split applies only to drafted rows and that a ticket row stays one verbatim row. Also keep "I run /skill:shape-ticket" under option D clearly conditional on the human picking the repair and passing its confirm gate, so it cannot be read as the writer splitting the row on its own. In drafted rows, "throughout src/" would match the set-wide phrasing more closely than "anywhere in src/", though both read as the same observable.
- tree-wide-drafted-row / github-copilot/gpt-6.1-sol: No fact moved on this case: both outputs hold all six. After keeps the `Drafted from the design, no ticket rows:` provenance with exactly three (Split) and two (Set-wide) unchecked in-scope family rows and no extra broad row. In Missing, Partial and Unrelated it stops before any spec write, quotes `zero prose, renderer and size findings across the tree`, and asks for the complete enumeration in Design without inventing families or reusing the unrelated set. In Ticket it keeps `Ticket #42, Acceptance criteria, rows verbatim:` with the single exact row in-scope and routes the split through human-authorized `/skill:shape-ticket` before approval. The After wording differs in three ways that do not touch a fact: the stop questions gain a `continue design clarification` option and an `other - name it` option, the Ticket branch drops the lettered disposition question in favour of a plain blocked-approval statement, and the post-repair step now mentions refreshing the Integration block and sorting rows. To keep these facts stable while delivering the Change, keep the stop-question wording explicitly asking for the complete family enumeration in Design (naming size in Partial), keep the drafted outcome quoted verbatim in each stop, and keep the Ticket branch stating that the row is not split locally and that repair goes through `/skill:shape-ticket` before approval.

exit: 0
