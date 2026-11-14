# eval report: loop-implementation (partial run: ledger-repair-counts)

for: faa47f0c2124a36cc212addfab2bf037edfe0f38d1fcaecd0b3b9e025b256d3a

wall: 26s

## Change

Use shared wording at loop commit sites and pass its absolute path plus the resolved ticket to workers. Admit home returns through the ledger's returned/pending tuple and consumed iterations, and companion returns through a checkout-local file. Record repairs and count attempts in ledger decisions rather than commit messages. Select returned-line-admission only; retain other samples and result records without claiming current coverage.

## Coverage

This invocation selects only `ledger-repair-counts`; the Change section retains the existing target intent. Both models hold all four facts against the unchanged production instructions. These are isolated budget decisions, not executable driver or end-to-end proof. The local replay check is `timeout -k 30 120 node --test scripts/loop-repair-counts.test.mjs` (4 passed).

The comparison uses baseline `b3e8496dbbca77bf8cdf6da3c4e2e0363a453701`, which already holds the current counting instructions. The original loop base lacks the shared wording file required by another sample's bundle and was refused before model calls. Baseline seeding made 2 replay calls; comparison made 2 replay and 2 judge calls, with no confirmations. Prior `returned-line-admission` [baseline](results/returned-line-admission/baseline.json) and [candidate](results/returned-line-admission/candidate.json) records remain unchanged; no other sample was run.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ledger-repair-counts | anthropic/claude-opus-5-5 | unchanged | 7005 | seed-stop: holds -> holds (held); verification-reservation: holds -> holds (held); settled-count: holds -> holds (held); ledger-only: holds -> holds (held) |
| ledger-repair-counts | github-copilot/gpt-6.1-sol | unchanged | 11545 | seed-stop: holds -> holds (held); verification-reservation: holds -> holds (held); settled-count: holds -> holds (held); ledger-only: holds -> holds (held) |

## Feedback

- ledger-repair-counts / anthropic/claude-opus-5-5: No fact moved: both outputs count A as three repair seed decisions with 'Stopped on seed' / 'seed: 3 of 3', no dispatch, iterations 3 and attempts 0 unchanged; both count B as two repair verification lines plus the pending tuple, exclude the row retry and its 99, and name recovery of the outstanding tuple as the next step without performing it; both count C as three decision lines with no pending, iterations 42 and no double count; and both draw counts only from ledger Decisions and the pending header while explicitly saying commit messages are not consulted. The After wording keeps this intact, so the ledger-decisions counting rule and the 'recover outstanding tuple before any new gate run or dispatch, including at allowance' sentence should be kept as is. Minor drift to watch: After's A section adds negated procedure detail ('no mktemp and no subagent', 'no refresh') and expands the option lines and Problem line beyond the verbatim latest decision, and it changes the Recommendation to 'none'; none of that breaks a fact here, but if the stop block is meant to be a fixed template, state that the Problem line quotes the latest decision verbatim and that option lines are rendered unannotated, and keep the instruction to stay at the budget decision so worker/dispatch mechanics from the new shared-wording and ticket-passing text do not leak into budget-only answers. After's B also dropped the explicit statement that iterations stays 42 in favor of 'no further iteration bump is due'; keeping the explicit header value would be safer.
- ledger-repair-counts / github-copilot/gpt-6.1-sol: No fact moved: both outputs count seed repairs from the three `repair seed` decision lines with `Stopped on seed` / `seed: 3 of 3`, reserve 3 verification repairs in B from two decisions plus the pending tuple while ignoring the row retry, name recovery as the next step without performing it, and count 3 in C without double counting, all from ledger Decisions and the pending header with no commit-message reads. The closest call is settled-count in After: section C no longer says that iterations remain 42, which Before stated explicitly. I judged it as holding because After proposes no iteration bump or second marker and takes the count from the three decision lines with no pending, but a stricter reader could fail it. To make this robust, the wording should prompt the output to restate that the iterations header is unchanged whenever a settled marker replaces a reservation. After also adds forward-looking remarks ("Seed remains the target if additional seed budget is later authorized") and changes the choices block to `retry 1 | <hint>`; neither breaks a fact, but tightening the wording to stop at the budget decision and keep the generic choice rendering would reduce the risk to ledger-only and seed-stop while still delivering ledger-based repair counting.

exit: 0
