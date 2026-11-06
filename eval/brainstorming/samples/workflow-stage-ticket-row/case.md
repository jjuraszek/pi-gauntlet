bundle+: skills/shape-ticket/SKILL.md
bundle-: skills/brainstorming/reference/spec-finalization.md
replay: continuation

## Current state
Checklist step 4, immediately after reading the gather draft and Ticket Handling. No question has been asked. Framing check: kept, no concern. All references are available. No tools are available; render the requested conversation messages from these fixed observations, not live reads or tracker writes.

## Ask
Implement acme/widgets#77.

## Gather draft
The importer currently accepts rows without an id and returns a generic error for malformed rows. The approved direction is to reject missing ids and name the offending row. The existing complexity check has a limit of 20; extending make ci to reject a function of complexity 21 is itself a requested product change. There is no code or contract contradiction for any ticket row. Pattern: extend src/importer.ts validation and scripts/complexity.mjs's existing check. Overrides, ## Issue tracker: repo: acme/widgets.

## Ticket acceptance criteria (verbatim)
- [ ] GitHub CI is green on the head of the pull request
- [ ] The importer rejects a row without an id and CI is green on the PR head
- [ ] make ci rejects a function of complexity 21
- [ ] The importer names the offending row in its error

## Reporter notes (verbatim)
comments: 1 fetched, 1 pages
Reporter note:
retired workflow-stage proof: CI is green on the PR head
retired workflow-stage proof: The importer rejects a row without an id and make ci passes
Preserve the public importRows entry point.

## Requested continuation
Render the first assistant message. Then render successive ordinary questions, taking A (keep in-scope) as the recorded answer to any disposition question and using the existing importer error format for any implementation-detail question, until the approach comparison is reached. Keep separate messages labeled in order; do not combine questions into one user turn. Finish with the implied Design requirements from the Reporter note. Do not render a spec or the later approval gate.
