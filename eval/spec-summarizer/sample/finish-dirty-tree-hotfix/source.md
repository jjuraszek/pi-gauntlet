# Finish verification dirty-tree hotfix

**Supersedes:** [doc/specs/2026-09-22-finish-stage-verification-scoping.md](./2026-09-22-finish-stage-verification-scoping.md) - Step 1 skip predicate and its test coverage only.

## Request

"ship a patch as hotfix and release" - the verification-skip hotfix identified in the preceding investigation.

## Problem

The commit-to-HEAD comparison returns success with staged, unstaged, or untracked source changes. The existing "Unsure means run" instruction remains protective, but the command does not establish working-tree freshness.

## Contract

Use [finishing Step 1](../../skills/finishing-a-development-branch/SKILL.md#step-1-verify-tests) as the command owner. Reuse verification only after a pass on a known clean commit in this session with no subsequent non-telemetry writes. Compare that commit to the working tree, and require an empty tracked/untracked status outside the configured telemetry directory. Both checks must succeed. Otherwise rerun verification.

| Case | Required behavior |
|---|---|
| Unchanged tree or telemetry-only changes | Permit reuse when the session preconditions hold. |
| Committed, staged, unstaged, or untracked change outside telemetry | Rerun verification. |
| Staged edit hidden by restoring only the working-tree file | Rerun verification. |
| Unknown verified commit, failed Git check, or uncertain write history | Rerun verification. |
| Custom telemetry directory | Exclude only that directory, not similarly named siblings. |

## Verification

`node --test scripts/finish-verification.test.mjs` executes the skill's actual Git commands in scratch repositories. `npm test` runs those regressions with the full repository gate. Repeat the skill-application scenario with a bash child whose writes are unknown; the decision remains RUN.

## Scope

No runtime extension, configuration, persisted verification marker, or PR-gate behavior changes. The deferred gatekeep-pr before/after comparison remains separate and is not claimed by this hotfix.

## Documentation impact

Update `CHANGELOG.md`; mark the predecessor's skip predicate superseded. Preserve the shipped spec's original body.
