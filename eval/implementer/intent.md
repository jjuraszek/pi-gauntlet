for: 14ffccf90aa4b3fc4c5836644279aa68c816036bcf351642df54124440e6c857

## Change
The implementer persona gains a Test economy block (extend an existing test before adding one, one scenario per test, parametrize equivalent cases, minimal hand-built input, shared expensive setup, cheapest honest tier, heavy tests reported as deviations) and the SDD self-review asks whether each added test earns its run instead of whether tests are comprehensive. The SDD template also maps a deliberately heavy test or rebuilt setup to DONE_WITH_CONCERNS.

## Expected to move
- extend-existing-test/f1: fails -> holds - the persona now extends CASES instead of adding a function
- heavy-json-fixture/f1: fails -> holds - the persona now builds the one record by hand
- heavy-json-fixture/f3: fails -> holds - no new per-test json.load
