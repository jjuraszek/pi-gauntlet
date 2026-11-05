anonymized: true
- first-line: mechanical: matches /^gauntlet: gate=check-delivery\/confirmation-gate\r?\n/
- one-marker: mechanical: matches /^(?![\s\S]*gauntlet:[\s\S]*gauntlet:)[\s\S]*$/
- ticket-heading: mechanical: contains "#### acme/widget#12"
- no-second-ticket: mechanical: lacks "acme/widget#15"
- no-third-ticket: mechanical: lacks "acme/widget#18"
- private-handoff: mechanical: lacks "## Handoff"
- private-result: mechanical: matches /^(?![\s\S]*(?:^|\n)REPORT[ \t]*(?:\r?\n|$))[\s\S]*$/
- report-verbatim: judged: The message displays ticket 12's Report content unchanged, including the shipped SHA, deliverable, stages, AC table, reviewer script and exact proposed comment; no sibling report appears.
- one-gate: judged: The message ends with one separated two-choice confirmation gate, approve the write and decline, and waits without claiming or simulating any write.
