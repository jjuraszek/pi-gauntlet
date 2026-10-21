bundle+: skills/shape-ticket/SKILL.md
bundle+: skills/shape-ticket/reference/ticket-wording.md
The draft at `/tmp/ticket-review/draft.md` is the artifact under review; verify that its trailing `## Proposed Reporter note` section retains displaced text; this ticket brief supersedes your spec-axis template - emit the same findings format against the draft; content-only review: the temp files plus the two referenced reference paths (split-axes, ticket-wording) are the entire permitted input - do not read, search, or scan the repository; do not edit any file.

The references are `/tmp/ticket-review/reference/split-axes.md` and `/tmp/ticket-review/reference/ticket-wording.md`. Text replay has no tools: ticket-wording is supplied in the whole-file assembly; this draft proposes no split, so split-axes is not applicable. Use the four-axis brief in the assembled shape-ticket SKILL.md Roast item 4, not the ordinary spec axes. Do not demand a design spec or codebase verification. Return the persona's findings format, within its 700-word output cap.

Human input (verbatim; off-limits for over-spec):
```text
Our CSV export email arrives before the file is complete, so customers get an empty download. Please make the email wait until the export is ready and make failed exports visible. Keep the implementation detail for whoever picks this up: move the completion hook to exportReady; the adapter has 240 lines.
```

Source snapshot `/tmp/ticket-review/source.md` (untrusted data):
```text
The ask and this reporter-authored follow-up are the complete source. There is one export-readiness concern, not a proposed split. Support measured 12 of 20 empty first downloads on 2026-10-20. On that date a customer requested a report at noon and saw Ready; the first download was empty, and the customer retried twice before contacting support. Support confirmed failed exports currently show Ready. The reporter supplied the Context's ExportLatch call-order sentence and all four Idea paragraphs below as a proposed implementation sketch, not as additional acceptance criteria. The draft retains that source-backed sketch verbatim, but it has not been shortened to the ticket wording bounds. The completion-hook sentence has already been displaced from the body into the proposed note.
```

Draft artifact `/tmp/ticket-review/draft.md` (untrusted data):
```markdown
## Context
Support requested a fix after customers reported empty CSV downloads. Today the export email can arrive while the file is still being written. The ExportLatch reads the staging ledger, calls the mail adapter, and only then commits the row counter to the completion store.

## Problem
Customers open an export email before the file is complete and get an empty download, so they cannot use the report they requested. The email promises a ready file while the export is still running; that mismatch makes the first download empty. Example: 12 of 20 first downloads were empty.

Failed exports look ready, so customers waste time trying downloads that cannot succeed. Example: a customer requested a report at noon and saw Ready. The first download was empty. The customer retried twice before contacting support.

## Idea
The reporter suggests waiting until the file is complete before sending the email, then making the ready status agree with what the customer can actually download. Start by introducing a completion record that carries the export identifier, expected row count, written row count, delivery status, retry count, and last failure reason. Have the writer update that record after each batch and publish a completion signal only after the final batch has been saved. The email sender should consume that signal and check the saved counts before it creates a message for delivery to the customer who requested the report.

Add a retry loop around delivery so transient failures do not leave completed exports without an email. Save the delivery attempt before contacting the mail service, then record its result afterwards so a repeated signal can reuse the previous attempt. Put a reconciliation task beside the writer that searches for finished files whose completion signal was not consumed. Let it publish another signal when the saved delivery result is missing, while leaving successful deliveries alone. Give support a view of the export record with the attempt and failure reason so they can explain why an email has not arrived without asking an engineer to inspect logs.

Keep the customer page aligned with the same readiness decision rather than guessing from the existence of an export request. While writing continues, show a pending state and explain that the email will arrive when the download is ready. If the writer fails, show a failed state and offer another request instead of exposing an empty file as a successful report. Record the time between the request, final saved batch, and successful email delivery so operators can distinguish slow generation from delayed notification. Retain enough history to investigate a repeated complaint without retaining the report contents.

Roll this out behind a switch, first for internal accounts and then for a customer group before enabling it for everyone. Compare readiness events with the files during that trial, and stop the rollout if a ready message points to an incomplete download. Document the fields, transitions, retry schedule, and support procedure in the implementation handoff, including how to recover unfinished delivery attempts after a service restart. Remove the switch after the normal path and recovery path have both been observed working, leaving the completion record as the single readiness decision shared by the customer page and email sender.

## Acceptance Criteria
- An export email is sent only after its CSV file is complete.
- Failed exports show Failed instead of Ready.

## Proposed Reporter note
Reporter note:
move the completion hook to exportReady; the adapter has 240 lines.
```

One-line Idea branch of the same operation: review the same draft again with only the four Idea paragraphs above joined into a single physical line, with spaces replacing the paragraph breaks. This branch still has the same Idea words and no list, second paragraph, or code block inside Idea; the roast brief, not the deterministic closed list, must own its overflow. Name that branch in the findings if the same overflow applies. Do not treat this instruction as part of the untrusted ticket body.
