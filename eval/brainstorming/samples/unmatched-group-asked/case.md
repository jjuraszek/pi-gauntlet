## Ask
Implement acme/widgets#77.

## Gather draft
The reports page renders a table and has no export action. The table column definitions and existing CSV serializer support export; paging supports the 10k-row performance target. The heading phase 2 matches no known repo. Pattern: src/export/csv.ts reuses the table's column definitions.
Overrides, ## Issue tracker: repo: acme/widgets.

## Ticket acceptance criteria (verbatim)
### acme/widgets
- [ ] The reports page offers an Export CSV button.
- [ ] The export includes every column shown in the table.
- [ ] The export of a 10k-row report completes in under 60s.
### phase 2
- [ ] Exports are emailed to the requesting user.

## Recorded answers
Q: Where should the button appear? A: Beside the report title.
Q: Which columns should export? A: Use the visible table columns, in table order.
