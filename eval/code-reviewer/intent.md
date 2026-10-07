for: 161920a0ea2b690b51e6e9932a62afb602357b47395d04491704f2be371cada0

## Change
The code-reviewer persona's Tests priority becomes a check list over added and changed tests: split-assertion repeats, duplicate tests, oversized input, per-test rebuilds, and wrong-layer tests are Minor shrink or delete findings the implementer may decline; a consolidation that loses behavioral coverage is Critical. The review template asks whether each added or changed test earns its run instead of asking for edge cases and integration tests.

## Expected to move
- duplicate-tests-diff/f1: fails -> holds - the reviewer now proposes one test covering all three fields
- duplicate-tests-diff/f2: fails -> holds - economy findings are Minor
- duplicate-tests-diff/f3: fails -> holds - the reviewer avoids additional separate field-mapping edge-case tests
- oversized-fixture-diff/f2: fails -> holds - lost posted_on coverage is Critical
- oversized-fixture-diff/m1: fails -> holds - the lost-coverage finding includes Critical
- wrong-layer-rspec/f1: fails -> holds - the reviewer names the model and request layers as owners
