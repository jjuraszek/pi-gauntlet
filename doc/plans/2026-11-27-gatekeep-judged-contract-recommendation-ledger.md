# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gatekeep-judged-contract-recommendation.md`
base: 0aa921924709a632214d4050c42fe7464899862d
verification: npm test
checks: commands
iterations: 7
allowance: 10
returned: 10 | home | 84d61ac3af60b2d32c45dcfd1f3e8b34b8494845

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 15 jq -e '[.judge[].facts.ticket.after] == ["holds","holds"]' eval/gatekeep-pr/results/contract-row-judged/candidate.json; true; contract-row-judged improved on both models after 2 baseline replays, 2 candidate replays and 2 judgments |
| 2 | done | 0 | timeout -k 30 15 jq -e '[.judge[].facts.necessary.after] == ["holds","holds"]' eval/gatekeep-pr/results/contract-row-judged/candidate.json; true; both replays backed a bundled index for offline search |
| 3 | done | 1 | timeout -k 30 15 jq -es '[.[0].judge[].facts.viable.after, .[1].judge[].facts.contract.after] == ["holds","holds","holds","holds"]' eval/gatekeep-pr/results/contract-row-judged/candidate.json eval/gatekeep-pr/results/action-row-one/candidate.json; true; both models kept the contract with a silent ticket and with no ticket; action-row-one ran 2 baseline replays, 2 candidate replays and 2 judgments |
| 4 | done | 0 | timeout -k 30 15 jq -e '[.judge[].facts.unknown.after] == ["holds","holds"]' eval/gatekeep-pr/results/contract-row-judged/candidate.json; true; both replays kept the blue label and identified the missing reason for green |
| 5 | done | 1 | timeout -k 30 15 jq -es '[.[0].judge[].facts.message.after, .[1].judge[].facts.f2.after] == ["holds","holds","holds","holds"]' eval/gatekeep-pr/results/contract-row-judged/candidate.json eval/gatekeep-pr/results/consent-contract-change-stop/candidate.json; true; contract-row-judged passed on both models with 2 candidate replays and 2 judgments; consent-contract-change-stop passed on both with 2 baseline replays, 2 candidate replays and 2 judgments |
| 6 | done | 1 | timeout -k 30 15 jq -e '[.judge[].facts.backed.after, .judge[].facts.addition.after] == ["holds","holds","holds","holds"]' eval/gatekeep-pr/results/spec-stale-nit/candidate.json; true; spec-stale-nit ran 2 baseline replays after shortening an over-cap case, 2 candidate replays and 2 judgments |
| 7 | done | 0 | timeout -k 30 15 jq -e '[.judge[].facts.keep.after] == ["holds","holds"]' eval/gatekeep-pr/results/spec-stale-nit/candidate.json; true; both replays blocked departures when title sorting met the goal or the reason for changing it was unknown |
| 8 | done | 0 | timeout -k 30 15 jq -e '[.judge[].facts.independent.after] == ["holds","holds"]' eval/gatekeep-pr/results/spec-stale-nit/candidate.json; true; both replays blocked the untested branch independently of the stale spec |
| 9 | done | 1 | timeout -k 30 15 jq -e '[.judge[].facts.handoff.after] == ["holds","holds"]' eval/gatekeep-pr/results/spec-stale-nit/candidate.json; true; spec-stale-nit ran 2 candidate replays and 2 judgments; both adopted the displayed wording only after confirming the pushed edit |
| 10 | done | 1 | timeout -k 30 30 node --test scripts/gatekeep-obstacle-recommendation.test.mjs; 4 passed, 0 failed; the menu and product docs no longer pin preserve contract |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Both replays recommended accepting the ticket's requested receipt downloads over the viable email repair. | Reuse findings.md's Contract judgment for first-report severity and contract-row-judged's saved cases for menu checks.
row 2 done | Both replays recommended changing the hosted-index requirement because it prevented offline search. | nothing new to build on
row 4 done | Both replays recommended keeping the blue label and explained that no separate goal justified switching to green. | nothing new to build on
row 3 done | Both models recommended keeping the requirement when a repair could deliver the goal, with no ticket or a silent ticket. | Reuse action-row-one case G and its saved replies to check the three-sentence menu for a viable endpoint repair.
row 5 done | Both models showed the competing wordings and kept the argument to three sentences; without a spec, they showed the PR's own promise. | Reuse the saved contract-row-judged and consent-contract-change-stop replies to check menu wording with and without a spec.
row 6 done | Both replays offered merge for ticket-backed recipe sorting and proposed a missing clause for offline trail lookup. | Reuse the spec-stale-nit sample to check report severity and its simulated fix nits handoff.
row 7 done | Both replays blocked the sort change when title sorting met the goal or the reason for switching was unknown. | nothing new to build on
row 8 done | Both replays kept the untested branch for never-opened recipes as a blocker while listing the stale spec as a smaller point. | nothing new to build on
row 9 done | Both replays applied the displayed spec edit without another menu and adopted it only after confirming the pushed wording. | Reuse spec-stale-nit case E for the handoff and the worker-tail assertions for both harnesses.
row 10 done | The product docs now explain when the ticket or PR goal warrants changing the contract instead of always recommending preservation. | Use README.md for the first-report behavior and doc/gate-contract.md for the row 1 rule.
