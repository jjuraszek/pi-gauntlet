bundle-: skills/brainstorming/reference/spec-finalization.md
replay: continuation

## Current state
Checklist step 8, spec writing after approved design. Both design rounds and the approach comparison are approved. Read the full supplied gather draft immediately before replacing it. Produce the spec now, not another design round. Ticket Handling and Spec Self-Review are already read successfully and in session context. All referenced guidelines are available; this replay requests only the spec text, not narrated tool actions or the later self-review/council/gate. Framing kept; no missing dependencies. No predecessor. Docs touched: none. The private export refactor introduces no public contract or user documentation.

## Gather draft
# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing

## Codebase recon
The export behavior already works; split its implementation without changing output. Existing unit tests cover export output. No predecessor. Docs touched: none. Implicit dependencies: none found - traced export callers and tests.

## External context
Ticket acme/widgets#81
Context: The export implementation has grown.
Problem: Maintaining export behavior is harder than necessary.
Idea: Split the existing implementation while preserving output.

## Ticket acceptance criteria (verbatim)
- [ ] Exported reports retain the visible columns.
- [ ] Existing export tests pass.

## Reporter notes (verbatim)
comments: 1 fetched, 1 pages
Reporter note: Move the export implementation to src/export-target.ts; the source has 418 lines. Preserve the existing public entry point.

## Appended during questionary
User approved the split and keeping the public entry point. No scope cuts. All body ACs remain in scope. Both design rounds approved.
