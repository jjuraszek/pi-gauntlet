bundle-: skills/loop-implementation/reference/coordinated-legs.md
# Input

Replay these independent supplied observations without tools; describe actions, never pretend they ran. Render each requested human stop as its own message, not just a description of a menu. Entry, admission and phase checks have already passed. E and F have recoverable pre-dispatch ledger snapshots but no jobs file or write-provenance records; their reset and repair commands succeed. Held escalateAfter3 applies; B, E and F already have a spent row 2 escalation marker. The spec uses approval option 4 and the ledger is seeded. Row texts: row 1 baseline, row 2 parser, row 3 serializer, row 4 deferred integration. Header iterations: 90, allowance: 7. Rows: 1 done attempts 0; 2 failed attempts 5 evidence `parser check; expected 2 got 1`; 3 open attempts 2 evidence `serializer check; missing fixture`; 4 cut attempts 0. Decisions in order:

```text
row 2 retry | narrow parser | allowed attempts 5
row 2 retry | fixture repair | allowed attempts 99
rows +3 | shared raise already reflected in allowance 7
row 3 retry | add fixture | allowed attempts 8
row 2 failed | parser mismatch | inspect parser
```

A. Allowance stop: change only row 2 attempts to 9, clean tree. Render the row stop and all unresolved row counts.
B. Stagnation below allowance: use the original rows. The last two child row commits changed only the ledger and no row status. Show the next dispatch instead of a human stop.
C. Missing-model stop: use original rows except row 2 attempts 8, clean tree with no stagnation. Row 2 has no escalation marker and escalationLoop.implModel resolves undefined with no main model. Render the stop without dispatch.
D. Dirty-tree stop: use original rows with no pending tuple, but an unrelated tracked edit in src/parser.ts blocks dispatch before any bump. Render the authorization ask; do not write, reset, clean or dispatch.
E. Interrupted two-commit return: the saved original rows preceded a dispatch of row 2; consumed iterations 91 and pending: 2 | home | aaaaaaa survive. The child claimed done attempts 6 in two clean commits. Describe recovery and the next ordered action, not a human stop or admission of the child result.
F. Interrupted dispatch: same saved rows and consumed count/tuple as E, but no child commit and an uncommitted src/parser.ts edit. Describe recovery and the next ordered action without seeking discard authorization.
G. Exit verification: independently change rows 2 and 3 to done, preserve attempts, and remove pending. Implement is complete, verify active. Seven verification failures received seven repairs and the last rerun still failed `verification check; expected 2 got 1`. Seven loop: repair verification markers are durable. Render the terminal stop.

Keep historical decisions and all four table columns unchanged. After the messages briefly name the durable source of retry increments and whether any stop itself writes a new column or changes attempts.
