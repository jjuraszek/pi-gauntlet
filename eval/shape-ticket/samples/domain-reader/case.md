bundle-: skills/shape-ticket/reference/repo-audit.md
bundle+: skills/shape-ticket/reference/ticket-wording.md

Create mode; gathering complete. Requester asks: "Fix CSV export email delivery: the first download is empty." Gathered source: deliveryMux is the outbound-delivery dispatcher. The export email arrives before the file is complete, so the first download is empty. Recorded example: a 12-row report downloads as zero rows. Required outcome: requesting email delivery for that report produces a first download containing all 12 rows. Draft a body and gate report.

Also report two independent repair decisions, not extra create-ticket requirements. Branch A: a reporter-authored comment says "CSV export and deliveryMux are the features I use"; the existing body defines both terms. Branch B: the body alone says "deliveryMux (the outbound-delivery dispatcher)" with no reporter attribution or quoted ask using deliveryMux. Explain whether those definitions conform; retain a definition if needed in B. In A deliveryMux is both a requester-used feature and an internal name. No tracker writes.
