bundle-: skills/shape-ticket/reference/repo-audit.md

Repair mode, step 4, just before sorting the ticket's rows. Gather and the repo audit are complete. No audit findings, source gaps or existing comments. The reporter supplied this ticket:

## Context
Operators use the deploy script to move orders from legacy status to reviewed status.

## Problem
A run can target the wrong environment or rewrite an already reviewed order. Operators also need to coordinate the cutover.

## Idea
The reporter proposes a guarded migration script.

## Acceptance Criteria
- [ ] The deploy script refuses the target `production` without the confirm flag.
- [ ] The operator runs the cutover.
- [ ] The change merges only after the vendor confirms the fix.
- [ ] The staging queue is empty before the deploy.
- [ ] After the cutover, no production order carries the legacy status.
- [ ] After deploy to staging, login succeeds against the real identity provider.
- [ ] The migration script converts legacy status to reviewed status, and the operator runs it on live orders.
- [ ] The script rejects an order with a missing, blank or unknown status.
- [ ] Already reviewed orders remain unchanged.

## Post-deployment housekeeping
- Archive the cutover log.
- Notify the support desk.

Show only the proposed ticket sections from Acceptance Criteria onward and the proposed Reporter note, as they would appear for confirmation. Stop at the draft; do not roast, ask for approval or write to a tracker.
