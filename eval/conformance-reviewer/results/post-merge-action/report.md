# eval report: conformance-reviewer (partial run: post-merge-action)

for: 92c653a9b42474087edddfcd073964356d6a2b68cd08b776a042750062b17e56

wall: 15s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample checks a fetched seven-row ticket against a spec that kept the ticket-comment row as a criterion. Only the importer's missing-id rejection is a requirement; the shared definition excludes the other six rows regardless of placement. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-merge-action | anthropic/claude-opus-5-5 | unchanged | 4716 | f1: holds -> holds (intended but unchanged); f3: holds -> holds (held); f2: holds -> holds (intended but unchanged) |
| post-merge-action | github-copilot/gpt-6.1-sol | unchanged | 4529 | f1: holds -> holds (intended but unchanged); f3: holds -> holds (held); f2: holds -> holds (intended but unchanged) |

## Feedback

- post-merge-action / anthropic/claude-opus-5-5: Neither fact moved between arms: both Before and After report a single delivered requirement (the missing-id rejection, evidenced at src/importer.mjs:2), a CONFORMS verdict, no origin drift, and no mention, verdict, gap, skip note or blocker for the ticket-comment row, the other five ticket rows, or any of the six Integration entries (including the release tag and production order-total comparison). The expected fails -> holds movement for f1 and f2 is therefore not observable on this sample, because Before already satisfied the facts; the After wording only added a confidence rationale and a slightly longer evidence note, neither of which touches excluded rows. To keep both facts holding, keep the wording that limits requirements to file-delivered behavior and forbids skip notes or drift entries for excluded delivery-stage rows; if you need this sample to demonstrate the change, the Before arm would need a baseline that actually enumerates the ticket-comment row or the Integration entries.
- post-merge-action / github-copilot/gpt-6.1-sol: Neither fact moved between arms: both Before and After list a single DELIVERED requirement (the importer rejecting a row without an id, evidence src/importer.mjs:2), give no requirement number, verdict, gap, skip note or drift entry to the ticket-comment row or the other five ticket rows, and say nothing about any of the six Integration entries, including the release tag and production order-total comparison. The expected fails -> holds movement for f1 and f2 is not visible in this sample because Before already satisfied the facts as written; f3 as listed here likewise holds on both arms. The After wording keeps everything Before kept, so no wording correction is needed for this case; if you want this sample to demonstrate the change, you need a Before run that actually counted the ticket-comment row or an Integration entry, otherwise treat the sample as a no-movement regression check. The only difference is that After's evidence line drops the description of the throw, which does not affect any fact.

exit: 0
