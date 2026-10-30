for: d89fe7c03af0185c760c12417c38943f39c424d6252427d19205b801f370f96b

## Change
Replace separate spec and code review personas with one integrated wave review. Review only selected tasks' cited spec ranges, block unmet in-slice requirements, omit later-wave clauses, and reject unreadable anchors with their exact identity. Keep prioritized code findings and spec-observable test economy for anchor-less callers, with Minor-only SHIP. Mirror verdict and severity counts without a behavior-change footer or field. Candidate-only assembly entries have no invented baseline records.

## Expected to move
- with-anchor/authority: fails -> holds - Spec authority catches a true-argument requirement dropped from task prose.
- with-anchor/verdict: fails -> holds - The unmet in-slice clause blocks shipping in the merged verdict.
- partial-wave-ship/clauses: fails -> holds - Later-wave requirements are not clause rows or unmet findings.
- partial-wave-ship/ship: fails -> holds - Complete wave-one work ships despite absent wave-two files.
- unreadable-anchor/reject: fails -> holds - One unreadable anchor rejects the union review.
- unreadable-anchor/identity: fails -> holds - The exact unreadable heading is retained.
- without-anchor/findings-only: fails -> holds - Anchor-less callers receive no clause table.
- without-anchor/ship: fails -> holds - Minor-only test economy findings ship with mirrored counts.
