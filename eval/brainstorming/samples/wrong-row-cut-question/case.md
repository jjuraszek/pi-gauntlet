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
Q: Which implementation approach? A: Reuse the existing CSV serializer and paging.

## Fixture files
### src/export/csv.ts
```text
40: const tableColumns = ["title", "status"];
```
