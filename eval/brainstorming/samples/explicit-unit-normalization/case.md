## Ask
T-2 asks to repair one document's invented and duplicated alarm points, preserve the point-or-linear representation, and send uncertain points to review instead of live data. It also asks to check unit conversion and avoid document-specific exceptions.

## Gather draft
The source already uses temperature and time units, so conversion cannot decide which band edge owns a delay. Shared pressure guidance picks the edge nearer nominal even though the stated delay belongs to the outer edge. A separate postprocessing step promotes tolerance window boundaries into invented zero-delay alarm rows. The temperature near-nominal convention is verified and must stay unchanged. svc-a materializes weak rows into live data today, so weak confidence alone does not satisfy review-only routing.
Framing: The one-document repair and unit-conversion hypothesis miss shared band-edge semantics and promotion defects. Use document-agnostic pressure severe-edge guidance and replace promotion with sourced review proposals, including the svc-a ingestion gate needed to keep weak rows out of live consumers; conversion is not the lever.
Pattern: svc-b/review-contract.md already defines weak confidence as never auto-accept; svc-a/alarm-consumer.md reveals the missing live-data gate.

## Recorded answers
Q: Proceed without endorsed numeric ground truth? A: Proceed on the provisional design reference, but do not invent expected values; numeric verification needs endorsed points and tolerance.
Q: Use a document-specific band-edge exception? A: No, change the shared convention; the shipped correction changes pressure to the outer edge and preserves the verified temperature near-nominal rule.
Q: Keep tolerance window promotion? A: Route instead of promoting into live zero-delay alarm rows.
Q: Add a new review flag? A: Reuse the existing weak-confidence envelope.
Q: Is conversion the lever? A: No, the source units are already usable; band-edge assignment and promotion are the defects.
Q: Is svc-b-only work enough? A: No, include the svc-a gate needed to keep weak proposed rows parked and out of live consumers.
Q: Change representation? A: Keep point-or-linear and the existing two-endpoint contract, without document-specific models or sampled ramp points.

## Fixture files
### svc-b/alarm-parser.md
```text
pressure band with scalar delay currently picks inner edge
tolerance window Alarm row currently promoted into alarm collection with zero delay
source already in temperature and time units
```
### svc-b/band-guidance.md
```text
pressure band with one delay -> outer edge farther from nominal
temperature band with one delay -> existing inner edge
shared document-agnostic guidance; no template detector
point or linear representation unchanged
```
### svc-b/review-contract.md
```text
weak confidence means never auto-accept
non-coincident tolerance window Alarm -> weak alarm-shaped proposal with sourced magnitude and delay
original tolerance window row preserved; no synthesized zero delay
all zero-delay alarm rows forced weak
```
### svc-a/alarm-consumer.md
```text
current materialization and prefill ignore weak confidence
weak magnitude or delay -> materialized parked row with candidates
live consumers exclude parked rows; acceptance unparks
numeric closure waits for endorsed ground-truth points and tolerance
```
