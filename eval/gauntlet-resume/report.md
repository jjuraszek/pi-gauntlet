# eval report: gauntlet-resume (isolated source-wiring checks)

for: 74c1aa1ddce1af0e935d8ab0a674b520bb7fb074aed9aa179672293b7e96c3de

## Current coverage

The selected local check passed: 52 tests, 0 failures, including all 23 inventoried citation sites. This is not a full-suite result.

`timeout -k 30 120 node --test scripts/commit-message-contract.test.mjs` selects the shared-reference citation, written recovery rules, isolated sample structure, docs isolation rules and evidence-currency assertions. These are deterministic source checks, not execution of a resume or conversion driver. No model calls were selected after isolation; neither narrowed case has a current model pass.

| Narrowed sample | Entry and output | Stop | Model reason |
|---|---|---|---|
| returned-line-recovery | One supplied clean home return -> classification and authority | Before ledger mutation, migration or tracker restoration | Unselected interpretation of the documented admission boundary |
| legacy-ledger-conversion | Supplied clean tuple-free ledger -> eligibility, varying only returned-header presence | Before decoding, writing, committing or refreshing | Unselected interpretation of eligibility; parser/count logic needs executable fixtures |

## Historical evidence

Keep `results/returned-line-recovery/` and `results/legacy-ledger-conversion/` unchanged. Their broader recovery/conversion input hashes do not match these narrowed cases; their results are historical, not current or end-to-end proof. Unrelated records, including plan-citation-subject, were not rerun.

| historical sample | model | recorded verdict | judge ms |
|---|---|---|---|
| returned-line-recovery | anthropic/claude-opus-5-5 | improved | 20278 |
| returned-line-recovery | github-copilot/gpt-6.1-sol | improved | 15373 |
| legacy-ledger-conversion | anthropic/claude-opus-5-5 | improved | 8695 |
| legacy-ledger-conversion | github-copilot/gpt-6.1-sol | improved | 7895 |

Historical commands used `timeout -k 30 3600 node eval/run.mjs gauntlet-resume <sample> --base 04389adbc9a13d809c958d34ff2d96f3247f6a19`, selecting each named sample separately. They exited 0 in 236s and 188s respectively; each made four replays and two judgments. They do not cover the narrowed inputs.

## Remaining coverage

The spec's deterministic legacy-conversion script fixture, count preservation, idempotent execution, companion recovery, ambiguous history and verification-repair admission remain separate coverage obligations. Narrated eligibility or a source citation proves none of them.
