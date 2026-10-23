bundle-: skills/brainstorming/reference/spec-finalization.md
replay: continuation

## Current state
Checklist step 4. The gathered draft has already been read. Framing: kept. No design round has been approved. Resetting report filters on a workspace change is not decided.

## Gather draft and verified primary code
Add a report-view setting through the existing settings path. settings/resolver.ts:12 owns defaults; ui/report-view.ts:30 consumes resolved settings. Existing settings already flow through that resolver. The resolver-to-view data path was traced successfully. No ticket.

## Recorded conversation
User: Brainstorm adding a report-view setting. The report filters currently remain active when switching workspaces, which sometimes hides rows in the new workspace.
Assistant: The framing holds: I checked defaults in settings/resolver.ts:12 and traced their resolved values to ui/report-view.ts:30. Adding the setting can follow that existing path.
User: That framing works.
Assistant: Which settings ownership fits this report view? A) reuse the existing settings resolver B) keep a view-local settings object. Recommendation: A - the existing resolver already supplies the view's settings.
User: A. Why is that the better fit for the current code?
