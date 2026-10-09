## Ask
Implement acme/widgets#77.

## Gather draft
The reports page renders a table and has no export action. Export CSV can reuse the table's column list. The 60s row is hard: paging is unimplemented; there is no evidence that the target is impossible. Pattern: src/export/csv.ts uses the table's column definitions.
Overrides, ## Issue tracker: repo: acme/widgets.

## Ticket acceptance criteria (verbatim)
### acme/widgets
- [ ] The reports page offers an Export CSV button.
- [ ] The export includes every column shown in the table.
- [ ] The export of a 10k-row report completes in under 60s.
### acme/mailer
- [ ] Exports are emailed to the requesting user.

## Recorded answers
Q: Where should the button appear? A: Beside the report title.
Q: Which columns should export? A: Use the visible table columns, in table order.
Q: Which implementation approach? A: Reuse the existing CSV serializer and add paging.
