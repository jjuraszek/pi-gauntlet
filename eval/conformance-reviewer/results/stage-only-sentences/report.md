# eval report: conformance-reviewer (partial run: stage-only-sentences)

for: 072adbf4d8fbc9c97539bf42bebc8788375e70de47abecfc15c6bacf794e1cda

wall: 13s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample leaves out the after-merge admin secret-creation step and commit-message text without a row, drift or skip note, while delivered trimming still yields CONFORMS. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| stage-only-sentences | anthropic/claude-opus-5-5 | unchanged | 5140 | f1: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| stage-only-sentences | github-copilot/gpt-6.1-sol | unchanged | 5139 | f1: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- stage-only-sentences / anthropic/claude-opus-5-5: Neither fact moved on this sample: both Before and After report CONFORMS with only the two trimming requirements (Design and Goal origins) backed by src/label.mjs line evidence, quote none of the three named stage sentences, give no row, gap, verdict or drift line to the PR-title, PR-state, review, merge, npm test or release-workflow sentences, and carry no skip note or explanation of omitted stage sentences in confidence text or origin drift. So the expected fails -> holds movement for these facts is not visible here, because Before already satisfied them on this run. The After wording keeps what Before kept; the only differences are cosmetic (evidence annotations in parentheses, range 1-3 instead of 1-2, and the dropped "Parallel-safe: none" line). If that line is part of the required report format, restore it in the After wording. Otherwise keep the current exclusion phrasing, which removes stage sentences silently without prompting a skip note, and still anchors the delivered behavior to file evidence.
- stage-only-sentences / github-copilot/gpt-6.1-sol: Both outputs are effectively identical on these facts: each reports CONFORMS with a single delivered row for the trimming behavior, cites src/label.mjs:2 as file evidence, quotes only the Design behavior sentence, and contains no quote, row, gap, drift line, skip note or confidence commentary about the PR-description, ship-evidence, scan-time, PR-title, PR-state, review, merge, full-suite or workflow-run sentences. The After wording moved neither fact; the only visible differences are that After drops the inline code snippet from the evidence and prints the drift 'none' without a bullet, neither of which affects f1 or f3. To keep both facts while delivering the Change, keep instructing the skill to silently omit delivery-stage sentences (no skip list, no drift, no confidence caveat) while still requiring a file:line citation for each delivered behavior; if you want the evidence snippet retained as in Before, say so explicitly, since After shows it can be dropped.

exit: 0
