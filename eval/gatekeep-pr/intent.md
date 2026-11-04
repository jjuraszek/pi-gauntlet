for: e1168838fb6fa50d4e26c2cb5f42e029e06fee5f268b0a3173087adea30031f1

## Change
Apply row allowance and consecutive-miss exhaustion before dispatch, continue eligible siblings under the unchanged wave cap, and persist a no-progress exit when none remain. Escalate once at the clamped threshold with no ledger mutation when the required model is unavailable. Carry the failed decision in an explicitly selected review post. Selected model coverage is row-exhaustion only; phase-tracker unit tests cover the bound verify guard, not model narration. Preserve loop-worker, nit-batch-row and reviewer-row-reopen records and their partial reports; admission and lifecycle recovery remain outside this iteration's model evidence.

## Expected to move
- row-exhaustion/r1: fails -> holds - Skip allowance-exhausted rows and continue an eligible sibling.
- row-exhaustion/r2: fails -> holds - Carry failed-attempt knowledge through the posted review item.
- row-exhaustion/r3: fails -> holds - Exhaust a row on its second consecutive validation miss.
- row-exhaustion/r4: fails -> holds - Persist exhaustion without resetting attempts on cap increases.
- row-exhaustion/r5: fails -> holds - Refuse a required escalation without a model and without ledger mutation.
- row-exhaustion/r6: fails -> holds - Escalate once at the configured threshold.
- row-exhaustion/r7: fails -> holds - Preserve spent escalation and clamp an allowance-one attempt.
