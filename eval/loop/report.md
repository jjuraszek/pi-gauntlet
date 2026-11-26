# eval report: loop (partial run: seed-dispositions)

for: a090e019ad9bd2e5539d679572854018f538edd635b970bdee136868dfb5e9fd

wall: 65s

## Change

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| seed-dispositions | anthropic/claude-opus-5-5 | unchanged | 9392 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |
| seed-dispositions | github-copilot/gpt-6.1-sol | unchanged | 6151 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |

## Feedback

- seed-dispositions / anthropic/claude-opus-5-5: No fact moved: both outputs satisfy all four facts, so the expected fails -> holds on `entries` does not show up in this pair. Before already says the six Integration entries "are not work, so they get no rows and no workers" and never uses one as a seed check, blocker or target. After says the same and adds that they are not requirements, naming the `not stated` cutover and the production total comparison, which is slightly more explicit but does not change the verdict. Both outputs open row 6 with empty evidence and zero attempts because `venue:` is not a cut disposition, with no sandbox prerequisite, which is what the Change asks for. Both run plan_check and commit the skeleton before starting implement, dispatch the seed to a fresh, foreground loop-implementer in the home checkout with file-only output, `none` acceptance and no model override, admit A (next target row 2) and B (exit to verify), and route C, D and E to seed repair and re-dispatch. To keep all four facts, keep the wording that treats an unrecognized disposition as an ordinary open row and keep the explicit sentence that Integration entries get no row, no worker and no gating role. If the Before failure on `entries` was intermittent, state that exclusion as a rule in the ledger-seeding step rather than leaving it to an example.
- seed-dispositions / github-copilot/gpt-6.1-sol: Neither output moved a fact: both show the same six-row skeleton (rows 1, 2, 6 open with empty evidence and zero attempts, rows 3-5 cut with their reasons, AC6 opened without a sandbox prerequisite), both exclude every Integration entry from rows, workers and checks, both commit the stamped skeleton before starting implement and dispatch a fresh foreground loop-implementer with file-only output, acceptance none and no model override, and both admit A (next target row 2) and B (exit to verification) while routing C, D and E to seed repair and seed redispatch without a human stop. The expected fails -> holds move on entries is not visible in the text, because Before already states that no Integration entry creates a row, worker, requirement or prerequisite. After is slightly weaker in places and should be tightened to keep the facts robust: it says plan_check then 'stage only the skeleton and commit' without Before's explicit stamping note and git commands, it leaves B's seed decision next-cell as a placeholder instead of 'none', and its Integration sentence says 'row, worker or requirement check' where naming blockers and next targets explicitly (and the release tag specifically) would make the exclusion unambiguous. Keeping Before's explicit 'stamped skeleton commit' wording and the full exclusion list would preserve every fact while still delivering the unrecognized-disposition check.

exit: 0
