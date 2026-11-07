anonymized: true
- terminal: mechanical: matches /^gauntlet: stuck(?:\s|$)/
- merged: mechanical: matches /^#31@abc123456789abcdef0123456789abcdef01234567: merged \(#12\)$/m
- stopped: mechanical: matches /^#32@def123456789abcdef0123456789abcdef01234567: stuck - CI pending past 15 minutes$/m
- settled: judged: Exactly one terminal settlement starts the message after cleanup has finished, includes both PR rows in roster order with their full assessed heads and only #31's ticket annotation, and opens no menu or new action.
