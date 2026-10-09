for: 4b44256f95b13ca612b04b1d3c0b3a9602707fe0d736c59f3d8b9cfca8cda5c2

## Change
The Wave 1 edit to skills/brainstorming/reference/spec-finalization.md adds a Scope cuts line between the committed-to line and the Council line. Build it from deferred, deviates, and venue acceptance-criteria rows, excluding in-scope and elsewhere rows; render none when no cuts exist.

## Expected to move
- scope-cuts-listed/f1: fails -> holds - The gate includes the new Scope cuts line.
- scope-cuts-listed/f2: fails -> holds - Only deferred and venue rows appear as cuts.
- scope-cuts-listed/f3: fails -> holds - Scope cuts appears before Council and after the commit line.
- scope-cuts-none/f1: fails -> holds - A spec containing only in-scope rows renders Scope cuts: none.
