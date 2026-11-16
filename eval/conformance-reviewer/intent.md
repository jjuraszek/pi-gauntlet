for: 45d48bd3ee0afb7ecc98812c2f6e7bc614d3ef12927593316fbdc0dd0f55a965

## Change
Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The selected sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence. Coverage is limited to legs-verification-line.

## Expected to move
- legs-verification-line/f1: fails -> holds - delivery-stage evidence no longer blocks conformance when every file requirement is delivered.
- legs-verification-line/f2: fails -> holds - PR gate and ship evidence are not requirements or drift.
- legs-verification-line/f3: fails -> holds - both delivered behavior clauses remain in coverage.
- legs-verification-line/f4: fails -> holds - the file clause on the verification line remains a delivered requirement.
