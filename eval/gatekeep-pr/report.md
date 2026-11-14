# eval report: gatekeep-pr (isolated source-wiring checks)

for: 692b9ffdad1ec862b1f14bc890e728c42c4f2a4de5ff03c35be0b39bedcda620

## Current coverage

The selected local check passed: 52 tests, 0 failures, including all 23 inventoried citation sites. This is not a full-suite result.

`timeout -k 30 120 node --test scripts/commit-message-contract.test.mjs` selects the shared-reference citations, caller wording/return-file wiring, isolated sample structure, docs isolation rules and evidence-currency assertions. These are deterministic checks, not an executed gatekeep driver or live GitHub proof. No model calls were selected after isolation; no current model pass is claimed for either narrowed case.

| Narrowed sample | Entry and output | Stop | Model reason |
|---|---|---|---|
| merge-landed-message | Fixed completed outcomes -> composed subject and body | Before any settings read, policy choice or delivery | Prose composition needs language judgment, but is not required to prove caller wiring here |
| fix-row-return-file | Supplied returned row -> admission classification, varying only file presence | Before any counter write, cleanup or next dispatch | Unselected instruction-interpretation candidate; executable checks belong in deterministic fixtures |

## Historical evidence

The unchanged records in `results/merge-landed-message/` and `results/fix-row-return-file/` used broader multi-boundary inputs. Their input hashes do not match the isolated cases. They remain historical evidence, not current passes or end-to-end validation. Unrelated records were not rerun.

| historical sample | model | recorded verdict | judge ms |
|---|---|---|---|
| merge-landed-message | anthropic/claude-opus-5-5 | improved | 9124 |
| merge-landed-message | github-copilot/gpt-6.1-sol | improved | 10316 |
| fix-row-return-file | anthropic/claude-opus-5-5 | improved | 10687 |
| fix-row-return-file | github-copilot/gpt-6.1-sol | improved | 10546 |

Historical commands used `timeout -k 30 3600 node eval/run.mjs gatekeep-pr <sample> --base 04389adbc9a13d809c958d34ff2d96f3247f6a19`, selecting each named sample separately. They exited 0 in 122s and 187s respectively; each made four replays and two judgments. These outcomes do not cover the narrowed inputs.

## Remaining coverage

No new model composition or admission decision is proven. Merge flags, API policy, queue behavior, plan-file absence, counters and live delivery need their own deterministic fixtures or scoped review; no workflow replay substitutes for them.
