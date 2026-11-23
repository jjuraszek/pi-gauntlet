# Loop implementation eval

Exercise main-session driver decisions and the actual loop-implementer dispatch contract with synthetic state snapshots. Loads the driver and persona in full.

## Ledger repair-count boundary

`ledger-repair-counts` selects only the seed/verification budget decision from supplied ledger snapshots: seed exhaustion at 3 of 3, two verification decisions plus a pending reservation, and three settled decisions without pending. Model calls check the interpretation and stop output because the driver expresses counting as instructions, not an executable counter. The sample stops before recovery, dispatch or gate execution; it replaces no production logic with a test-only counter. The longer `seed-interrupted-count` and `verify-repair-count` process traces are not selected for this boundary.

Run `timeout -k 30 120 node --test scripts/loop-repair-counts.test.mjs` to check instruction wiring and replay currency against saved model judgments. This is instruction/model coverage, not executable driver or end-to-end proof. Tests sit beside the other loop contract checks in `scripts/`; model calls stay outside CI.

## Dirty-tree stop coverage

| Sample | Must hold |
|---|---|
| `gate-line-first` | Restored-ledger stop preserves counts and starts with the question marker; independent pre-ledger fresh entry offers discard-or-Stop only, then typed discard resets and cleans before Entry step 4's ledger write and step 5, never the ordered table. |
| `human-stop-counts` | Unrelated dirt stops without writes; pending two-commit and empty returns recover and continue below allowance. |
| `row-budget-actions` | Budget replies cannot authorize discard; typed discard resumes fresh seed admission or the implement/verify restore sequence. |

These fixtures describe driver actions, not live reset or dispatch execution. Selected sample evidence covers the 17 rewritten and migrated samples (`interrupted-child-redispatch`, `seed-interrupted-count`, `companion-interrupted-recovery`, `verify-repair-count`, `unreachable-cut`, `allowance-10-escalate-after`, `commit-boundary`, `exit-repair-capability`, `exit-verification-escalates`, `human-stop-counts`, `multi-row-return`, `row-budget-actions`, `seed-retry`, `spent-row-escalation`, `tracker-boundary`, `legacy-cap`, `gate-line-first`); partial coverage applies to unrun samples in this target.

## Coordinated-flow coverage

Cover coordinated-flow membership, recorded per-leg contracts, checkout-local rules and dispatch, home-bound handoff/admission, receipt-validated delivery retries and single-member/legacy identity. Synthetic text replays narrate supplied file/tool observations; they do not prove live runtime execution. Preserve existing facts and accepted variance. New cases use per-sample bundle additions for full procedures omitted by legacy slices; legacy cases retain their original bundle selections. Runtime leg/baseline/wave validation remains in extensions/lib/plan-check.test.ts, brief drift in scripts/brief-contract-lint.test.mjs, and seal acceptance in the source and shipped CLI tests. Parent verification must run model comparisons for every affected target and gauntlet-handoff; no model evidence is generated here.

Assembly: target.json owns shared slices; new case.md files declare bundle+ selections without changing legacy cases. New coordinated cases retain the leg grammar. Full skill/procedure additions are limited to scenarios that need them. Each expected.md pins must-hold facts before replay. Run only selected behavior-relevant samples at parent verification, never the full target.
