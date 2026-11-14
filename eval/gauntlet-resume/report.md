# eval report: gauntlet-resume (partial run: returned-line-recovery)

for: 74c1aa1ddce1af0e935d8ab0a674b520bb7fb074aed9aa179672293b7e96c3de

## Current isolated coverage

`timeout -k 30 120 node --test scripts/loop-home-resume.test.mjs` passes 5 tests with 0 failures. The test lives beside the existing home-admission and worker-history tests in `scripts/`. It executes the documented Git discovery, snapshot, status and full-dispatch-range reads in a scratch checkout. Pending dispatch dirt, a clean child, a later code-only commit, dirty paths and an unavailable before-image are separate observations. Source assertions cover count preservation and settled/ambiguous-history rules; they do not execute a resume driver or its ledger writes.

Only the model-dependent `returned-line-recovery` classification was replayed. It receives one clean home return with supplied passing admission checks, identifies the committed ledger's tuple and S before-image, preserves iterations 3 and attempts 1, and stops before restoration. No end-to-end resume, tracker refresh, mutation or ambiguous-history model scenario was run.

| sample | model | verdict | judge ms | fact |
|---|---|---|---|---|
| returned-line-recovery | anthropic/claude-opus-5-5 | improved | 5743 | home: fails -> holds |
| returned-line-recovery | github-copilot/gpt-6.1-sol | improved | 5325 | home: fails -> holds |

The selected action was `timeout -k 30 3600 node eval/run.mjs gauntlet-resume returned-line-recovery --base 04389adbc9a13d809c958d34ff2d96f3247f6a19`. It exited 0 in 23s: four replays, two judgments, no confirmations. The controller reaped the job; its group and controller exited before its jobs entry was removed.

The exact new runner records are retained as `results/returned-line-recovery/baseline-isolated.json` and `candidate-isolated.json`. The local test verifies their current assembly, input, intent, fact and judgment hashes and reuses them without model calls. The older `baseline.json` and `candidate.json` remain byte-identical because the closed source-wiring check explicitly pins their historical input mismatch; these filenames do not hold the isolated replay. This preserves that check and the old evidence without cloning a sample or changing the runner.

## Prior source-wiring evidence

The earlier selected check was `timeout -k 30 120 node --test scripts/commit-message-contract.test.mjs`: 52 tests passed, 0 failed, including all 23 inventoried citation sites. It checked shared-reference citations, written recovery rules, isolated sample structure, docs isolation rules and evidence currency. It did not execute a resume or conversion driver. It was not rerun in this iteration.

| Narrowed sample | Entry and output | Stop | Coverage |
|---|---|---|---|
| returned-line-recovery | One supplied clean home return -> classification and authority | Before ledger mutation, migration or tracker restoration | Current isolated decision replay above |
| legacy-ledger-conversion | Supplied clean tuple-free ledger -> eligibility, varying only returned-header presence | Before decoding, writing, committing or refreshing | Still unselected; historical records have stale case hashes |

## Historical evidence

The broad `results/returned-line-recovery/{baseline,candidate}.json` and `results/legacy-ledger-conversion/{baseline,candidate}.json` remain unchanged. Their input hashes do not match the narrowed cases; they are historical, not current or end-to-end proof. Unrelated records, including plan-citation-subject, were not rerun.

| historical sample | model | recorded verdict | judge ms |
|---|---|---|---|
| returned-line-recovery | anthropic/claude-opus-5-5 | improved | 20278 |
| returned-line-recovery | github-copilot/gpt-6.1-sol | improved | 15373 |
| legacy-ledger-conversion | anthropic/claude-opus-5-5 | improved | 8695 |
| legacy-ledger-conversion | github-copilot/gpt-6.1-sol | improved | 7895 |

Historical commands used `timeout -k 30 3600 node eval/run.mjs gauntlet-resume <sample> --base 04389adbc9a13d809c958d34ff2d96f3247f6a19`, selecting each named sample separately. They exited 0 in 236s and 188s respectively; each made four replays and two judgments. They do not cover the narrowed inputs.

## Remaining coverage

Executable resume admission and count-preserving recovery writes remain unproven here. Legacy conversion and its count preservation/idempotence, companion recovery and verification-repair admission are separate obligations. Narrated eligibility or a source citation proves none of them.
