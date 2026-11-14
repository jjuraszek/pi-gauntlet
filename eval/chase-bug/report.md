# eval report: chase-bug (isolated source-wiring checks)

for: 1e64e093a76ce24e3964c877bd202e248cd698ff9cb5298b26a1384d0e65da95

## Current coverage

The selected local check passed: 52 tests, 0 failures, including all 23 inventoried citation sites. This is not a full-suite result.

`timeout -k 30 120 node --test scripts/commit-message-contract.test.mjs` selects the shared-reference citation, written hotfix return/landing wiring, isolated sample structure, docs isolation rules and evidence-currency assertions. These are deterministic source checks, not an executed hotfix flow. No model calls were selected after isolation; neither narrowed sample has a current model pass.

| Narrowed sample | Entry and output | Stop | Model reason |
|---|---|---|---|
| hotfix-return-file | Supplied seed result -> admission classification, varying only file presence | Before a row attempt, counter write or cleanup | Unselected instruction-interpretation candidate; it cannot prove a parser or counters |
| hotfix-plain-landing | Fixed fault story and ticket -> subject and paragraph | Before commit, PR creation or any other delivery step | Fault naming and prose composition need language judgment, but caller wiring is deterministic |

## Historical evidence

Keep `results/hotfix-return-file/` unchanged as historical evidence for the broader seed-plus-row input. Its input hashes are stale after isolation. `hotfix-plain-landing` was never run and has no result directory. Unrelated samples were not rerun.

The broad hotfix-return-file command was `timeout -k 30 3600 node eval/run.mjs chase-bug hotfix-return-file --base 04389adbc9a13d809c958d34ff2d96f3247f6a19`. Its first completed run exited 1 after 110s because replies exceeded the 700-word cap; it made four replays and no judgments. The retained compact-input retry exited 1 after 106s with four replays and one judgment:

| historical sample | model | recorded result |
|---|---|---|
| hotfix-return-file | anthropic/claude-opus-5-5 | Error: 722 words exceeded the 700-word cap |
| hotfix-return-file | github-copilot/gpt-6.1-sol | Recorded improved, but dispatch still failed; admission held |

The retained judgment reports missing explicit stale-file removal and dispatched pre-bump iteration in that narration. Those failures are not relabeled as successes. Narrowing removes multi-stage narration, not a product requirement or the need for a deterministic check of the corresponding logic.

## Remaining coverage

Seed/row parser behavior, counter preservation, cleanup and delivery execution are not newly proven. Fault-story composition remains unrun. Use isolated executable fixtures for logic and a selected composition case only when that language behavior needs fresh evidence.
