bundle-: skills/brainstorming/reference/spec-finalization.md
bundle+: skills/brainstorming/gatherer.md
## Fixed observations
Gather is starting for acme/widgets#81. The resolved tracker CLI supports comment pages of 50 in newest-first order. No live tracker operation is available in this replay. Use these fixed observations when narrating reads, not invented results.

Branch paged: body fetch succeeds. Title: Split report export. Context: The implementation has grown. Problem: Maintaining export behavior is harder than necessary. Idea: Split it while preserving output. Body Acceptance criteria has exactly one row: - [ ] Exported reports retain the visible columns.
There are exactly 52 comments. Page 1 returns the newest 50 ordinary comments, each saying Thanks, with no labeled sections. Page 2 returns exactly two older comments in newest-first order: author Lee at creation time 2 says Thanks again; author Sam at creation time 1 says:
Overlap evidence: The related ticket covers another report.
Reporter note: Move the export implementation to src/export-target.ts; the source has 418 lines.
No other observation names the move target or source size.

Branch multiple: same body, one short page of three comments returned newest first: author Casey at time 3 says 'Reporter note: Keep the implementation in its current file.'; author Robin at time 2 says 'Reporter note: Preserve the public entry point.'; author Sam at time 1 says 'Reporter note: Move the implementation to a separate file.\nOverlap evidence: Another issue concerns formatting.' No author filter is configured.

Branch no-path: overrides exclude this tracker, so no fetch path exists for acme/widgets#81.
Branch comments-failed: body succeeds as above, but the comment fetch errors before page 1: permission denied.
Branch incomplete: body succeeds as above, page 1 returns the 50 ordinary comments, page 2 errors: timeout.
Branch whole-ticket-failed: body and comments cannot be fetched: ticket unavailable.

## Narrated read actions
Label all six branches. Narrate the independent scout and context-builder reads and resulting scout keyword terms, draft AC and note blocks, and later spec/gate behavior. Include the actual draft blocks, not just promises to produce them. Use supplied observations only. These actions are narrated replay evidence, not live CLI integration. Keep the whole response under 1000 words. Omit shared setup, cleanup, reference-read prerequisites, and unrelated recon detail; the session already completed those reads successfully. Show the common fetched AC block once and explicitly reuse it in the body-success branches. Keep scout and context-builder traces distinct but brief.
