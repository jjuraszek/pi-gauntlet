bundle-: skills/shape-ticket/reference/repo-audit.md
bundle+: skills/shape-ticket/reference/ticket-wording.md

Select the step-5 pre-roast handoff, NOT replay's default Draft-only response. Tools unavailable: show proposed artifact state and comment, not execution. Draft artifact and source snapshot are the two existing artifacts. Earlier step 4 already demoted this exact sentence into the proposed Reporter note: Keep the old export switch available during the move.

Current draft:
## Context
A support review triggered this request. Today people download reports or receive them by email.
## Problem
- Email recipients receive empty reports, wasting a retry. Example: 0 rows. (Pointer for the implementer: exportRouter, src/export-router.ts.)
- Email recipients receive duplicate messages, making them compare identical attachments. Example: two emails for one request.
The exporter in src/export-router.ts spans 418 lines.
The export job writes the CSV through the mail queue before the row count is known.
## Idea
The reporter proposes moving export delivery.
- Move export routing to the existing dispatcher.
- Retain the email delivery option.
- Remove the obsolete adapter after callers move.
## Acceptance Criteria
- [ ] Given a 12-row report, requesting email delivery produces one email whose first download has 12 rows.

First show the artifact at roast time. Then assume a concrete roast finding removes the exact sentence "The export job writes the CSV through the mail queue before the row count is known." from Problem. Apply the finding and rerun step 5 with no new matches; show the accumulated payload after that rerun. Do not erase earlier demotion. Overlap evidence is also proposed: "Reviewed acme/reports#8; different failure." Show the combined comment.

Independent no-displacement branch: same ticket but without the inventory sentence, the mechanism sentence, the Idea list, earlier demotion, or overlap evidence. Show whether a comment is proposed. Keep a single attributed Idea line, plain-words failure list, examples and deletion-safe pointer. No writes.

Independent split branch: two independent failures have passed split detection: report downloads are empty, and notification receipts arrive twice. Neither issue has demoted Idea material, earlier payload, or overlap evidence; each Idea is already one attributed sketch line. The download failure's Problem also contains this exact inventory sentence: The download handler in src/download-router.ts spans 276 lines. Step 5 moves that sentence into the payload. Show both split issues' approved proposed comments after the confirmation gate: retain the sentence verbatim on the download issue that owns its failure, and propose no comment for the notification issue. Do not execute writes.
