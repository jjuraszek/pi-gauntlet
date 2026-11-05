anonymized: true
- first-line: mechanical: matches /^gauntlet: done delivered=2,declined=1\r?\n/
- one-marker: mechanical: matches /^(?![\s\S]*gauntlet:[\s\S]*gauntlet:)[\s\S]*$/
- roster-outcomes: mechanical: matches /^acme\/widget#12: delivered\r?\nacme\/widget#15: delivered\r?\nacme\/widget#18: declined$/m
- settled: judged: The message settles the set without a gate, further approval request, claimed write for ticket 18, or treating its decline as a failure.
