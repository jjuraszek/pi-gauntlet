anonymized: true
- first-line: mechanical: matches /^gauntlet: gate=check-delivery\/confirmation-gate\r?\n/
- one-marker: mechanical: matches /^(?![\s\S]*gauntlet:[\s\S]*gauntlet:)[\s\S]*$/
- decline-outcome: mechanical: matches /^acme\/widget#12: declined$/m
- ticket-heading: mechanical: contains "#### acme/widget#15"
- no-third-ticket: mechanical: lacks "acme/widget#18"
- private-handoff: mechanical: lacks "## Handoff"
- report-verbatim: judged: The message displays ticket 15's Report unchanged, including its AC table, reviewer script, and exact proposed comment, after ticket 12's plain declined outcome.
- approval-isolated: judged: The message offers only ticket 15's approve-the-write and decline gate, waits for that decision, and claims no write for either ticket; declining ticket 12 neither cancels nor approves ticket 15.
