bundle-: skills/brainstorming/reference/spec-finalization.md
bundle+: skills/brainstorming/reference/documentation-impact.md
replay: continuation

## Current state
Checklist step 6. The gathered draft has been read. Framing: kept. The documentation-impact guideline has already been read successfully. Round-one architecture is approved; round two is pending. No ticket.

## Gather draft and verified primary code
lib/notify.ts#post owns formatting and retries with a fixed general channel; jobs/report.ts inlines a fetch with the same formatting and retry behavior for a requested channel. jobs/digest.ts calls post(message) and relies on the default. All caller paths were traced. The chosen design extends post(message, channel = "general") and delegates report delivery to it. Docs touched: none; no user guide covers this private helper.

## Acceptance criteria
- post sends to the requested channel when an override is supplied.
- post preserves the general default when the channel argument is omitted.

## Design error clause
Reject an empty channel before sending.

## Test naming convention
Use post_uses_requested_channel, post_keeps_default_channel, and post_rejects_empty_channel for these three observables.

## Recorded conversation
User: Brainstorm report channel overrides without copying notification logic.
Assistant: The framing holds: I checked lib/notify.ts#post and traced jobs/report.ts and jobs/digest.ts, including the default-channel dependency.
User: Keep that framing; an optional argument is fine.
Assistant: I recommend extending post with an optional channel argument (reuse-only); this leaves digest unchanged. Removes: the inline fetch in jobs/report.ts
Adds: one optional parameter on post
Pattern: follows shared notification ownership in lib/notify.ts#post. The alternative requires an explicit channel at every post call, changing digest too; choose it only if explicit channel selection becomes a requirement.
User: Choose the optional argument.
Assistant: Round one: lib/notify.ts#post retains ownership of formatting and retries, accepts channel = "general", and rejects an empty channel before sending. jobs/report.ts delegates delivery to post with its requested channel; jobs/digest.ts retains its existing call and default. Do you approve round one?
User: Approved. Before round two, recap the chosen design commitments, then present round two for approval.
