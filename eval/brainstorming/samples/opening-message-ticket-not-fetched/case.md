bundle-: skills/brainstorming/reference/amendment-surface.md
bundle-: skills/brainstorming/reference/ticket-acceptance.md
bundle-: skills/brainstorming/reference/spec-finalization.md
bundle+: skills/brainstorming/reference/menu-layout.md
replay: continuation

## Current state
Checklist step 4, before question one. The user's entire request is "brainstorm acme/widgets#77". Produce only the first user-facing message and wait for the user's answer. Do not produce approaches or a draft excerpt.

## Gathered draft and verified recon
The ticket fetch failed: the tracker denied access. Neither the title, body, acceptance rows nor comments were returned. No earlier session message contains the ticket's content, and the user supplied no description beyond the reference. The draft records the failed fetch and its reason; its ticket section is Not fetched.

Repo recon found a download form and a saved column-order setting at exports/form.ts:18 and settings/preferences.ts:32. There is no evidence linking either to the unread ticket. The requested behavior and the part it affects remain unknown. No premise about that request has been verified, and no framing alternative has been found.

The first unresolved question is how to obtain the ticket's content: ask the user to paste its text now or wait until tracker access is restored. Recommend pasting the text because the design needs the request before it can proceed. No other question needs asking in this message.
