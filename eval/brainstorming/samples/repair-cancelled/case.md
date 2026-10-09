## Ask
Implement acme/widgets#77.

## Gather draft
The reports page renders a table and has no export action. src/export/csv.ts:40 shows the table's columns are title and status, with no owner column. The ticket's owner-column row contradicts the table contract. Pattern: src/export/csv.ts reuses the table's column definitions.
Overrides, ## Issue tracker: repo: acme/widgets.

## Ticket acceptance criteria (verbatim)
- [ ] The reports page offers an Export CSV button.
- [ ] The export includes the owner column.
- [ ] The export of a 10k-row report completes in under 60s.

## Recorded answers
Q: Where should the button appear? A: Beside the report title.
Q: For the owner-column row, A) in-scope - add owner B) deviates: omit owner C) deferred: acme/widgets#78 D) repair the ticket - /skill:shape-ticket acme/widgets#77, because src/export/csv.ts:40 has no owner column? A: D.
Repair outcome: cancelled at the shape-ticket gate. The ticket row remains unchanged.

## Fixture files
### src/export/csv.ts
```text
40: const tableColumns = ["title", "status"];
```
