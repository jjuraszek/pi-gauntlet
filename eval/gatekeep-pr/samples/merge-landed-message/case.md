bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/menus.md
bundle-: skills/gatekeep-pr/reference/findings.md
bundle-: skills/gatekeep-pr/reference/post-selection-loop.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
bundle-: skills/gatekeep-pr/reference/report.md
bundle-: skills/gatekeep-pr/verification-brief.md
bundle-: skills/gatekeep-pr/reference/assessment.md
bundle-: skills/brainstorming/reference/menu-layout.md
## Entry boundary
Compose one landed message through commit-message.md. The change is complete; this is not a merge or menu simulation.

## Fixed inputs
No carried spec or bound ticket. PR title: Count imported plants in pagination. Description: Imported plants were missing from compliance page counts. Include them so totals and page counts agree. In-scope outcomes: page counts match totals in single-company views; imported answers appear on compliance pages. No overrides alter the shared wording rules.

## Decision axis
One case: phrase the completed change for a reader unfamiliar with the code. There are no policy, repository-setting or delivery variants.

## Output
Return only the subject, a blank line, a paragraph and outcome bullets. Apply the shared Landed message shape. Do not emit commands or a merge result.

## Stop boundary
Stop after the composed message. Do not query repository settings, choose a merge policy, write files, merge, post or clean up.

## Validation
Model candidate only: interpreting the change and composing readable prose needs language judgment. Caller wiring, message flags and fixed note text belong to deterministic source checks. This narrowed case has not been replayed; its broad saved records are historical, not current evidence.
