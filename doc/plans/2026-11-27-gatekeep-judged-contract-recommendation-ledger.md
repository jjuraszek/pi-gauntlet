# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gatekeep-judged-contract-recommendation.md`
base: 0aa921924709a632214d4050c42fe7464899862d
verification: npm test
checks: commands
iterations: 4
allowance: 10
returned: 5 | home | ab5c22974f44d582039fc92ed2d772b5e1b4c7e9

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 15 jq -e '[.judge[].facts.ticket.after] == ["holds","holds"]' eval/gatekeep-pr/results/contract-row-judged/candidate.json; true; contract-row-judged improved on both models after 2 baseline replays, 2 candidate replays and 2 judgments |
| 2 | done | 0 | timeout -k 30 15 jq -e '[.judge[].facts.necessary.after] == ["holds","holds"]' eval/gatekeep-pr/results/contract-row-judged/candidate.json; true; both replays backed a bundled index for offline search |
| 3 | done | 1 | timeout -k 30 15 jq -es '[.[0].judge[].facts.viable.after, .[1].judge[].facts.contract.after] == ["holds","holds","holds","holds"]' eval/gatekeep-pr/results/contract-row-judged/candidate.json eval/gatekeep-pr/results/action-row-one/candidate.json; true; both models kept the contract with a silent ticket and with no ticket; action-row-one ran 2 baseline replays, 2 candidate replays and 2 judgments |
| 4 | done | 0 | timeout -k 30 15 jq -e '[.judge[].facts.unknown.after] == ["holds","holds"]' eval/gatekeep-pr/results/contract-row-judged/candidate.json; true; both replays kept the blue label and identified the missing reason for green |
| 5 | done | 1 | timeout -k 30 15 jq -es '[.[0].judge[].facts.message.after, .[1].judge[].facts.f2.after] == ["holds","holds","holds","holds"]' eval/gatekeep-pr/results/contract-row-judged/candidate.json eval/gatekeep-pr/results/consent-contract-change-stop/candidate.json; true; contract-row-judged passed on both models with 2 candidate replays and 2 judgments; consent-contract-change-stop passed on both with 2 baseline replays, 2 candidate replays and 2 judgments |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | timeout -k 30 30 node --test scripts/gatekeep-obstacle-recommendation.test.mjs; 2 passed, 1 failed; menus.md still pins the contract-exception recommendation to preserve contract |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Both replays recommended accepting the ticket's requested receipt downloads over the viable email repair. | Reuse findings.md's Contract judgment for first-report severity and contract-row-judged's saved cases for menu checks.
row 2 done | Both replays recommended changing the hosted-index requirement because it prevented offline search. | nothing new to build on
row 4 done | Both replays recommended keeping the blue label and explained that no separate goal justified switching to green. | nothing new to build on
row 3 done | Both models recommended keeping the requirement when a repair could deliver the goal, with no ticket or a silent ticket. | Reuse action-row-one case G and its saved replies to check the three-sentence menu for a viable endpoint repair.
row 5 done | Both models showed the competing wordings and kept the argument to three sentences; without a spec, they showed the PR's own promise. | Reuse the saved contract-row-judged and consent-contract-change-stop replies to check menu wording with and without a spec.
