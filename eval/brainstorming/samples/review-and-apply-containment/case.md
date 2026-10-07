## Ask
T-3 asks for svc-a review visibility for parked points and containment of malformed nested records during response application. svc-b already emits parked weak-confidence points; keep producer changes out of scope.

## Gather draft
The svc-b contract already marks weak points as parked. svc-a's nested-record route saves nested children directly, skipping ordinary pending field candidates; the item form does not distinguish parked rows. The downstream consumer raises on one malformed child and only stores the raw response on successful completion. The existing candidate acceptance loop already isolates failures, but it is not the failing application path. The shared field-review path is sufficient; no parallel review entity is needed.
Framing: no objection - checked svc-b/point-contract.md, svc-a/response-consumer.md (downstream consumer stub), svc-a/field-review.md, svc-a/point-form.md, and svc-a/point-validation.md.
Pattern: svc-a/field-review.md provides the ordinary pending-field review path to reuse for parked children.

## Recorded answers
Q: New record-level review entity? A: No, ordinary per-field candidates; weak and grounded points differ in confidence, not kind.
Q: Invalid child handling? A: Blank invalid attributes, park the row, preserve original wrapped values as pending candidates with real provenance.
Q: Backfill? A: No migration; rerun processing for old candidate-less rows.
Q: One malformed child? A: Apply valid children, retain raw failure detail for review, fail only when none apply.
Q: Change producer or weaken validation? A: No; keep producer and two-endpoint validation contracts.

## Fixture files
### svc-b/point-contract.md
```text
weak-confidence threshold points have parked: true
wrapped values carry source provenance
```
### svc-a/response-consumer.md
```text
nested-record route + nested child -> save directly, no field candidates
save raises on invalid child and aborts the run
raw response currently stored only on complete
```
### svc-a/field-review.md
```text
ordinary pending field candidate targets a persisted row
candidate needs source provenance; bare values cannot invent it
candidate acceptance already rescues each winner
```
### svc-a/point-form.md
```text
parked and live rows currently render identically
confirm makes parked row live; remove deletes row
```
### svc-a/point-validation.md
```text
linear shape requires both far value and far delay
presence of either far endpoint derives linear shape
```
