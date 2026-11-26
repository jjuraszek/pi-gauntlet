# eval report: conformance-reviewer (partial run: stage-only-sentences)

for: 92c653a9b42474087edddfcd073964356d6a2b68cd08b776a042750062b17e56

wall: 0s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, including a literal that defines its functionality, without requiring the external half. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample checks a fetched seven-row ticket against a spec that kept the ticket-comment row as a criterion. Only the importer's missing-id rejection is a requirement; the shared definition excludes the other six rows regardless of placement. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| stage-only-sentences | anthropic/claude-opus-5-5 | unchanged | 9031 | f1: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| stage-only-sentences | github-copilot/gpt-6.1-sol | unchanged | 5261 | f1: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- stage-only-sentences / anthropic/claude-opus-5-5: Neither fact moved on this case: both outputs report CONFORMS with three delivered rows (Goal, Design, and the trimming clause of the Tests line, each with src/label.mjs evidence). Neither quotes the three named stage sentences, and neither gives a row, gap, verdict or drift line to the PR-title, PR-state, review, merge, full-suite or workflow-run sentences. Neither adds a skip note in the confidence text or the drift section. After's only differences are cosmetic: it quotes the Tests clause without Before's "[...]" truncation marker, which is slightly cleaner because it leaves no hint of an omitted half. It also adds prose after "none" in Origin drift ("No ticket was fetched because a spec exists"). That prose does not mention stage sentences, so f3 still holds, but free-form commentary in the drift and confidence slots is where a skip explanation would most likely leak in. To keep both facts stable, the wording should tell the model to write a bare "none" for drift when there is none, to quote only the file-deliverable clause of a mixed line, and to keep the confidence text to the file evidence alone.
- stage-only-sentences / github-copilot/gpt-6.1-sol: Neither fact moved: both outputs report CONFORMS, quote none of the three named stage sentences, give no row, gap, verdict or drift line to the PR-title, PR-state, review, merge, full-suite or workflow-run sentences, and include no skip note in confidence or drift. Both also keep the trimming clause from the mixed Tests line covered with src/label.mjs evidence. After merges the Goal, Design and Tests file clause into a single row and quotes only "`src/label.mjs` trims the label", which cleanly drops the suite-run half; Before did the same using a "[...]" elision, which hints at omitted text but does not list or explain it. To keep both facts stable, keep wording that tells the auditor to quote only the behavior half of a mixed line, to stay silent about excluded stage sentences everywhere (including confidence and drift), and to always retain the file-deliverable clause as a covered requirement with file:line evidence. One thing to watch: After no longer cites the Goal sentence as an origin, so if you want every behavior sentence visibly traced, say that merged rows should list all contributing origins.

exit: 0
