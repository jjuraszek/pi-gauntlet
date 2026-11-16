for: 45d48bd3ee0afb7ecc98812c2f6e7bc614d3ef12927593316fbdc0dd0f55a965

## Change
Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no prompt-origin requirement, drift entry or skip note for it. Coverage is limited to these four samples.

## Expected to move
- legs-verification-line/f1: fails -> holds - delivery-stage evidence no longer blocks conformance when every file requirement is delivered.
- legs-verification-line/f2: fails -> holds - PR gate and ship evidence are not requirements or drift.
- legs-verification-line/f3: fails -> holds - both delivered behavior clauses remain in coverage.
- legs-verification-line/f4: fails -> holds - the file clause on the verification line remains a delivered requirement.
- stage-only-sentences/f1: fails -> holds - stage sentences produce no coverage or gaps without a pull request.
- stage-only-sentences/f2: fails -> holds - unobserved stages no longer block a conforming file change.
- stage-only-sentences/f3: fails -> holds - excluded stages leave no skip note or drift entry.
- stage-only-sentences/f4: fails -> holds - excluded stages are not unauthorized requirements.
- mixed-row/f1: fails -> holds - each mixed acceptance row is delivered on its behavior alone.
- mixed-row/f2: fails -> holds - origins quote only behavior and an open pull request does not make stages requirements.
- mixed-row/f3: fails -> holds - absent PR text and stage results do not block conformance.
- prompt-stage-sentence/f1: fails -> holds - a prompt-only delivery-stage sentence produces no requirement or mention.
- prompt-stage-sentence/f2: fails -> holds - a missing CI result in the prompt does not block delivered file behavior.
- prompt-stage-sentence/f3: fails -> holds - omitting the prompt's stage sentence from the spec creates no origin drift while trimming remains delivered.
