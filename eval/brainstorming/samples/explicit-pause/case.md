bundle-: skills/brainstorming/reference/spec-finalization.md
replay: continuation

## Current state
Checklist step 4. The gathered draft has already been read. Framing: kept. Resetting report filters on a workspace change is not decided. No design approval exists.

## Gather draft and verified primary code
Add a report-view setting through the existing settings path. settings/resolver.ts:12 owns defaults; ui/report-view.ts:30 consumes resolved settings. Existing settings already flow through that resolver; the data path was traced successfully. No ticket.

## Recorded conversation
Assistant: Which settings ownership fits this report view? A) reuse the existing settings resolver B) keep a view-local settings object. Recommendation: A - the existing resolver already supplies the view's settings.
User: A, but pause here. I need to check the reset behavior before we go further.
