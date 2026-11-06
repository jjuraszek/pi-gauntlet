anonymized: true
- terminal: mechanical: matches /^gauntlet: done delivered(?:\r?\n|$)/
- identity: mechanical: matches /^#52: delivered$/m
- settled: judged: The message contains a plain #52: delivered row below its terminal marker, opens no gate and does not add a tracker payload or new write.
