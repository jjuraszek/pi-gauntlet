bundle-: skills/shape-ticket/reference/repo-audit.md

Start at step 4 Draft and apply the AC integrity gate. Return the proposed ticket body and any Reporter note as they would appear for confirmation; stop before roast, approval or tracker writes.
## Mode
Repair. The complete ticket body is below. Preserve its target, baseline, and non-blocking housekeeping. Gathering is complete; no links, tracker fields, or comments need preservation.

## Ticket body
## Context
Requesters export reports as CSV from the widgets app. The current p95 export latency is 5s for the representative 100-row report, measured in the recorded request-timing run.

## Problem
Requesters wait 5s at p95 for a 100-row CSV export instead of the required maximum of 2s.

## Idea
The reporter proposes improving CSV export in acme/widgets.

## Acceptance Criteria
- [ ] p95 export latency <= 2s in staging (baseline 5s)

## Post-deployment housekeeping
Non-blocking: monitor export latency after release.

## Measurement clarification
Use the same request-timing method as the baseline: request CSV exports of the representative 100-row report and measure request-to-file-ready latency. The recorded baseline and target are supplied values, not estimates.
