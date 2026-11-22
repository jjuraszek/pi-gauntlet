bundle+: skills/chase-bug/hotfix.md
bundle-: skills/chase-bug/reference/verdict-report.md
## Entry boundary
Decide the parent's next action after a hotfix `target: 1` return. Each variant starts from its own ledger snapshot.

## Fixed inputs
Allowance 4; pi dispatch with the escalation model available. The seed was admitted on iteration 1. For each snapshot the binding check passes, the checkout is clean, and exactly one new commit changes tracked source. The current return file is missing except in E. No gate or reviewer has run.

## Decision axis
The snapshots show the saved row and its decisions after the seed, oldest first. Letters are independent.

A. Consumed iteration 3:
```
| 1 | failed | 1 | attempt 1: unreadable file |
repair row 1 | unreadable file | iteration 2
```

B. Consumed iteration 4:
```
| 1 | failed | 2 | node --test test/name.mjs; blank name accepted |
repair row 1 | unreadable file | iteration 2
row 1 failed | A blank name still passes. | Check the name before saving.
```

C. Consumed iteration 4:
```
| 1 | failed | 2 | attempt 2: unreadable file |
row 1 failed | A blank name still passes. | Check the name before saving.
repair row 1 | unreadable file | iteration 3
```

D. Consumed iteration 5:
```
| 1 | failed | 3 | attempt 3: unreadable file |
row 1 failed | A blank name still passes. | Check the name before saving.
row 1 failed | Spaces still pass. | Check the trimmed name.
repair row 1 | unreadable file | iteration 4
row 1 escalated | implModel round | allowed attempts 4
```

E. Start from A's snapshot. The readable file matches the pending tuple and iteration 3; it returns row 1 failed at attempts 2 with selective failing evidence and the matching decision `row 1 failed | A blank name still passes. | Check the name before saving.` All admission checks pass.

## Output
For A-E give only changed ledger facts and the next action. For a dispatch include target, previous decision and hint; for a stop name the stopping condition. Do not reproduce the ledger.

## Stop boundary
Stop after selecting the next action. Do not execute it, simulate a repair, run a gate or land.

## Validation
The replay checks how the parent reads row outcomes in order and selects a retry or budget stop. No worker runs.
