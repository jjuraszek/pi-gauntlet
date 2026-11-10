for: 99a9d6055d02cdfd5b91b7bfefc20850b38d6bc2f440e61189c5fcf507d5e382

## Change

Recommend merge on the final menu whenever it is available, on either author's PR and through either the ordinary or eligible admin-override path. Recommend approve only when merge is unavailable and approval is available. Keep availability and numeric-pick authority unchanged.

Select only final-row-one for this increment. Its four states cover own-PR merge, another author's merge with approve available, eligible bypass merge with approve available, and approval without merge permission. Retain gate-line-first, pr-body-false-claim and action-row-one results as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification.

## Expected to move

- final-row-one/other: fails -> holds - Another author's ready PR recommends merge instead of approve when both are available.
- final-row-one/bypass: fails -> holds - An eligible bypass merge outranks approve on another author's ready PR.
- final-row-one/authority: fails -> holds - Each final recommendation has a state-based reason above the prompt and waits for the numeric pick.

## Validation boundary

Judge candidate facts absolutely, not only the comparison direction. Own-PR merge and approval without merge permission must remain available and recommended. Preserve bypass eligibility, admin execution mechanics and omission reasons. No baseline file is removed in this increment.
