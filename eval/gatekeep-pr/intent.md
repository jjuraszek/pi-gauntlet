for: 4882b38efa143d6388f8e5febf4fdc1af53e796628f5d4efb64092cd77c34dc4

## Change

Choose obstacle recommendations from available progress rather than a blanket stop default. Recommend deliver for a pending binding check or flaky failure when continuation can make progress. Pin stop before authorship and pending-check defaults when no available non-stop action can change the outcome, including an unchanged failed prerequisite at the cap.

Select only action-row-one for this increment. Its three obstacle cases cover a pending binding check, BLOCKED without bypass, and an unchanged missing workflow approval at the cap. Retain the prior gate-line-first and pr-body-false-claim results as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification. The other action-row-one scenarios remain outside this increment's coverage.

## Expected to move

- action-row-one/pending: fails -> holds - A runnable pending binding check recommends deliver on row 1 instead of the blanket obstacle stop.
- action-row-one/authority: fails -> holds - All obstacle recommendations include a reason above the prompt, without acting on the recommendation.

## Validation boundary

Judge candidate facts absolutely, not only the comparison direction. BLOCKED without bypass and unchanged failed prerequisites must retain stop even for an author viewer. Keep availability, cap accounting, numeric authority and execution mechanics unchanged. No baseline file is removed in this increment.
