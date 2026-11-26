# eval report: conformance-reviewer (partial run: legs-verification-line)

for: 92c653a9b42474087edddfcd073964356d6a2b68cd08b776a042750062b17e56

wall: 0s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, including a literal that defines its functionality, without requiring the external half. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample checks a fetched seven-row ticket against a spec that kept the ticket-comment row as a criterion. Only the importer's missing-id rejection is a requirement; the shared definition excludes the other six rows regardless of placement. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| legs-verification-line | anthropic/claude-opus-5-5 | unchanged | 10068 | f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); f1: holds -> holds (intended but unchanged) |
| legs-verification-line | github-copilot/gpt-6.1-sol | unchanged | 4596 | f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); f1: holds -> holds (intended but unchanged) |

## Feedback

- legs-verification-line / anthropic/claude-opus-5-5: No fact moved on this sample: f2, f3 and f4 hold in both Before and After, so the expected fails -> holds movement does not show here because Before already gave no Rn to `npm test`, the PR gate or green CI, and already kept both behavior rows and a separate DELIVERED bundle row whose origin quotes the file clause with evidence in bin/widget.mjs. After keeps all of that, and its bundle origin is cleaner: it quotes only "regenerated bundles committed" rather than an elided verification line, and notes that the prompt repeats it while keeping the spec as origin. The one risk to f2 in After is the Confidence note, "every in-scope requirement ... nothing was run, and no tools were available": it stops short of listing or explaining skipped stage clauses, but "in-scope" and "nothing was run" hint at an excluded set and could become a skip note in other runs. To keep f2 safe, the wording should say that the Confidence line describes only the cited file evidence and must not allude to excluded stages, to scope, or to commands not run. It should also keep the explicit instruction that a file deliverable on a leg verification line gets its own row quoting only that file clause.
- legs-verification-line / github-copilot/gpt-6.1-sol: On this sample the After wording moved nothing: both outputs give no Rn or MISSING to npm test, the PR gate or green CI, add no skip note or commentary about them, keep DELIVERED rows for trim and lowercase citing src/label.mjs:2 and bin/widget.mjs:2, and keep a separate DELIVERED row whose origin quotes "regenerated bundles committed" with evidence in bin/widget.mjs. The expected fails -> holds movement for f2, f3 and f4 did not appear because Before already satisfied all three, so this sample does not demonstrate the Change; the only visible differences are row ordering and minor phrasing. To keep these facts holding, retain the wording that splits a leg verification line clause by clause (file deliverables stay as requirements with the file clause quoted as origin, stage clauses are dropped silently with no skip note), and consider a sample where the Before wording actually fails if you want evidence of the intended movement.

exit: 0
