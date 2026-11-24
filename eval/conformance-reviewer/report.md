# eval report: conformance-reviewer (partial run: mixed-row)

for: 072adbf4d8fbc9c97539bf42bebc8788375e70de47abecfc15c6bacf794e1cda

wall: 25s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample leaves out the after-merge admin secret-creation step and commit-message text without a row, drift or skip note, while delivered trimming still yields CONFORMS. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| mixed-row | anthropic/claude-opus-5-5 | unchanged | 8873 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| mixed-row | github-copilot/gpt-6.1-sol | unchanged | 9849 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- mixed-row / anthropic/claude-opus-5-5: Neither fact moved on this sample: both outputs give each mixed acceptance row exactly one DELIVERED requirement with diff evidence, quote only the behavior clause with a [...] truncation, and say nothing about the PR description, the slow job, or the standalone stage sentences in coverage, drift, verdict or notes. Before already satisfied both facts here, so this output pair does not show the expected fails -> holds movement for mixed-row; the After wording is at least not regressing it. The only difference is that After adds a Goal-origin requirement (R3, "prevent tracked legacy files from returning"), which partly duplicates the Design test requirement. It does not break f1, because the acceptance rows still map to exactly one requirement each by origin, but if you want tighter coverage, tell the auditor not to raise a separate requirement for a Goal clause that a Design or acceptance row already covers. Keep the current instruction to quote only the behavior half of a mixed row and to omit stage clauses silently, since that is what holds both facts.
- mixed-row / github-copilot/gpt-6.1-sol: Neither fact moved on this sample: both outputs report CONFORMS, and each acceptance row has exactly one DELIVERED requirement (R3, R4) with diff evidence. Both origin quotes stop at the behavior clause with [...], and nothing mentions the PR description, slow job, title, approval, merge, timing, npm test or release workflow. The expected fails -> holds movement therefore does not show here, because Before already satisfied both facts. The only visible difference in After is an extra "Supplied local check output" block echoed verbatim between coverage and drift. It breaks no fact, but it is outside the report format and adds a place where stage text could leak; say explicitly that evidence is cited inline in each row and input sections are never reproduced. Keep the wording that limits a mixed row's origin quote to its behavior clause and that omits stage sentences silently, with no row, drift entry or skip note, since that is what holds both facts. Both outputs also restate the acceptance behaviors as Design-origin R1 and R2; if you want one requirement per behavior, say which origin wins, without disturbing the single acceptance-origin row each.

exit: 0
