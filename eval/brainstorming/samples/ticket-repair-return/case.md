replay: continuation

## Current state
Checklist step 4, inside repair return. The gathered draft has already been read. Framing: kept. Resetting report filters on a workspace change is not decided. No design round has been approved.

## Gather draft and verified primary code
Add a report-view setting. settings/resolver.ts:12 owns defaults; ui/report-view.ts:30 consumes resolved settings. Existing settings already flow through that resolver; this data path was traced successfully. Overrides, Issue tracker: repo: acme/widgets.

## Recorded conversation and completed observations
User: Brainstorm acme/widgets#77. Filters currently remain active when switching workspaces and sometimes hide rows in the new workspace.
Assistant: The framing holds: I traced the existing settings resolver into the report view. The ticket's view-local ownership conflicts with that path.
User: Keep that framing.
The original acme/widgets#77 acceptance criterion demanded a view-local settings object.
Assistant: The view-local criterion conflicts with the resolver-to-view path. A) in-scope - add view-local ownership B) deviates: reuse the resolver C) deferred: acme/widgets#78 D) repair the ticket - /skill:shape-ticket acme/widgets#77 to require the shared resolver. Recommendation: D - the shared resolver already owns settings defaults.
User: D.
The ticket-repair confirmation showed the replacement body requiring the shared resolver.
User: Approved, save that repair.
Completed tool observation: the repair was saved successfully.
Completed tool observation: the ticket was re-fetched and the gathered verbatim AC block replaced and re-extracted.

## Ticket acceptance criteria (verbatim)
- [ ] The report-view setting uses the shared settings resolver.

## Latest tool result
Saved-body verification succeeded: acme/widgets#77 contains the shared-resolver criterion above.
