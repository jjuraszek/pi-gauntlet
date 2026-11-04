# eval report: gatekeep-pr (partial run: loop-worker)

for: ef3cf153b4804d5da28b8875f6aaa46bf2898c27a3fd98ebba6d17c10dbf2433

wall: 82s

## Change

Clarify the unchanged prior-item rendering contract: render open prior-review items under Blockers or Nits with the reviewer's posted text and locator unchanged, not rewritten into consequence sentences to satisfy the general wording rules. Preserve prior-review-delta/d9 and d17 without changing selection, closure, delivery or sample facts. Selected model coverage is prior-review-delta and nit-batch-row only: prior-item rendering and finding-artifact/non-file routing narration, not live writes or row admission.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| loop-worker | anthropic/claude-opus-5-5 | improved | 21509 | w1: fails -> holds (unplanned improvement); w2: fails -> holds (unplanned improvement); w3: fails -> holds (unplanned improvement); w4: fails -> holds (unplanned improvement); w5: fails -> holds (unplanned improvement); w6: fails -> holds (unplanned improvement); w7: holds -> holds (held) |
| loop-worker | github-copilot/gpt-6.1-sol | improved | 22675 | w1: fails -> holds (unplanned improvement); w2: fails -> holds (unplanned improvement); w3: fails -> holds (unplanned improvement); w4: fails -> holds (unplanned improvement); w5: fails -> holds (unplanned improvement); w6: fails -> holds (unplanned improvement); w7: holds -> holds (held) |

## Feedback

- loop-worker / anthropic/claude-opus-5-5: Nothing regressed: After keeps w7 (no nit dispatch, no npm test, no push, no pre-push reviewer) and additionally satisfies w1–w6, which Before failed because it dispatched `implementer` with no output/file-only/acceptance fields, omitted the pre-dispatch iterations/pending writes and the iteration/base/previous-decision/hint/Leg/Rules task fields, baked the drafted payload, commit rule and report shape into the shared context, folded the apply/commit/restore rules into the shared text rather than the Claude Code tail, and admitted the pi return without checking the pending tuple, iteration, evidence or diff while substituting its own notes for the worker's decision line. The Change (prior-item rendering under Blockers/Nits with posted text unchanged) does not touch this case's facts, so no wording adjustment is needed; keep the After structure — a neutral shared context, a pi tail that lets the worker choose the fix under the Companion result commit contract with needs/contract-exception routing, a Claude Code tail that owns the apply/commit/restore rules, and an admission that verifies tuple, iteration, status/attempts agreement, command-first evidence distinct from npm test, and a nonempty tracked diff before appending the decision and clearing pending.
- loop-worker / github-copilot/gpt-6.1-sol: Nothing regressed in After; every fact Before kept (only w7) is still kept, and After additionally satisfies w1–w6 because it actually runs the pi companion row-worker protocol (loop-implementer, file-only output, acceptance none, ledger iterations/pending writes, fix-choice tail with the Companion result commit contract, row/decision admission and a single counted round) and keeps the shared context free of commit rules, reply formats and a mandatory drafted payload, pushing those into the Claude Code tail with the 'no scoped test' alternative and the restore-on-failure checks. Before failed w1–w6 by refusing the companion protocol outright, dispatching plain `implementer`, embedding the commit/return format and the 'apply the drafted payload' instruction in the shared context, and declining to update the ledger row or decisions. The Change itself (prior-review-item rendering under Blockers/Nits with the reviewer's text and locator verbatim, prior-review-delta/d9/d17) is not exercised by this case, so no wording adjustment is needed here; just confirm the prior-item rendering clarification does not reintroduce any general-wording rewrite rule that could be read as applying to task-context blocks like the shared context, which must stay free of reply-format constraints to keep w4.

exit: 0
