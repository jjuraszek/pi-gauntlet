for: f7d5925bcd23a57ae0d67ad5a8f26d250a5efe0aa02e4d212671c16c0b9b64b9

## Change

Bind pre-integration spec reviews to per-task checkouts materialized from the recorded wave base plus the returned patch, rather than the unchanged parent. Bind integrated wave code reviews to staged and unstaged deliverables with HEAD_SHA WORKTREE, including new files and in-place repairs. Preserve committed sequential review ranges, review order, scoped tests, and the wave's commit gate. Snapshot setup failures stop review and retain evidence.

## Expected to move

- patch-review-snapshot/applied-snapshot: fails -> holds - Whole-file reads must see the patch's implemented tree.
- patch-review-snapshot/reviewer-cwd: fails -> holds - The SR dispatch must select that task's materialized checkout.
- patch-review-snapshot/cleanup-after-report: fails -> holds - The snapshot remains available through terminal review output.
- integrated-wave-repair/working-tree-source: fails -> holds - An unchanged HEAD cannot represent an integrated uncommitted wave.
- integrated-wave-repair/fix-only-delta: fails -> holds - Preserve the reviewed index and capture only the repair before staging it.
- integrated-wave-repair/repair-review-root: fails -> holds - A behavior-changing integrated fix is reviewed in its current checkout.
- snapshot-apply-failure/fail-closed: fails -> holds - A failed snapshot is not a reviewable implementation.
- snapshot-apply-failure/evidence-retained: fails -> holds - Retain failed setup evidence rather than falling back to the parent.
