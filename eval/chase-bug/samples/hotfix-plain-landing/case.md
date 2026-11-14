bundle-: skills/chase-bug/reference/verdict-report.md
## Entry boundary
Compose one hotfix message using the shared Hotfix landing and Landed message rules. The repair is already complete; no workflow stage runs.

## Fixed inputs
Fault story: Blank plant names reached storage and broke the plant list. Validate names before saving so every plant can be displayed. Bound ticket: #241. Overrides refs convention: Refs #N in commit bodies. No other override alters wording. No file names or internal identifiers are needed to describe this change.

## Decision axis
One case: express the fixed fault as a readable message. There are no squash-versus-PR delivery variants.

## Output
Return only a subject and body, separated by a blank line. Use the fault story for the paragraph and apply the bound ticket convention. Omit outcome bullets for a hotfix.

## Stop boundary
Stop after the composed message. Do not emit git or gh commands, create a commit or PR, verify a tree, push, clean up or draft a reporter response.

## Validation
Model candidate only: naming the fault plainly and preserving its story requires language judgment; text assertions cannot prove that composition. Caller title/body wiring is deterministic. No model call is selected for this source-wiring iteration, and this isolated case has no replay evidence.
