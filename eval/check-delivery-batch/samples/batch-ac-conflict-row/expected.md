anonymized: true
- first-line: mechanical: matches /^gauntlet: gate=check-delivery\/set-recovery\r?\n/
- one-marker: mechanical: matches /^(?![\s\S]*gauntlet:[\s\S]*gauntlet:)[\s\S]*$/
- ticket-heading: mechanical: contains "#### acme/widget#12"
- no-sibling: mechanical: lacks "acme/widget#15"
- private-handoff: mechanical: lacks "## Handoff"
- conflict-rows: judged: The message shows STOPPED - AC conflict and quotes both conflicting rows, Export preserves twelve rows. and Export only the first ten rows.
- retry-skip: judged: The only menu is 1. retry and 2. skip; there is no confirmation gate, request for an AC reading, automatic retry, or claimed tracker write.
