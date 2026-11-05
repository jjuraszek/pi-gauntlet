anonymized: true
- first-line: mechanical: matches /^gauntlet: question\r?\n/
- one-marker: mechanical: matches /^(?![\s\S]*gauntlet:[\s\S]*gauntlet:)[\s\S]*$/
- ticket-heading: mechanical: contains "#### acme/widget#12"
- reading-prompt: mechanical: contains "Type the AC reading to apply, or skip"
- wait-for-reading: judged: The message asks for the operator's reading in a separate question turn, without inventing a reading, claiming a retry, showing either ticket's gate, offering a numeric menu, or claiming a write.
