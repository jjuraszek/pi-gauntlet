for: ea72013de071d2ee7cfc2cce1463804926990671530edf1d80cffc7f7ed1e78e

## Change

Render one PR's report and menu per turn in the batch summary round: include the first PR with the summary, then collect each pick before presenting the next PR's report and menu instead of asking for all picks at once.

Exercise no-arg-discovery-over-cap, no-arg-discovery-single, no-arg-discovery-zero, no-arg-discovery-cc-multi, no-arg-discovery-failed and no-arg-discovery-under-cap for argument-resolution outcomes; exercise role-line-requested for refreshed pending relationships and report shape.

## Comparison scope

The full-target comparison includes the no-arg-discovery-* samples and role-line-requested targeted by this change, compared against the base commit's skill text. Judgments were refreshed for every sample because the intent text changed. The rebase did not re-stale any replay cell; the skill assembly's for: SHA is unchanged.

## Expected to move

- batch-summary-queue/s8: fails -> holds - Explicitly sequence each PR's report and menu after the previous pick instead of rendering multiple menus or requesting a combined reply.
- no-arg-discovery-over-cap/f1: fails -> holds - Exercise the approved discovery and refreshed-role contract.
- no-arg-discovery-single/f1: fails -> holds - Exercise the approved discovery and refreshed-role contract.
- no-arg-discovery-zero/f1: fails -> holds - Exercise the approved discovery and refreshed-role contract.
- no-arg-discovery-cc-multi/f1: fails -> holds - Exercise the approved discovery and refreshed-role contract.
- no-arg-discovery-failed/f1: fails -> holds - Exercise the approved discovery and refreshed-role contract.
- no-arg-discovery-under-cap/f1: fails -> holds - Exercise the approved discovery and refreshed-role contract.
- role-line-requested/r1: fails -> holds - Exercise the approved discovery and refreshed-role contract.
- role-line-requested/r2: fails -> holds - Exercise the approved discovery and refreshed-role contract.
- role-line-requested/r3: fails -> holds - Exercise the approved discovery and refreshed-role contract.
- role-line-requested/r4: fails -> holds - Exercise the approved discovery and refreshed-role contract.
