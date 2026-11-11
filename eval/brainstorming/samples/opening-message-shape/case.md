bundle-: skills/brainstorming/reference/amendment-surface.md
bundle-: skills/brainstorming/reference/ticket-acceptance.md
bundle-: skills/brainstorming/reference/spec-finalization.md
bundle+: skills/brainstorming/reference/menu-layout.md
replay: continuation

## Current state
Checklist step 4, before question one. The user asks: "Let me choose the column order for a single download without changing my saved order." There is no ticket. Produce only the first user-facing message and wait for the user's answer. Do not produce approaches or a draft excerpt.

## Gathered draft and verified recon
The download uses the saved column order today. Primary code at exports/download.ts:24 reads the saved order and accepts an optional per-download order. The form at exports/form.ts:18 already supports a one-download choice, and settings/preferences.ts:32 saves preferences only through an explicit save action. All callers and the download's dependencies were checked. Each claim holds. The change connects the form's choice to the existing download option without saving it; it adds no second export path. The scout raised no objection, and main-loop recon found no framing concern. The checks and their sources, lookups, and results are already recorded in the draft.

The first unresolved question is where users choose the column order: in the download form or in a separate preview. Recommend the form because it keeps the choice beside the download. No other question needs asking in this message.
