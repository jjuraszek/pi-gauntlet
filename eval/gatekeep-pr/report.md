# eval report: gatekeep-pr (partial run: row-exhaustion)

for: e1168838fb6fa50d4e26c2cb5f42e029e06fee5f268b0a3173087adea30031f1

wall: 97s

## Change

Apply row allowance and consecutive-miss exhaustion before dispatch, continue eligible siblings under the unchanged wave cap, and persist a no-progress exit when none remain. Escalate once at the clamped threshold with no ledger mutation when the required model is unavailable. Carry the failed decision in an explicitly selected review post. Selected model coverage is row-exhaustion only; phase-tracker unit tests cover the bound verify guard, not model narration. Preserve loop-worker, nit-batch-row and reviewer-row-reopen records and their partial reports; admission and lifecycle recovery remain outside this iteration's model evidence.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| row-exhaustion | anthropic/claude-opus-5-5 | improved | 25899 | r1: fails -> holds (intended change); r2: fails -> holds (intended change); r3: fails -> holds (intended change); r4: fails -> holds (intended change); r5: fails -> holds (intended change); r6: holds -> holds (intended but unchanged); r7: fails -> holds (intended change); r8: holds -> holds (held); r9: holds -> holds (held) |
| row-exhaustion | github-copilot/gpt-6.1-sol | improved | 17901 | r1: fails -> holds (intended change); r2: fails -> holds (intended change); r3: fails -> holds (intended change); r4: fails -> holds (intended change); r5: fails -> holds (intended change); r6: fails -> holds (intended change); r7: fails -> holds (intended change); r8: holds -> holds (held); r9: holds -> holds (held) |

## Feedback

- row-exhaustion / anthropic/claude-opus-5-5: After delivers the Change cleanly: it names the loop-implementer dispatch with the pending tuple and iterations 5→6 (r1), carries the `open - row 1 failed | ...` suffix into the explicitly selected review item (r2), treats the second consecutive miss as row exhaustion rather than Before's premature `no_progress` checkpoint at B (r3), renders the `stuck - no progress: row 1 exhausted (P1); row 2 exhausted (P2)` reason and quotes the row 1 decision (r4), refuses the threshold attempt with `stuck - escalationLoop.implModel unavailable` and no ledger mutation where Before silently dispatched with the model omitted (r5), and states the min(escalateAfter, allowance−1) clamp so E(ii) omits the model and E(iii) escalates at attempt 0 with an `allowed attempts 1` marker where Before overrode the model on the spent row and skipped the allowance-one case (r7). Nothing that Before kept (r6, r8, r9) was lost. Two small nits to tighten without moving any fact: in A the task body says `iteration: 5` while the ledger write says `iterations: 6` — pick one convention (e.g. task carries the bumped value) so a reader doesn't suspect a mismatch; and in F the closing line 'reopens dispatch for rows 2 and 3 only' is consistent with r9 but could add 'with attempts and the spent escalation marker unchanged' to make the no-reset guarantee explicit.
- row-exhaustion / github-copilot/gpt-6.1-sol: After moves every row-exhaustion fact from fails to holds: it treats allowance-4 and double-validation-miss rows as exhausted before dispatch and continues the eligible sibling (A, B), carries the failed decision text 'open - row 1 failed | ...' into the explicitly selected review item without authorizing a post, exits 'stuck - no progress: row 1 exhausted (P1)' with the row 1 failed decision quoted and refuses retries after the cap raise (C), refuses the threshold attempt with zero ledger mutation when implModel is undefined (D), escalates exactly once at min(3, allowance-1) with the allowed-attempts marker and MODEL_ESC, keeps a spent marker from re-escalating, and clamps the allowance-one case to threshold 0 (E). It preserves the facts Before already held: the round-cap exit in F and no npm test, push, fabricated results, or attempt/escalation resets anywhere. Nothing regressed; the only wording I would tighten is the C exit line, which should name the row 2 validation-miss exhaustion in the verdict string itself (not just prose) so the 'corresponding row 2/P2 exhausted reason' alternative is unambiguous, and the 'main' placeholder in the merge-base command could simply say 'the recorded base branch' to avoid looking like an invented ref.

exit: 0
