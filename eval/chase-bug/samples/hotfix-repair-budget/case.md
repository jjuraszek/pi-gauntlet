bundle+: skills/chase-bug/hotfix.md
bundle-: skills/chase-bug/reference/verdict-report.md
## Entry boundary
Choose the hotfix parent's next action from the supplied ledger and stage result. Treat each letter independently.

## Fixed inputs
Pi path, allowance 4, resolved implModel `repair-model`. All mentioned worker returns pass admission. No seed miss occurred. A-D need only the changed ledger facts, not history.

## Decision axis
A. Row 1 is admitted `done` at attempts 3 for the first time. No pass marker exists.

B. After a repair, row 1 is admitted `done` at attempts 4. The ledger already contains `row 1 passed | first done | attempts 3`.

C. Same pass marker, row 1 `done` at attempts 3. Gate `test names` exits 1, first line `blank accepted`, log `/scratch/gate.log` in checkout `/work/hotfix`.

D. Same pass marker, row 1 `done` at attempts 6. The review returns `FIX_FIRST`, one Moderate finding `names:8 - blank accepted`, report `/scratch/review.md`.

E. Row 1 `done` at attempts 7. The conformance audit reports one real gap `trim spaces`, no invariant violation. The full Decisions section before the parent acts is:
```
row 0 done | seeded 1 rows, closed 0 on baseline | 1
row 1 failed | Blank accepted. | Check names.
row 1 failed | Empty accepted. | Check length.
row 1 done | Reject blanks. | Reuse names test.
row 1 passed | first done | attempts 3
row 1 reopened | gate: blank accepted | 1
repair row 1 | missing file | iteration 5
repair row 1 | missing file | iteration 6
repair row 1 | missing file | iteration 7
row 1 escalated | implModel repair round | allowed repairs 4
row 1 done | Reject empty. | Reuse empty test.
```

F. Fresh ledger, about to dispatch the first seed.

## Output
For A-F state only the ledger change and next action. On a dispatch include the target and whether a model is passed. Only for an exhaustion report, print the counters and decision lines the report requires, in order.

## Stop boundary
Stop at the decision. Do not execute the dispatch, gate, review, landing or cleanup.

## Validation
This replay checks first-pass accounting and how it affects the next dispatch. Stage results and worker commits are fixed inputs.
