for: 59784facd665ba809bf0c51e9deebcf8df21e74ee5d874a5e42d27e7233d24e1

## Change
The code-reviewer persona's Tests priority becomes a check list over added and changed tests: split-assertion repeats, duplicate tests, oversized input, per-test rebuilds, and wrong-layer tests are Minor shrink or delete findings the implementer may decline; a consolidation that loses behavioral coverage is Critical. The review template asks whether each added or changed test earns its run instead of asking for edge cases and integration tests. Read supplied spec acceptance rows and Design clauses before the spec-observable check: report an unmatched test as Moderate delete with a searched-section citation, keep tests justified by cited acceptance or preservation commitments, and report the check unverified when no spec is supplied.

## Expected to move
- duplicate-tests-diff/f1: fails -> holds - the reviewer now proposes one test covering all three fields
- duplicate-tests-diff/f2: fails -> holds - economy findings are Minor
- duplicate-tests-diff/f3: fails -> holds - the reviewer avoids additional separate field-mapping edge-case tests
- oversized-fixture-diff/f2: fails -> holds - lost posted_on coverage is Critical
- oversized-fixture-diff/m1: fails -> holds - the lost-coverage finding includes Critical
- wrong-layer-rspec/f1: fails -> holds - the reviewer names the model and request layers as owners
- spec-observable-tests/uncommitted-delete: fails -> holds - the reviewer flags the summary-only mixed-case test as Moderate delete and cites the spec section searched
- spec-observable-tests/acceptance-kept: fails -> holds - the reviewer keeps the test justified by the cited acceptance row
- spec-observable-tests/preservation-kept: fails -> holds - the reviewer keeps the test justified by the cited Design Keep clause
- duplicate-tests-diff/no-spec-unverified: fails -> holds - the reviewer reports the missing spec as unverified without a spec-citing delete finding
