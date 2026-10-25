for: 0de7eaf96944a4cae56efa6b11f6c34cc7764447ed6d38fefc4de49c477b4a3a

## Change
Render every drafted acceptance row and disposition verbatim under Drafted acceptance criteria (approval ratifies): after Scope cuts: and before Council:, with five options. Ticket-row gates omit this block. The paired sample preserves verbatim briefing and audit counts and narrates reply-1 continuation; text replay proves supplied-observation rendering, not live gate execution.

The Wave 1 edit to skills/brainstorming/reference/spec-finalization.md adds a Scope cuts line between the committed-to line and the Council line. Build it from deferred, deviates, and venue acceptance-criteria rows, excluding in-scope and elsewhere rows; render none when no cuts exist.

## Expected to move
- scope-cuts-listed/f1: fails -> holds - The gate includes the new Scope cuts line.
- scope-cuts-listed/f2: fails -> holds - Only deferred and venue rows appear as cuts.
- scope-cuts-listed/f3: fails -> holds - Scope cuts appears before Council and after the commit line.
- scope-cuts-none/f1: fails -> holds - A spec containing only in-scope rows renders Scope cuts: none.
- drafted-rows-block/drafted: fails -> holds - Preserve the drafted-row provenance and approval contract while retaining ticket and not-fetched behavior.
- drafted-rows-block/ticket: fails -> holds - Preserve the drafted-row provenance and approval contract while retaining ticket and not-fetched behavior.
- drafted-rows-block/menu: fails -> holds - Preserve the drafted-row provenance and approval contract while retaining ticket and not-fetched behavior.
- drafted-rows-block/briefing: fails -> holds - Preserve the drafted-row provenance and approval contract while retaining ticket and not-fetched behavior.
