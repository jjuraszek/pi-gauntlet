for: 4274619d09ee78ed26770bee585aed1179dff054a70822197747fe1b93d7483c

## Change
Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample leaves out the after-merge admin secret-creation step and commit-message text without a row, drift or skip note, while delivered trimming still yields CONFORMS. Coverage is limited to these six samples.

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
- prompt-stage-sentence/f2: fails -> holds - the dropped prompt-only behavior stays a gap with its prompt origin.
- prompt-stage-sentence/f3: fails -> holds - missing file behavior keeps the verdict GAPS without counting the CI sentence.
- prompt-stage-sentence/f4: fails -> holds - the missing Tests file stays a gap with its file-clause origin while the suite-run clause is excluded.
- post-merge-action/f1: fails -> holds - operator steps and commit-message sentences leave no trace while delivered behavior stays covered.
- post-merge-action/f2: fails -> holds - missing operator and commit-message evidence cannot block a conforming file change.
