# eval report: spec-council-member (partial run: non-criterion-row-flagged)

for: 50eb6923d0a0564e346a94febc04e786521be8996a4cebdd8e95a1472d1109af

wall: 35s

## Change

Use the shared definition to report misplaced ticket requirements and entries in either direction, without findings on a correctly placed mixed row or a ticket entry already in Integration.

Flag a requirement, acceptance row, or Design clause sourced from a PR title/body as a major gap with pr-source in the finding text on ordinary and PR-rework reviews. Re-source from approved human input or agreed design, or ask for the user's Design scope decision before cutting; preserve drafting ownership and provenance exemptions. The two new tool-free samples require the finding/correction and passing design/provenance controls. Deterministic coverage proves instruction and fixture structure; parent verification supplies model evidence. Preserve every prior accepted move below.

Exercise the unchanged member persona with shape-ticket's revised caller brief: identify Idea overflow even on a paragraph-long single line, enforce the product-aware reader, example and Context bounds, and recognize displaced detail retained in the proposed Reporter note. Preserve plain-words leads and product-level cause and effect under rule 3's comprehension precedence. Only ticket-idea-overflow receives the whole caller and wording-reference files; ordinary spec reviews retain their existing assembly and behavior. Preserve the prior accepted in-scope implementation and proof simplifications: require a named sufficient alternative, protect explicit human choices, behavior, coverage and safety, assess unprotected failures after the proposed action, and anchor severity and adds to the original clause. The new sample's facts must hold; an already passing baseline remains a guard, not a forced failing baseline.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| non-criterion-row-flagged | anthropic/claude-opus-5-5 | improved | 13966 | placements: fails -> holds (intended change); mixed: fails -> holds (unplanned improvement); entries: fails -> holds (unplanned improvement) |
| non-criterion-row-flagged | github-copilot/gpt-6.1-sol | improved | 7516 | placements: fails -> holds (intended change); mixed: holds -> holds (held); entries: fails -> holds (unplanned improvement) |

## Feedback

- non-criterion-row-flagged / anthropic/claude-opus-5-5: After moves all three facts to holds and loses nothing Before held. On placements, After gives two blocker scope findings, one per misplaced row (the live identity-provider check under Acceptance criteria, the file-checkable line-number row only under Integration), and sends each verbatim to the other section. Before called them a blocker gap and a major gap, and sent the login row to a 'Post-deployment housekeeping' section rather than Integration. On mixed, After leaves the staging/empty-name row alone, where Before raised a major ambiguity over its staging clause and local-only proof. On entries, After touches no correctly placed Integration entry, where Before re-classed the vendor-confirmation row as an external-input dependency to be parked. That last call was the least clear-cut: I read re-classing and parking as giving the entry a verdict, though Before did not call it missing from Acceptance criteria or propose promoting it. To keep these results, keep the wording that names the finding as blocker scope per misplaced row with the opposite section as the target, and keep the explicit statement that a correctly placed mixed row and entries already in Integration get no finding. Two things After no longer mentions are the orphaned '- on staging' Integration bullet and the unspecified numbering base and report target; no fact here covers them, so if you want them back, add a line that allows non-placement findings on fragments that are not ticket rows without reopening placement on the mixed row.
- non-criterion-row-flagged / github-copilot/gpt-6.1-sol: After produces exactly two blocker scope findings, one for the live identity-provider row under Acceptance criteria and one for the file-checkable line-number row under Integration, each directed verbatim to the other section, so `placements` now holds. Before had flagged only the line-number row, as a major external-ref finding, and missed the identity-provider row entirely. After also leaves the mixed staging/empty-name row alone, as Before did, so `mixed` holds in both. `entries` moves from fails to holds: Before issued major gap findings on the correctly placed vendor-confirmation and In Review rows, demanding re-disposition and Reporter notes, while After says nothing about any correctly placed Integration entry. No fact that Before kept was lost. To keep this, retain the wording that gives each misplaced row its own blocker scope finding with a move-verbatim correction, and the explicit statement that correctly placed mixed rows and ticket entries already in Integration get no finding. One loose end: After's addresses-problem line says "two ticket rows are misclassified" without naming them, so naming the rows there would make the summary agree visibly with the findings.

exit: 0
