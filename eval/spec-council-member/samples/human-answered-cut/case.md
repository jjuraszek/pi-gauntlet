Problem statement: Users need to download their widgets as CSV; mailer separately sends the export-ready email. Review scope coverage against the verbatim ticket and any human answers, and review the inlined design. Codebase verification is not requested.

Human input (verbatim; off-limits for over-spec):
```text
Implement the widgets CSV export described in this ticket. Mailer owns the notification.

## Acceptance criteria
### acme/widgets
- Clicking Export downloads a CSV.
- The CSV contains id, name, and status columns in that order.
- An export of 10000 widgets completes within 60s.
- An empty collection exports only the header.
### acme/mailer
- Mailer sends an export-ready email with the download link.

Q: How should "An export of 10000 widgets completes within 60s." be covered?
A) in-scope - deliver the 60s export now
B) deviates: remove the timing bound
C) deferred: acme/widgets#78 - paging ships next sprint
D) repair the ticket - /skill:shape-ticket acme/widgets#77 timing row
Recommendation: A - the row ships in this gauntlet.
A: C) deferred: acme/widgets#78 - paging ships next sprint
```

## Spec

### Goal
Deliver the widgets export with the acceptance dispositions below. The 60s performance row is deferred; this change delivers the other widgets rows.

### Design
Export is a same-origin GET /widgets/export.csv. The collection page has an Export link. The response is UTF-8 CSV with Content-Disposition: attachment; filename="widgets.csv". Read widgets in id order in batches of 1000. Encode id, name, and status with standard CSV quoting; write the header even when no rows exist. The benchmark uses 10000 local widgets and measures from request start to the complete response. Mailer owns delivery of the export-ready email and download link; no mailer changes belong in widgets. The endpoint sits behind the existing session authentication and reads only the signed-in user's widgets through the existing owner-scoped repository; the mailer handoff reuses the existing export-ready event.

## Acceptance criteria
- Clicking Export downloads a CSV. - in-scope
- The CSV contains id, name, and status columns in that order. - in-scope
- An export of 10000 widgets completes within 60s. - deferred: acme/widgets#78
- An empty collection exports only the header. - in-scope
- Mailer sends an export-ready email with the download link. - elsewhere: acme/mailer

## Verification
Request tests check the download headers, column order and CSV escaping, and header-only empty output. A collection-page rendering test checks the Export link. Run the 10000-widget benchmark for the 60s row when in-scope. Mailer verifies its notification in its own repo.
