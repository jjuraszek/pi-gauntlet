bundle-: skills/loop-implementation/reference/coordinated-legs.md
# Input

Replay these independent supplied observations without tools. Render each requested human stop as its own message, not just a description of a menu. Entry, admission and phase checks have already passed; no recovery write is authorized. The spec uses approval option 4 and the ledger is seeded. Row texts: row 1 baseline, row 2 parser, row 3 serializer, row 4 deferred integration. Header iterations: 90, allowance: 7. Rows: 1 done attempts 0; 2 failed attempts 5 evidence `parser check; expected 2 got 1`; 3 open attempts 2 evidence `serializer check; missing fixture`; 4 cut attempts 0. Decisions in order:

```text
row 2 retry | narrow parser | allowed attempts 5
row 2 retry | fixture repair | allowed attempts 99
rows +3 | shared raise already reflected in allowance 7
row 3 retry | add fixture | allowed attempts 8
row 2 failed | parser mismatch | inspect parser
```

A. Allowance stop: change only row 2 attempts to 9, clean tree. Render the row stop and all unresolved row counts.
B. Stagnation stop: use the original rows. The last two child row commits changed only the ledger and no row status. Render the stop.
C. Missing-model stop: use original rows except row 2 attempts 8, clean tree with no stagnation. Row 2 has no escalation marker and escalationLoop.implModel resolves undefined with no main model. Render the stop without dispatch.
D. Dirty-tree stop: use original rows, but an unrelated tracked edit blocks dispatch before any bump. Render the authorization ask; do not write or dispatch.
E. Commit-boundary stop: the saved original rows preceded a dispatch of row 2; consumed iterations 91 and pending: 2 | home | aaaaaaa survive. The child claimed done attempts 6 in two clean commits. The parent has restored the pre-dispatch target cells and tuple and refreshed. Render the stop, not the unadmitted child result.
F. Interrupted dispatch: same saved rows and consumed count/tuple as E, but no child commit and an uncommitted code edit. Recovery has identified the interruption and awaits discard authorization with the restored target cells. Render that stop without granting attempts or clearing pending.
G. Exit verification: independently change rows 2 and 3 to done, preserve attempts, and remove pending. Implement is complete, verify active. The first verification failure already received its one repair and the rerun still failed `verification check; expected 2 got 1`. The loop: repair verification marker is durable. Render the terminal stop.

Keep historical decisions and all four table columns unchanged. After the messages briefly name the durable source of retry increments and whether any stop itself writes a new column or changes attempts.
