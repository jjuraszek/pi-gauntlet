for: 37ebc5026080ed6a54d74babab22ee4ac95dea786c0311dcad6cedbef299be5c

## Change

Omit council row 3 and the Council counts line whenever no audit exists, on both the worker path and an aborted council path. Apply that omission independently of zero-row and PR-subject withholding without renumbering the remaining choices. A reply naming the hidden council row asks for a rendered choice without printing an audit or approving implementation.

Extend worker-path with zero-worker, pr-worker, zero-pr-worker, and aborted-audit cases plus hidden-row replies. Run only spec-gate/worker-path against base 855e872a42f9cac7a795704f3e0b383b182950ab. This text replay checks narrated gates and actions, not live git operations. Preserve all other sample records; coverage is partial. Keep the deterministic contract beside its scripts/brainstorming-*.test.mjs siblings; paid replay remains outside CI.

## Expected to move
- worker-path/f3: fails -> holds - The worker gate keeps four-row numbering with only rows 1, 2, and 4 rendered.
- worker-path/combined: fails -> holds - Worker, zero-row, and PR-subject omissions compose without restoring hidden rows or their flags.
- worker-path/aborted: fails -> holds - An aborted council with no audit omits row 3 just like the worker path.
- worker-path/hidden: fails -> holds - A withheld council digit clarifies the remaining choices without mutation or approval.
