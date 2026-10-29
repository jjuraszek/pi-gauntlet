for: bd53d4314f314c3ba4341de00303426d9a06205147efaf6aeee94920a3a47c81

## Change
Default PR-subject provisioning linearizes the home branch with --no-rebase-merges and replays members in listed order while preserving original local refs and leaving origin member branches untouched. Explicit merge-forward retains member-then-base merges. Rebase conflicts use one scoped helper per stop and orchestrator-only continuation; failures abort and prove restoration against the actual saved pre-attempt home tip, with unresolved and pending outcomes deferred to Task 1. Interrupted recovery validates rework-base and original refs, forces rebase mode and uses cherry to skip landed members; canonical merge-subject recovery retains merge mode. Successful rebase sync persists and reports Rework base. Admission, clean-tree checks, fetched-base constraints, helper scope, and unrelated provisioning behavior remain required; no failure is accepted. The for hash binds the bundle-free candidate assembly, not sample-added references.

Honor explicit primary ROOT and shared BRANCH for keyed leg provisioning; preserve all existing single-member provisioning facts.

## Expected to move
- pr-list-member-conflict-unresolved/residual: fails -> holds - Residual edits require a complete actual-state manual-recovery stop, including both conflict paths and the already-replayed member; compact reports may explicitly reference a complete shared legend but may not omit required fields.
- pr-head-base-rebase/linear: fails -> holds - Default sync explicitly flattens merge-containing heads despite rebase.rebaseMerges configuration.
- pr-list-member-replay/order: fails -> holds - Default sync rebases home before replaying each member rather than creating member merges.
- pr-list-member-conflict-repaired/checks: fails -> holds - Rebase completion belongs to the orchestrator with noninteractive editor and per-stop staging checks.
- pr-list-member-conflict-unresolved/abort: fails -> holds - Member replay abort checks out home before validating the saved rebased tip.
- pr-list-interrupted-recovery/saved-tip: fails -> holds - Failed home sync on recovered rebase history restores the actual pre-attempt local tip, not the original remote head.
