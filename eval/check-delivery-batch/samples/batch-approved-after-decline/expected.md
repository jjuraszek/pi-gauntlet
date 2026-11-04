anonymized: true
- first-line: mechanical: matches /^gauntlet: gate=check-delivery\/confirmation-gate\r?\n/
- one-marker: mechanical: matches /^(?![\s\S]*gauntlet:[\s\S]*gauntlet:)[\s\S]*$/
- delivered-outcome: mechanical: matches /^acme\/widget#15: delivered$/m
- outcome-before-next: mechanical: matches /acme\/widget#15: delivered[\s\S]*#### acme\/widget#18/
- private-handoff: mechanical: lacks "## Handoff"
- report-verbatim: judged: The message displays ticket 18's Report unchanged, including its AC table, reviewer script and exact proposed comment, after ticket 15's delivered outcome.
- independent-approval: judged: Ticket 15 is delivered despite ticket 12's earlier decline; ticket 18 alone gets an approve-the-write and decline gate, with no claimed write or approval for ticket 18 and no set settlement yet.
- exact-halves: judged: The message does not claim a status advance or body edit for ticket 15, or a write for ticket 12, and does not ask to approve ticket 15 again.
