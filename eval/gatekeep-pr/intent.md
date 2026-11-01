for: 9994f4049838aed2603888f372bc60a9b235d4e5463fb133a0828575b92de920

## Change
Append the no-commits-since suffix to nonempty same-head prior-review addressed counts, including items resolved by green CI or corrected descriptions without a commit. Exercise the existing empty-delta reviewer dispatch and explicit item closure on both harnesses. Keep the zero-item report form unchanged.

## Expected to move
- prior-review-same-head/s5: fails -> holds - Report the resolved count and same-head suffix above the remaining blocker.
- prior-review-same-head/s6: fails -> holds - Keep the same-head suffix even when all prior items resolve without commits.
