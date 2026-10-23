bundle-: skills/shape-ticket/reference/repo-audit.md
bundle+: skills/shape-ticket/reference/ticket-wording.md

Select repair through the confirmation gate, NOT replay's default Draft-only response. Show the complete old -> new body diff and proposed comment; do not write. Keep the entire reply under 1400 words by showing only the unified body diff (not a second copy of the replacement body) and concise gate/branch reports; never shorten the verbatim payload or AC rows. Metadata clean. Existing immutable comment: "Reporter note: Preserve the recorded retry reproduction." Never edit that comment.

Reporter-authored comment: "CSV export is the feature I use." No reporter text uses deliveryMux.

Existing body (Idea is exactly 300 words):
## Context
A support review triggered this request. Today CSV export (a comma-separated file of report rows) sends reports by email.
## Problem
Recipients receive empty reports and must retry. Example: a 12-row report downloads as zero rows. deliveryMux (the outbound-delivery dispatcher) sends reports. The exporter in src/export-router.ts spans 418 lines.
## Idea
Keep export delivery available while moving routing into the existing dispatcher and retain email delivery until callers have moved then remove the obsolete adapter after checking the recorded sample reports. Keep export delivery available while moving routing into the existing dispatcher and retain email delivery until callers have moved then remove the obsolete adapter after checking the recorded sample reports. Keep export delivery available while moving routing into the existing dispatcher and retain email delivery until callers have moved then remove the obsolete adapter after checking the recorded sample reports. Keep export delivery available while moving routing into the existing dispatcher and retain email delivery until callers have moved then remove the obsolete adapter after checking the recorded sample reports. Keep export delivery available while moving routing into the existing dispatcher and retain email delivery until callers have moved then remove the obsolete adapter after checking the recorded sample reports. Keep export delivery available while moving routing into the existing dispatcher and retain email delivery until callers have moved then remove the obsolete adapter after checking the recorded sample reports. Keep export delivery available while moving routing into the existing dispatcher and retain email delivery until callers have moved then remove the obsolete adapter after checking the recorded sample reports. Keep export delivery available while moving routing into the existing dispatcher and retain email delivery until callers have moved then remove the obsolete adapter after checking the recorded sample reports. Keep export delivery available while moving routing into the existing dispatcher and retain email delivery until callers have moved then remove the obsolete adapter after checking the recorded sample reports. Keep export delivery available while moving routing into the existing dispatcher and retain email delivery until callers have moved then remove the obsolete adapter after checking the recorded sample reports.
## Acceptance Criteria
- [x] Given a 12-row report, requesting email delivery produces a first download with 12 rows.
2. Given one delivery request, sending the report produces one email.

The body above ends after the numbered AC row. Source evidence supports both observables. No other required behavior or measurement. Show why the Idea, requester-used term definition and implementer inventory each rule out no-op. Retain a definition of deliveryMux if the term remains: its only source is body prose. Require raw AC byte comparison before presenting the gate, not a normalizing rewrite.

Independent invalid-criterion branch: replace the first AC row with "- [x] Export becomes faster." No baseline, target or measurement is available after clarification. Report the integrity outcome; do not silently pass by preserving bytes. No write has been approved.
