for: be9907dbc46b886ce97f0dd9bc35b98dd39c7584796403712a9e24c9dbc3f5cd

## Change

Keep merge preconditions, exact-head CI evidence and fresh viewer-relative bypass eligibility unchanged. Render the ordinary merge row as using your admin override when eligible, explain required checks passed in plain prose, and leave raw merge-state and review-decision fields under show evidence. Keep one merge row and no bypass row. The replay wrapper requests three unlabeled report parts rather than field labels or raw accounting.

Recommend row 1 from the current assessment: pending-only CI recommends deliver, an unchanged prerequisite with no useful non-stop row recommends stop, and readiness recommends merge regardless of authorship. Preserve UNKNOWN/check_run/status_context classification and fail-closed eligibility. With unreadable eligibility and successful CI, say required checks passed independently of GitHub's block.

## Expected to move

- bypass-eligible-green-ci/f1: fails -> holds - The ordinary merge row names the admin override while CI preconditions remain binding.
- bypass-eligible-green-ci/f3: fails -> holds - Explain eligibility and passed checks without raw field labels.
- bound-viewer-green-ci/f3: fails -> holds - Stop is row 1 for undispositionable BLOCKED with no useful non-stop row.
- flip-after-update-branch/f1: fails -> holds - Deliver is row 1 for drafted sync, rendering both checkpoints.
- flip-after-update-branch/f2: fails -> holds - Fresh pushed-head evidence recommends merge at row 1 regardless of authorship.

## Validation boundary

Run only bound-viewer-green-ci, bypass-eligible-blocked, bypass-eligible-check-pending, bypass-eligible-green-ci, flip-after-update-branch and live-checkrun-pending individually with isolated report writes. This is sample-scoped coverage, not a target-wide pass. No bundle lines change. D8 assembles the frozen baseline with menu slices migrated to menus.md and without the deleted decision-menu.md; that baseline cannot prove the original 11-template flow. Synthetic true fixtures prove only behavior given that field; live non-admin eligibility remains unverified. Preserve saved primary failures and confirmations rather than describing disagreement as an all-facts pass.
