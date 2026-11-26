# eval report: conformance-reviewer (partial run: post-merge-action)

for: 92c653a9b42474087edddfcd073964356d6a2b68cd08b776a042750062b17e56

wall: 4s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, including a literal that defines its functionality, without requiring the external half. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample checks a fetched seven-row ticket against a spec that kept the ticket-comment row as a criterion. Only the importer's missing-id rejection is a requirement; the shared definition excludes the other six rows regardless of placement. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-merge-action | anthropic/claude-opus-5-5 | unchanged | 3904 | f1: holds -> holds (intended but unchanged); f3: holds -> holds (held); f2: holds -> holds (intended but unchanged) |
| post-merge-action | github-copilot/gpt-6.1-sol | unchanged | 4368 | f1: holds -> holds (intended but unchanged); f3: holds -> holds (held); f2: holds -> holds (intended but unchanged) |

## Feedback

- post-merge-action / anthropic/claude-opus-5-5: Neither fact moved between the two outputs: both Before and After list exactly one requirement (the importer rejecting a row without an id, delivered at src/importer.mjs:2), report CONFORMS with no origin drift, and give no requirement number, verdict, gap, skip note, drift entry or missing-from-spec remark to the ticket-comment row, the other five ticket rows, or any of the six Integration entries (including the release tag and production order-total comparison). The expected fails -> holds movement for this sample is therefore not visible here, because Before already satisfied both facts. After's only differences are a parenthetical confidence rationale and a slightly longer evidence note citing src/importer.mjs:3, neither of which touches the excluded rows; keep that wording free of any mention of the excluded rows (no 'skipped' or 'out of scope' notes) so both facts continue to hold while delivering the Change.
- post-merge-action / github-copilot/gpt-6.1-sol: Neither fact moved between the two outputs: both Before and After list a single delivered requirement (the importer rejecting a row without an id, with evidence at src/importer.mjs:2), give no requirement number, verdict, gap, skip note or drift entry to the ticket-comment row or the other five ticket rows, and give no verdict or blocker to any of the six Integration entries, including the release tag and the production order-total comparison. The expected fails -> holds movement for these facts is therefore not shown by this sample, because Before already satisfied them; the After wording keeps both facts, and the only visible difference is that After's evidence cites the line without describing the throw, which does not affect either fact. To keep both facts while delivering the Change, retain the wording that limits requirements to file-delivered functionality and excludes tracker, operator, gate and stage rows regardless of where the spec places them, with no skip note or drift entry for the excluded rows.

exit: 0
