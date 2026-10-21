bundle+: skills/shape-ticket/reference/ticket-wording.md

Create. Gather complete. Ask: fix report delivery; a customer support review triggered this ask. Today reports can be downloaded or emailed. Source Context also says: the export job writes CSV through the mail queue before the row count is known; deliveryMux calls writeRows then sendMail.

Four independently observed failures, with supplied examples and required outcomes:
- The first emailed download is empty, wasting a retry. A 12-row report downloads as zero rows. Retrying later gives 12 rows. Required: first download contains 12 rows.
- Downloads omit the final row, giving recipients incomplete totals. A four-row report downloads as three rows. The fourth row appears on screen. Required: download contains all four rows.
- Email arrives twice, making recipients check whether reports differ. One delivery request sends two emails. Both contain the same file. Required: one request sends one email.
- The email names yesterday's report, making recipients misfile today's work. An October 21 request produces an October 20 subject. The file itself is October 21. Required: subject names October 21.

The reporter proposes fixing report delivery. Draft a single ticket and the gate report from these observables, not invented measurements. Do not resolve the unrelated failures by splitting in this replay; no independent shipping evidence was supplied.
