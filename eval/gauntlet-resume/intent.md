for: 744c342bd45985d3b8442ec1ee0394cfe41af4b3959fa4369f7b475ebb1af16b

## Change

Accept only current-format briefs and ledgers through the single gauntlet-resume entry point. Load loop restoration, plan restoration and plan repair from their owning references, and load coordinated rules only for multi-leg briefs. Preserve the continuation skill, phase, exact task snapshot and fresh-gate boundary for current-format brainstorm, plan, implement, verify and ship briefs. Recover current ledger returns from ledger-held attribution before tracker refresh without counting a consumed attempt twice; preserve mixed verification/conformance tasks and plan baseline upgrades. Stop old ledgers at admission with the unsupported-format sentence and recovery pointer, without conversion or tracker mutation. Selected text replays compare supplied observations against 09c9f4e1; they do not prove live reads or tracker execution. Coverage is sample-scoped, not a target-wide pass.

## Expected to move

- old-ledger-stops/missing-returned: fails -> holds - Refuse a ledger without returned: instead of converting it.
- old-ledger-stops/cap-first: fails -> holds - Refuse cap: before missing-header checks instead of migrating it.
- old-ledger-stops/no-mutation: fails -> holds - Stop unsupported ledgers before confirmation, tracker calls or conversion writes.
