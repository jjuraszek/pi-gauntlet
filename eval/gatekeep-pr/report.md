# eval report: gatekeep-pr (partial run: description-not-a-row)

for: 0d9e52ed95f3a1b17bb5de7faa3aca51c757fc4e1ca1843916484b3a70b38261

wall: 64s

## Change

Retain finding artifact locators and row history across wave settlement and private handoffs until terminal teardown, with missing-locator validation at the continuation owners. Admit failed needs/contract-exception companion results without charging a round; charge an independent ordinary source-changing result in the same pass once. Selected samples are blockers-bare-fix (two serial loop rows and scoped commands), description-not-a-row (no row for body-only work, stale head/body comparison, readback and affected-claim recheck), and prior-review-delta (separate needs-stop and successful prior-closure checkpoints). Preserve the posted text and locator for open prior-review items. This is sample-scoped coverage, not a target-wide pass or live admission/push verification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| description-not-a-row | anthropic/claude-opus-5-5 | unchanged | 20461 | p1: holds -> holds (held); p2: holds -> holds (held); p3: holds -> holds (held); p4: holds -> holds (held); p5: holds -> holds (held) |
| description-not-a-row | github-copilot/gpt-6.1-sol | unchanged | 20429 | p1: holds -> holds (held); p2: holds -> holds (held); p3: holds -> holds (held); p4: holds -> holds (held); p5: holds -> holds (held) |

## Feedback

- description-not-a-row / anthropic/claude-opus-5-5: Nothing moved: After keeps every fact Before kept. Both narrate the stale-proposal iteration (head/body compare, invalidation, re-propose from the updated-note body, no write/sync/push, course retained), the second iteration's fresh compare-and-swap before the repository-scoped `gh pr edit`, the exact readback body `Reject unsigned events. The rejected path has no test yet. Keep this updated note.`, an affected-only K1 recheck with K2 untouched, zero round/sync charges, no finding spec/companion ledger/file worker, and C1 left as an unposted draft behind an explicit reply pick. After actually tightens the artifact facts by stating plainly that 'P1 and C1 never became an AC or ledger row', whereas Before's 'Its ID stays in the ledger' sits awkwardly next to 'there are no rows' and could confuse a reader; keep After's phrasing. Two small drifts worth watching in After, neither fact-breaking: the 'Delivers:' line now folds the description edit into the delivery claim, and the 'PR comments:' section from Before was dropped from the final render even though C1's row is unchanged — restoring that block would keep the final menu's comment visibility consistent with the retained C1 row while still delivering the description-not-a-row sample.
- description-not-a-row / github-copilot/gpt-6.1-sol: After keeps every fact Before kept: the first pre-write read compares head and body, invalidates the stale proposal and ends the iteration with no write/sync/push or menu; the second iteration re-reads before the repo-scoped `gh pr edit`, reads back the exact final body `Reject unsigned events. The rejected path has no test yet. Keep this updated note.`, dispatches one fresh report-only worker that rechecks only K1 against the actual body/head and existing CI evidence while leaving K2 matched; P1 and C1 become no AC/ledger row, no finding artifact or file worker is created, counters stay 0/10, and C1 remains an unposted draft. After is actually tighter than Before on the description-not-a-row point ("Neither P1 nor C1 becomes a finding AC or ledger row") where Before's "C1 stays its existing comment-ledger row" could be misread. Two small opportunities if you revise further: state explicitly in step 5 that the refreshed replacement body preserves the original scope/intent baseline (Before says this; After only implies it via the body text), and consider restoring Before's `Delivers:` line mentioning the description correction, since After's narrower `Delivers: Rejects unsigned events.` drops the description repair from the summary without any fact requiring that change.

exit: 0
