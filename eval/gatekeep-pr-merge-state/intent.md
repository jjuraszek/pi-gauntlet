for: 784637826a9f7e65d33a037bfef84d54766471bcb764783074c410adad94a7f8

## Change

Keep merge preconditions, exact-head CI evidence and fresh viewer-relative bypass eligibility unchanged. Render the ordinary merge row as using your admin override when eligible, explain required checks passed in plain prose, and leave raw merge-state and review-decision fields under show evidence. Keep one merge row and no bypass row. Preserve exact head and run identifiers in the digest for show evidence; no inspection was picked, so the report does not repeat those IDs.

Migrate expectations to row-1 recommendations: pending-only CI recommends deliver, an unchanged prerequisite with no useful non-stop row recommends stop, and readiness recommends merge regardless of authorship. Replace Evidence, PR comments and Not offered fields with plain sentences. Preserve UNKNOWN/check_run/status_context classification and fail-closed eligibility.

Select bypass-eligible-green-ci, bypass-eligible-check-pending, bound-viewer-green-ci and flip-after-update-branch individually. Keep bypass-eligible-blocked's unauthorized results as historical evidence only; do not rerun it. Other migrated expectations have no fresh replay coverage. No bundle lines change.

## Expected to move

- bypass-eligible-green-ci/f1: fails -> holds - The ordinary merge row says using your admin override while every CI precondition remains binding.
- bypass-eligible-green-ci/f3: fails -> holds - Explain eligibility and passed checks without exposing an Evidence line or raw review-decision fields.
- bypass-eligible-green-ci/f4: holds -> holds - Keep the required test's exact-head CI evidence inspectable, without printing its SHA or run ID in report prose.
- bound-viewer-green-ci/f1: holds -> holds - Resolve successful exact-head CI without local verification or raw identifier display.
- flip-after-update-branch/f1: fails -> holds - Recommend deliver for the drafted branch sync with no author decision and render both checkpoints.
- bound-viewer-green-ci/f3: fails -> holds - Recommend stop on row 1 for undispositionable BLOCKED with no useful non-stop row; invent no wait or approve action.
- flip-after-update-branch/f2: fails -> holds - After fresh pushed-head evidence, recommend merge on row 1 regardless of authorship, retaining approve below it.

## Validation boundary

Synthetic true fixtures prove only behavior given that field; live non-admin eligibility remains unverified. These selected samples do not establish target-wide coverage. Preserve earlier reports/results as historical evidence and distinguish them from current sample-scoped runs.
