bundle-: skills/gauntlet-resume/reference/brief-contract.md
## Entry boundary
Decide whether Returns conversion is eligible at reconstruction step 4.2. Pending recovery and allowance migration are complete, not part of the requested output.

## Fixed inputs
The approved single-home ledger is clean and tuple-free. It has allowance 4, iterations 5 and unchanged rows/decisions. Reads succeed. No ticket is bound. No new work or tracker call is needed to answer eligibility.

## Decision axis
Change only returned-header presence. A: there is no returned line. B: the same ledger already has returned: none. All other inputs are identical.

## Output
For each variant state convert or leave untouched and the applicable shared bookkeeping sentence, if any. For an eligible conversion, name the supplied Conversion recipe as the next operation, without executing it. Do not decode history, compute repair counts or write a converted ledger.

## Stop boundary
Stop after the eligibility decision. Do not recover a pending return, execute conversion, commit, refresh or simulate a second resume.

## Validation
Selected isolated classification of conversion eligibility and its recipe. scripts/loop-legacy-conversion.test.mjs executes the shipped recipe for decoding, count preservation and idempotence in disposable Git fixtures. This classification does not prove those operations or a resume flow. Saved broader replies are historical only.
